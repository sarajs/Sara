/*!
 *
 * CLIENT
 *
 * Client versions of Sara methods.
 *
 */

// Modules
var _ = require('lodash')
  , domready = require('domready')

// Constructor
module.exports = function setupClient(app) {
  var engine = require('engine.io-client')
  app.socket = engine(process.env.port)

  app.clientId = document.querySelector('meta[name="saraClientId"]').content
  app.clients = {
    0: app
  }

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

  app.socket.onclose = function () {
    
  }

  app.tryInitRouter = function () {
    if (_.every(app.dbstatus)) {
      app.paths[window.location.pathname]()
    }
  }

  domready(app.tryInitRouter)

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
}
