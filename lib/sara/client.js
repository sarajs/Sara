var http = require('http')
  , EventListener = require('./event-listener')

module.exports = function Client(app) {
  var engine = require('engine.io-client')
    , socket = engine(process.env.port)

  app.route({ method: 'GET', url: window.location.pathname })({}, {
    end: function () {}
  , writeHead: function () {}
  })

  forwardEvents(['click'])

  // Forward click events
  document.addEventListener('click', function (event) {
    if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass')) {
      event.preventDefault()

      window.history.pushState(null, event.target.textContent, event.target.href)

      app.visit(event.target.pathname)(
        new http.ClientRequest()
      , new http.ServerResponse()
      )
    }
  })

  function forwardEvents(types) {
    types.forEach(function (type) {
      document.addEventListener(type, function (e) {

      })
    })
  }
}