/*!
 *
 * VIEW
 *
 */

var _ = require('../utilities')
  , Node = require('./node')
  , HTML = require('./html')

module.exports = (function View(name, initialize) {
	
	this._name = name
	this._initialize = initialize
	
}).method('render', function (context) {
	
	this._initialize()
	if (this.layout) return this.layout.render({ yield: this.html })
	else return this.html.toString()

}).method('html', function (DJM) {
  
  with (Node.NODE_TYPES) this.html = new Node(DOCUMENT_NODE, 'document', {}, new HTML(DJM))
  
  return this
  
})