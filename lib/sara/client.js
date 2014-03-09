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
module.exports = function setupClient(app, callback) {
  var engine = require('engine.io-client')
  app.socket = engine(process.env.port)

  app.clientId = document.querySelector('meta[name="saraClientId"]').content
  app.clients = { 0: app }

  app.socket.send(
    JSON.stringify({
      clientId: app.clientId
    , url: window.location.pathname
    })
  )

  app.socket.onmessage = function (e) {
    e = JSON.parse(e)
    new app.Event(e)
  }

  app.socket.onclose = function () {}

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
    _(app.resources).forIn(function (Constructor, name) {
      adapterLocalStorage(Constructor, function (datastore) {
        Constructor.db = datastore
        
        // Load the db
        Constructor.db.find({}, function (err, docs) {
          if (err) throw err
          if (docs.length) {
            docs.forEach(function (doc) {
              new Constructor(doc).push()
            })
          }
        })
      })
    })

    window.onpopstate = function () {
      app.paths[window.location.pathname](readable, writable)
    }

    // A client-side router
    document.addEventListener('click', function (event) {
      if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass') && app.visit(event.target.pathname) !== undefined) {
        event.preventDefault()
        window.history.pushState(null, event.target.textContent, event.target.href)
        app.visit(event.target.pathname)(readable, writable, window)
      }
    })

    app.log('Ready!')
    callback()
  }
}
