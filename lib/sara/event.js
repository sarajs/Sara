/*!
 *
 * EVENT
 * A tiny event library for Sara.
 * Basically me avoiding forking JSDOM in order to resolve DOM implementation inconsistencies.
 *
 */

var Sara = require('../sara')
  , _ = require('./utils')

Sara.Event = module.exports = (function Event(e) {
	if (!e.target || e.target.nodeType === 3 || e.target.nodeType === 8) return false

  e.bubbles = e.bubbles || true
  e.cancelable = e.cancelable || true

  var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/
      , 'MouseEvents': /^(?:click|dblclick|contextmenu|mouse(?:down|up|over|move|out|enter|leave|wheele))$/
      , 'KeyboardEvents': /^(?:keypress|keyup|keydown)$/
      , 'InputEvents': /^(?:input|beforeInput)$/
      }
    , ontype = e.type.indexOf(":") < 0 && "on" + e.type
    , event = {}
    , constructor

  for (var name in eventMatchers) if (eventMatchers[name].test(e.type)) constructor = name

  if (!name) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported')

  if (typeof e.target[e.type] == 'function') e.target[e.type]() // special events like .click()

  if (document.createEvent) {
    event = document.createEvent(constructor)
    if (constructor == 'HTMLEvents') event.initEvent(e.type, e.bubbles, e.cancelable)
    else if (constructor == 'MouseEvents') event.initMouseEvent(e.type, e.bubbles, e.cancelable)
    else if (constructor == 'KeyboardEvents') event.initKeyboardEvent(e.type, e.bubbles, e.cancelable, window)
    else if (constructor == 'InputEvents') {
      event.initInputEvent(e.type, e.bubbles, e.cancelable, window)
      e.target.value = e.targetValue
    }

    console.log(e.srcElement.tagName)

    _(event).defaults(e)

    e.target.dispatchEvent(event)
  }
  else e.target.fireEvent(ontype, event)

  return event
})