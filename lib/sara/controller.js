/*!
 *
 * CONTROLLER
 *
 * This class does nothing at the moment other than keep the libraries syntax simple ('new' keyword use everywhere).
 *
 */

var _ = require('../utilities')

module.exports = (function Controller(name, initialize) {

	this._name = name	
	this.initialize = initialize

}).add('action', _.add).add(_.add)