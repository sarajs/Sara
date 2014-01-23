var http = require('http')
  , EventListener = require('./event-listener')

module.exports = function Client(app) {
  app.route({ method: 'GET', url: window.location.pathname })({}, {
    end: function () {}
  , writeHead: function () {}
  })
  /**
   * CLICK
   */
  document.addEventListener('click', function (event) {
    if (event.target.host === window.location.host && !event.target.getAttribute('data-bypass')) {
      event.preventDefault()

      history.pushState(null, event.target.textContent, event.target.href)

      app.visit(event.target.pathname)(
        new http.ClientRequest()
      , new http.ServerResponse()
      )
    }
  })

  function forwardEvent(type) {

  }
}