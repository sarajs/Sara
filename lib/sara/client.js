/*!
 *
 * CLIENT
 *
 * Client versions of Sara methods.
 *
 */

// Modules
var _ = require('lodash')
  , adapterLocalStorage = require('../adapters/localstorage')
  , stream = require('stream')

// Constants
var readable = new stream.Readable()
  , writable = new stream.Writable()

readable._read = function () {}
writable._write = function () {}

// Constructor
module.exports = function setupClient(Sara, callback) {
  var engine = require('engine.io-client')
  Sara.socket = engine(process.env.port)

  Sara.clientId = document.querySelector('meta[name="saraClientId"]').content
  Sara.clients = { 0: Sara }

  Sara.socket.send(
    JSON.stringify({
      clientId: Sara.clientId
    , url: window.location.pathname
    })
  )

  Sara.socket.onmessage = function (e) {
    var str = e.data
  
    if (str.split(':')[0] !== 'mw') {
      str = JSON.parse(str)
      new Sara.Event(str)
    } else {
      var arg = str.split(':')

      arg.shift() // shift off 'mw'

      var id = arg.shift() // shift off the id
        , name = arg.shift() // shift off the name
        , resp = arg.shift() // shift off the response

      if (Sara.tasks[id] instanceof Function) Sara.tasks[id](resp)
   }
  }

  Sara.socket.onclose = function () {}

  var fns = [], listener
    , doc = document
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = /^loaded|^i|^c/.test(doc.readyState)

  if (!loaded)
    doc.addEventListener(domContentLoaded, listener = function () {
      doc.removeEventListener(domContentLoaded, listener)
      loaded = 1
      while (listener = fns.shift()) listener()
    })

    if (loaded) ready()
    else fns.push(ready)

  function ready() {
    _(Sara.resources).forIn(function (Constructor, name) {
      adapterLocalStorage(Constructor, function (datastore) {
        Constructor.db = datastore
        
        // Load the db
        Constructor.db.find({}, function (err, docs) {
          if (err) throw err
          if (docs.length) {
            docs.forEach(function (doc) {
              new Constructor(doc, false).push()
            })
          }
        })
      })
    })

    var target = document.createElement('a')
      , req = new stream.Readable()
    req._read = function () { /* noop */ }
    req.method = 'GET'

    window.onpopstate = function (e) {
      req.url = window.location.pathname
      var action = Sara.route(req)
      if (action instanceof Function) action(req, writable)
    }

    document.addEventListener('click', function serve(event) {
      req.url = event.target.pathname
      var action = Sara.route(req)

      if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass') && action instanceof Function) {
        if (event.preventDefault instanceof Function) event.preventDefault()
        window.history.pushState(null, event.target.textContent, event.target.href)
        action(req, writable)
      }
    })

    Sara.log('Ready!')
    callback()
  }
}
