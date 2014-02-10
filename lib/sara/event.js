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
  e.document = e.document || document

  var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/
      , 'MouseEvents': /^(?:click|dblclick|contextmenu|mouse(?:down|up|over|move|out|enter|leave|wheele))$/
      , 'KeyboardEvent': /^(?:keypress|keyup|keydown)$/
      , 'InputEvents': /^(?:input|beforeInput)$/
      , 'FocusEvent': /^(?:focusin|focusout|focus|blur)$/
      }
    , ontype = e.type.indexOf(":") < 0 && "on" + e.type
    , event = {}
    , constructor

  for (var name in eventMatchers) if (eventMatchers[name].test(e.type)) constructor = name

  if (!name) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported')

  // Update the target value if it has changed, events wont do this by themselves
  if (e.target.value != e.targetValue) e.target.value = e.targetValue

  // special event handlers like .click()
  if (typeof e.target[e.type] === 'function') e.target[e.type]()
  // real DOM events

  if (e.document.createEvent) { // Standard browser events
    event = e.document.createEvent(constructor)
    if (constructor == 'HTMLEvents') event.initEvent(e.type, e.bubbles, e.cancelable)
    else if (constructor == 'MouseEvents') event.initMouseEvent(e.type, e.bubbles, e.cancelable)
    else if (constructor == 'KeyboardEvent') event.initKeyboardEvent(e.type, e.bubbles, e.cancelable, window)
    else if (constructor == 'InputEvents') {
      event.initInputEvent(e.type, e.bubbles, e.cancelable, window)
    } else if (constructor == 'FocusEvent') {
      if (e.type == 'focusin') e.type = 'focus'
      else if (e.type == 'focusout') e.type = 'blur'
      event.initFocusEvent(e.type, e.bubbles, e.cancelable, window)
    }

    _(event).defaults(e)

    e.target.dispatchEvent(event)

  } else e.target.fireEvent(ontype, event) // IE events

  return event
})