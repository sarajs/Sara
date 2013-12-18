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
		}

module.exports = (function Node(type, name, attributes, content) {
	this.type = type
	this.name = name
	this.attributes = attributes
	this.content = content
}).add('NODE_TYPES', NODE_TYPES)