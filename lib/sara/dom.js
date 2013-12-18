/*!
 *
 * DOM
 *
 * A virtual document object model for NodeJS and the server.
 *
 */

var _ = require('../utilities')

exports.NODE_TYPES = {
  ELEMENT_NODE: 1
, ATTRIBUTE_NODE: 2
, TEXT_NODE: 3
, DOCUMENT_NODE: 9
}

exports.Node = (function Node(type, name, attributes, content) {
  this.type = type
  this.name = name
  this.attributes = attributes
  this.content = content
})

_.extend.call(Node, NODE_TYPES)

// Convert a node to a string
Node.method('toString', function () {
  var str = ''

  with (Node.NODE_TYPES) {
    // A text node
    if (this.type === TEXT_NODE) str += this
    
    // An element node
    if (this.type === ELEMENT_NODE) createTagFrom(this)
    
    // A document node
    if (this.type === DOCUMENT_NODE) createTagFrom(this.content)
    
    function createTagFrom(content) {
      if (_.typeOf(content) === 'array') _.each.call(content, createTagFrom)
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
          _.each.call(content.content, function (node) {
            str += node.toString()
          })
          str += '</' + content.name + '>'
        }
      }
    }
  }
  
  return str
})

exports.NodeList = (function NodeList(array) {
  with (Node.NODE_TYPES) _.each.call(array, function createElements(node) {
		// A text node
		if (_.typeOf(node) === 'string') list.push(new Node(TEXT_NODE, null, null, node))
		
		// An element node
		if (_.typeOf(node) === 'array') {
			var name = node[0]
				, attributes
				, content
			
			// Content and attributes
			_.each.call(node, function (value, i) {
        if (!i) return // Ignore the first array element, it's the tag name
				if (_.typeOf(value) === 'string') return content = value
				if (_.typeOf(value) === 'array') {
				  content = new NodeList()
				  return _.each.call(value, createElements, content)
				}
				if (_.typeOf(value) === 'object') return attributes = value
			})
		
			this.push(new Node(ELEMENT_NODE, name, attributes, content))
		}
	}, DJM)
})

NodeList.method('push', Array.push)

// Convert a node to a string
NodeList.method('toString', function () {
  var str = ''

  _.each.call(this, function (node) {
    str += node.toString()
  })
  
  return str
})