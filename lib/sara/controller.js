/*!
 *
 * CONTROLLER
 * A controller constructor
 *
 */

// Modules
var _ = require('./utils')

// Constructor
function Controller() {
}
module.exports = Controller

Controller.prototype.action = function (fn) {
  this[fn.name] = fn

  return this
}
