var http = require('http')
  , EventListener = require('./event-listener')
  , util = require('util')
  , _ = require('lodash')

module.exports = function Client(app) {
  var engine = require('engine.io-client')
    , socket = engine(process.env.port)

  app.route({ method: 'GET', url: window.location.pathname })({}, {
    end: function () {}
  , writeHead: function () {}
  })

  // All the events Sara supports
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
        var saraID = ''

        // Construct the saraID based on the elements position in the DOM
        backwalkTheDOM(e.target, function (node) {
          if (node.parentNode) {
            var childElements = _.filter(node.parentNode.childNodes, function (node) {
                                  return node.nodeType === 1
                                })
            saraID = _.indexOf(childElements, node) + '.' + saraID
          } else saraID = saraID.slice(0, -1)
        })

        socket.send(JSON.stringify({
          type: e.type
        , targetSaraID: saraID
        }))
      })
    })
  }

  // Thank you Douglas Crockford!
  function backwalkTheDOM(node, func) {
    func(node)
    node = node.parentNode
    if (node) backwalkTheDOM(node, func)
  }
}