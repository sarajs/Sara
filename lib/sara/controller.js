/*!
 *
 * CONTROLLER
 * A controller constructor
 *
 */

// Modules
var _ = require('./utils')

// Constructor
var Controller = module.exports = (function Controller() {})

_.class(Controller)

Controller.method('action', function (fn) {
  this[fn.name] = function (e) {
    e.preventDefault()
    fn.bind(this)()
  }
  return this
})
