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

Controller.prototype.action = function () {
  var middleware = Array.prototype.slice.call(arguments)
  this[middleware.shift()] = function (req, res, next) {
    _(middleware).forEach(function (mw) {
      mw(req, res)
    })
  }

  return this
}
