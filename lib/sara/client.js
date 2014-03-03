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
  , async = require('async')

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

  app.paths[window.location.pathname]()
  window.onpopstate = function(e) {
    app.paths[window.location.pathname]()
  }

  // A client-side router
  document.addEventListener('click', function (event) {
    if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass')) {
      event.preventDefault()

      window.history.pushState(null, event.target.textContent, event.target.href)

      app.visit(event.target.pathname)({}, {
        end: function () {}
        , writeHead: function () {}
      }, window)
    }
  })

  callback()
}
