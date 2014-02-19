/*!
 *
 * CONTROLLER
 * A controller constructor
 *
 */

// Modules
var _ = require('./utils')

// Constructor
function Controller() {}
module.exports = Controller

Controller.prototype.action = function (fn) {
  this[fn.name] = function (e) {
    if (e.target.getAttribute('href') || e.type == 'submit' || e.tagName == 'BUTTON') e.preventDefault()
    fn.bind(this)(e)
  }

  return this
}
