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
var Data = View.Data = (function DataConstructor(type, value, content) {

  this.type = type
  this.value = value
  if (content) this.content = new NodeList(content)

}).method('toString', function (context) {
  if (this.type === 'data') return context[this.value]
  if (this.type === 'each') {
    var str = ''
    
    _.each.call(context[this.value], function (context) {
      str += this.content.toString(context)
    })
    
    return str
  }
  if (this.type === 'binding') return false
})