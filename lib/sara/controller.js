/*!
 *
 * CONTROLLER
 *
 * This class does nothing at the moment other than keep the libraries syntax simple ('new' keyword use everywhere).
 *
 */

var _ = require('../utilities')

module.exports = (function Controller(name, actions) {

	this._name = name	
	_.extend.call(this, actions)

})