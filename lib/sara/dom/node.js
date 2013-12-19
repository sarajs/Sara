/*!
 *
 * DOM.Node
 *
 * A virtual document object model for NodeJS and the server.
 *
 */
 
var _ = require('../../utilities')

// Our Node constructor
var Node = module.exports = (function NodeContructor(type, name, attributes, content) {
  this.type = type
  this.name = name
  this.attributes = attributes
  this.content = content
})

// Convert a node to a string
Node.method('render', function (context) {
  
})