/*!
 *
 * HTML
 *
 * This is the class that converts either HTML strings or DJM arrays into virtual DOM nodes.
 *
 */

var _ = require('../utilities')
	, Node = require('./node')

var HTML = module.exports = (function HTML(content) {

  var DJM = []
	
	with (Node.NODE_TYPES) _.each.call(content, function createElements(node) {
		// A text node
		if (_.typeOf(node) === 'string') DJM.push(new Node(TEXT_NODE, null, null, node))
		
		// An element node
		if (_.typeOf(node) === 'array') {
			var name = node[0]
				, attributes
				, content
			
			// content and attributes
			_.each.call(node, function (value) {
				if (_.typeOf(value) === 'string') return content = value
				if (_.typeOf(value) === 'array') return content = _.each.call(content, createElements)
				if (_.typeOf(value) === 'object') return attributes = value
			}, 1)
		
			DJM.push(new Node(ELEMENT_NODE, name, attributes, content))
		}
	})
	
	return DJM
	
})