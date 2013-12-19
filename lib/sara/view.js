/*!
 *
 * VIEW
 *
 */

var _ = require('../utilities')
  , DOM = require('./dom')
  , Node = DOM.Node
  , NodeList = DOM.NodeList

// The view constructor
with (DOM) var View = module.exports = (function ViewConstructor(name, initialize) {
	
	this.name = name
	this._initialize = initialize
	this._partials = {}
	this._bodyBindingName = 'body'
	
}).method('render', function (context) {
  
  if (this._initialize) this._initialize()
	if (this._layout) return this._layout.render(context)
	else return this._html.render(context)

}).method('layout', function (layout) {
  
  if (arguments.length) {
    this._layout = layout
    return this
  } else return this._layout
  
}).method('html', function (array) {
  
  if (arguments.length) {
    with (NODE_TYPES) this._html = new Node(DOCUMENT_NODE, 'document', {}, new NodeList(array))
    return this
  } else return this._html
  
}).method('body', function (string) {
  
  this._bodyBindingName = string
  return this
  
}).method('partials', function (partials) {
  
  if (arguments.length) {
    var that = this
  
    if (_.typeOf(partials) !== 'array') partials = arguments
    _.each.call(partials, function (partial) {
      that._partials[partial.name] = partial
    })
    return this
  } else return this._partials
  
})