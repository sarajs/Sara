/*!
 *
 * CONTROLLER
 *
 */

var _ = require('../utilities')

module.exports = (function Controller(name, actions) {
	this._name = name
	
	_.extend.call(this, actions)
})