/*!
 *
 * VIEW
 *
 */

var _ = require('../utilities')

module.exports = (function View(name, object) {
	this._name = name
	
	_.extend.call(this, object)
}).method('render', function (context) {
	if (this.layout) return this.layout.render({ yield: this.html })
	else return this.html.toString()
})