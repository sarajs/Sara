/*!
 *
 * VIEW
 *
 */

var _ = require('../utilities')
  , DOM = require('./dom')

with (DOM) var View = module.exports = (function ViewConstructor(name, initialize) {
	
	this._name = name
	this._initialize = initialize
	
}).method('render', function (context) {
	
	this._initialize()
	if (this._layout) return this._layout.render({ yield: this.html })
	else return this.html.toString()

}).method('layout', function (layout) {
  
  this._layout = layout
  return this
  
}).method('html', function (array) {
  
  with (DOM.NODE_TYPES) this.html = new Node(DOCUMENT_NODE, 'document', {}, new NodeList(array))
  return this
  
})