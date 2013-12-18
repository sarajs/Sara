/*!
 *
 * VIEW
 *
 */

var _ = require('../utilities')
  , DOM = require('./dom')

// The view constructor
with (DOM) var View = module.exports = (function ViewConstructor(name, initialize) {
	
	this._name = name
	this._initialize = initialize
	
}).method('render', function (context) {
	
	if (this._initialize) this._initialize()
	if (this._layout) return this._layout.render(_.extend.call({ 'body': this._html }, context))
	else return this._html.toString(context)

}).method('layout', function (layout) {
  
  this._layout = layout
  return this
  
}).method('html', function (array) {
  
  with (NODE_TYPES) this._html = new Node(DOCUMENT_NODE, 'document', {}, new NodeList(array))
  return this
  
})

// The data constructor
var Data = View.Data = (function DataConstructor(key) {
  this.key = key
}).method('toString', function (context) {
  return context[this.key]
})