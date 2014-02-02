/*!
 *
 * CLIENT
 *
 * Client versions of Sara methods.
 *
 */

// Modules
var EventListener = require('./event-listener')
  , _ = require('lodash')
  , domready = require('domready')

// Constructor
module.exports = function Client(app) {
  var engine = require('engine.io-client')
    , socket = engine(process.env.port)

  socket.send(
    JSON.stringify({
      clientId: document.querySelector('meta[name="saraClientId"]').content
    , url: window.location.pathname
    })
  )

  domready(function () {
    app.visit(window.location.pathname)({}, {
      end: function () {}
    , writeHead: function () {}
    }, window)
  })

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

  // Event forwarding
  forwardEvents(['click', 'CheckboxStateChange', 'RadioStateChange', 'close', 'command', 'input', 'beforeInput', 'change', 'submit', 'keypress', 'keyup', 'keydown'])

  function forwardEvents(types) {
    types.forEach(function (type) {
      document.addEventListener(type, function (e) {

        socket.send(
          JSON.stringify({
            clientId: document.querySelector('meta[name="saraClientId"]').content
          , type: e.type
          , bubbles: e.bubbles
          , cancelable: e.cancelable
          , constructorName: e.toString().replace('[object ', '').replace(']', '')
          , target: {
              saraId: saraIdFromNode(e.target)
            , value: e.target.value
            }
          , url: window.location.pathname
          , data: e.data
          , keyCode: e.keyCode
          , charCode: e.charCode
          , which: e.which
          , srcElement: {
              saraId: saraIdFromNode(e.srcElement)
            }
          })
        )
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