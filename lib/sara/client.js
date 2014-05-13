/*!
 *
 * CLIENT
 *
 * Client versions of Sara methods.
 *
 */

// Modules
var _ = require('lodash')
  , stream = require('stream')

// Constants
var readable = new stream.Readable()
  , writable = new stream.Writable()

readable._read = function () {}
writable._write = function () {}

// Constructor
module.exports = function setupClient(Sara, callback) {
  var adapterLocalStorage = require('../adapters/localstorage')

  _(Sara.resources).forIn(function (Constructor) {
    adapterLocalStorage(Constructor, function (db) {
      Constructor.db = db
      Constructor.db.find().stream().on('data', function (item) {
        Constructor.lastId = item.id
      })
    }, Sara)
  })

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
    var target = document.createElement('a')
      , req = new stream.Readable()

    req._read = function () { /* noop */ }
    req.method = 'GET'

    window.onpopstate = kick

    kick()

    function kick() {
      req.url = window.location.pathname
      var action = Sara.route(req)
      if (action instanceof Function) action(req, writable)
    }

    document.addEventListener('click', function serve(event) {
      var element = event.target
      while(element.parentNode) {
        if (element.pathname) {
          req.url = element.pathname
          var action = Sara.route(req)

          if (element.host === window.location.host && !element.getAttribute('data-bypass') && action instanceof Function) {
            event.preventDefault()
            window.history.pushState(null, element.textContent, element.href)
            action(req, writable)
          }
        }
        element = element.parentNode;
      }
    })

    Sara.log('Ready!')
    callback()
  }
}
