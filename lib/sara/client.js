/*!
 *
 * CLIENT
 *
 * Client versions of Sara methods.
 *
 */

// Modules
var http = require('http')
  , EventListener = require('./event-listener')
  , util = require('util')
  , _ = require('lodash')

// Constructor
module.exports = function Client(app) {
  var engine = require('engine.io-client')
    , socket = engine(process.env.port)

  app.route({ method: 'GET', url: window.location.pathname })({}, {
    end: function () {}
  , writeHead: function () {}
  })

  // A client-side router
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

  // Event forwarding
  forwardEvents(['click', 'CheckboxStateChange', 'RadioStateChange', 'close', 'command', 'input', 'change', 'submit'])

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
        , bubbles: e.bubbles
        , cancelable: e.cancelable
        , constructorName: e.toString().replace('[object ', '').replace(']', '')
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