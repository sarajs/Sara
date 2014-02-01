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
  forwardEvents(['click', 'CheckboxStateChange', 'RadioStateChange', 'close', 'command', 'input', 'beforeInput', 'change', 'submit', 'keypress', 'keyup', 'keydown'])

  function forwardEvents(types) {
    types.forEach(function (type) {
      document.addEventListener(type, function (e) {

        socket.send(JSON.stringify({
          type: e.type
        , bubbles: e.bubbles
        , cancelable: e.cancelable
        , constructorName: e.toString().replace('[object ', '').replace(']', '')
        , target: {
            saraId: saraIdFromNode(e.target)
          , value: e.target.value
          }
        , data: e.data
        , keyCode: e.keyCode
        , charCode: e.charCode
        , which: e.which
        , srcElement: {
            saraId: saraIdFromNode(e.srcElement)
          }
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

  function saraIdFromNode(target) {
    var saraId = ''

    // Construct the saraID based on the elements position in the DOM
    backwalkTheDOM(target, function (node) {
      if (node.parentNode) {
        var childElements = _.filter(node.parentNode.childNodes, function (node) {
                              return node.nodeType === 1
                            })
        saraId = _.indexOf(childElements, node) + '.' + saraId
      } else saraId = saraId.slice(0, -1)
    })

    return saraId
  }
}