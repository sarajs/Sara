/*!
 *
 * Node
 *
 */

var _ = require('../utilities')
	, NODE_TYPES = {
			ELEMENT_NODE: 1
		, ATTRIBUTE_NODE: 2
		, TEXT_NODE: 3
		}

module.exports = (function Node(type, name, attributes, content) {
	this.type = type
	this.name = name
	this.attributes = attributes
	this.content = content
}).add('NODE_TYPES', NODE_TYPES)