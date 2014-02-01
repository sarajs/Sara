/*!
 *
 * EVENT
 * A tiny event library for Sara.
 * Basically me avoiding forking JSDOM in order to resolve DOM implementation inconsistencies.
 *
 */

var Sara = require('../sara')

Sara.Event = module.exports = (function Event(type, target, bubbles, cancelable) {
	if (!target || target.nodeType === 3 || target.nodeType === 8) return false

  bubbles = bubbles || true
  cancelable = cancelable || true

  var eventMatchers = {
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/
      , 'MouseEvents': /^(?:click|dblclick|contextmenu|mouse(?:down|up|over|move|out|enter|leave|wheele))$/
      , 'KeyboardEvents': /^(?:keypress|keyup|keydown)$/
      , 'InputEvents': /^(?:input|beforeInput)$/
      }
    , ontype = type.indexOf(":") < 0 && "on" + type
    , event = {}
    , constructor

  for (var name in eventMatchers) if (eventMatchers[name].test(type)) constructor = name

  if (!name) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported')

  if (target[type]) target[type]() // special events like .click()
  else if (document.createEvent) {
    event = document.createEvent(constructor)
    if (constructor == 'HTMLEvents') event.initEvent(type, bubbles, cancelable)
    else if (constructor == 'MouseEvents') event.initMouseEvent(type, bubbles, cancelable)
    else if (constructor == 'KeyboardEvents') event.initKeyboardEvent(type, bubbles, cancelable, window)

    event.target = document.documentElement
    event.srcElement = document.documentElement
    event.keyCode = 65
    event.charCode = 65
    event.data = 'a'
    event.keyIdentifier = 'U+0041'
    event.keyLocation = 0
    event.which = 65
    event.metaKey = false
    event.altKey = false

    target.dispatchEvent(event)
    console.log(document.querySelector('input[type="text"]').value)
  }
  else target.fireEvent(ontype, event)

  return target
})