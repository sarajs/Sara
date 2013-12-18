/*!
 *
 * DOM
 *
 * A virtual document object model for NodeJS and the server.
 *
 */

var Sara = require('../..')
  , _ = require('../utilities')

var NODE_TYPES = exports.NODE_TYPES = {
  ELEMENT_NODE: 1
, ATTRIBUTE_NODE: 2
, TEXT_NODE: 3
, DOCUMENT_NODE: 9
}

var Node = exports.Node = (function NodeContructor(type, name, attributes, content) {
  this.type = type
  this.name = name
  this.attributes = attributes
  this.content = content
})

// Add the NODE_TYPES, like in the real DOM!
_.extend.call(Node, exports.NODE_TYPES)

// Convert a node to a string
Node.method('toString', function (context) {
  var str = ''

  with (NODE_TYPES) {
    // A text node
    if (this.type === TEXT_NODE) str += this
    
    // An element node
    if (this.type === ELEMENT_NODE) createTagFrom(this)
    
    // A document node
    if (this.type === DOCUMENT_NODE) createTagFrom(this.content)
    
    function createTagFrom(content) {
      if (content instanceof NodeList) _.each.call(content, createTagFrom)
      else {
        
        str += '<' + content.name
        
        // attributes
        if (content.attributes) {
          str += ' '
          for (var attribute in content.attributes) str += attribute + '="' + content.attributes[attribute] + '"'
        }
        str += '>'
            
        // content
        if (content.content) {
          str += content.content.toString(context)
          str += '</' + content.name + '>'
        }
      }
    }
  }
  
  return str
})

var NodeList = exports.NodeList = (function NodeListConstructor(array) {
  with (NODE_TYPES) _.each.call(array, function createElements(node) {
		// A text node
		if (_.typeOf(node) === 'string') this.push(new Node(TEXT_NODE, null, null, node))
		
		// An element node
		if (_.typeOf(node) === 'array') {
			var name = node[0]
				, attributes
				, content
			
			// Content and attributes
			with (Sara.View) _.each.call(node, function (value, i) {
        if (!i) return // Ignore the first array element, we know it's the tag name
				if (value instanceof Data) return content = value
				if (_.typeOf(value) === 'string') return content = value
				if (_.typeOf(value) === 'array') return content = new NodeList(value)
				if (_.typeOf(value) === 'object') return attributes = value
			})
		
			this.push(new Node(ELEMENT_NODE, name, attributes, content))
		}
	}, this)
})

// NodeList inherits from Array
NodeList.prototype = Object.create(Array.prototype)

NodeList.method('toString', function (context) {
  var str = ''

  _.each.call(this, function (node) {
    str += node.toString(context)
  })
  
  return str
})