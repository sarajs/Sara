/*!
 *
 * HTML
 *
 * This is the class that converts either HTML strings or DJM arrays into virtual DOM nodes.
 *
 */

var _ = require('../utilities')
	, Node = require('./node')

module.exports = (function HTML(content) {

	return function createElements(content) {
		var HTML = []
	
		with (Node.NODE_TYPES) _.each.call(content, function (node) {
			// A text node
			if (_.typeOf(node) === 'string') HTML.push(new Node(TEXT_NODE, null, null, node))
			
			// An element node
			if (_.typeOf(node) === 'array') {
				var name = node[0]
					, attributes
					, content
				
				// content and attributes
				_.each.call(node, function (value) {
				  console.log(value)
					if (_.typeOf(value) === 'string') return content = value
					if (_.typeOf(value) === 'array') return content = createElements(value)
					if (_.typeOf(value) === 'object') return attributes = value
				}, 1)
			
				HTML.push(new Node(ELEMENT_NODE, name, attributes, content))
			}
		})
		
		HTML.toString = function toString() {
		  console.log(HTML)
			var string = ''
		
			with (Node.NODE_TYPES) _.each.call(this, function (node) {
				// A text node
				if (node.type === TEXT_NODE) string += node
				
				// An element node
				if (node.type === ELEMENT_NODE) {
					string += '<' + node.name
					
					// attributes
					if (node.attributes) {
						string += ' '
						for (var attribute in node.attributes) {
							string += attribute + '="' + node.attributes[attribute] + '"'
						}
					}
					string += '>'
					
					// content
					if (node.content) {
						string += node.content.toString()
						string += '</' + node.name + '>'
					}
				}
			})
			
			return string
		}
		
		return HTML
	}(content)
	
})