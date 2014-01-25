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
        'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|textinput|resize|scroll)$/
      , 'MouseEvents': /^(?:click|dblclick|contextmenu|mouse(?:down|up|over|move|out|enter|leave|wheele))$/
      , 'KeyboardEvents': /^(?:keypress|keyup|keydown)$/
      }
    , ontype = type.indexOf(":") < 0 && "on" + type
    , event = {}
    , constructor

  for (var name in eventMatchers) if (eventMatchers[name].test(type)) constructor = name

  if (!name) throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported')

  if (target[type]) target[type]() // special events like .click()
  else if (document.createEvent) {
    event = document.createEvent(constructor)
    console.log(constructor)
    if (constructor == 'HTMLEvents') event.initEvent(type, bubbles, cancelable)
    else if (constructor == 'MouseEvents') event.initMouseEvent(type, bubbles, cancelable)
    target.dispatchEvent(event)
  }
  else target.fireEvent(ontype, event)

  return target
})