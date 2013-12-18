/*!
 *
 * Node
 *
 * This is our virtual DOM. Nodes should be rendered as DOM elements on the client and HTML strings on the server.
 * The purpose of this class is to propagate DOM manipulation and events that can't happen on the server down to the clients in sync.
 *
 */

var _ = require('../utilities')
	, NODE_TYPES = {
			ELEMENT_NODE: 1
		, ATTRIBUTE_NODE: 2
		, TEXT_NODE: 3
		, DOCUMENT_NODE: 9
		}

// The Node constructor
var Node = module.exports = (function Node(type, name, attributes, content) {
	this.type = type
	this.name = name
	this.attributes = attributes
	this.content = content
}).add('NODE_TYPES', NODE_TYPES)

// Convert a node to a string
Node.method('toString', function () {
	var str = ''
	
	console.log(this)

	with (Node.NODE_TYPES) {
		// A text node
		if (this.type === TEXT_NODE) str += this
		
		// An element node
		if (this.type === ELEMENT_NODE) str += createTagFrom(this)
		
		console.log(this.content)
		
		// A document node
		if (this.type === DOCUMENT_NODE) str += createTagFrom(this.content)
		
		function createTagFrom(content) {
		  console.log(content)
		  if (_.typeOf(content) === 'array') _.each.call(content, createTagFrom)
  		  else {
    		var str = ''
    		
    		str += '<' + content.name
  			
  			// attributes
  			if (content.attributes) {
  				str += ' '
  				for (var attribute in content.attributes) str += attribute + '="' + content.attributes[attribute] + '"'
  			}
  			str += '>'
  			
  			// content
  			if (content.content) {
  				str += content.content.toString()
  				str += '</' + content.name + '>'
  			}
  			
  			return str
		  }
		}
	}
	
	return str
})