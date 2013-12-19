/*!
 *
 * DOM
 *
 * A virtual document object model for NodeJS and the server.
 *
 */

var Sara = require('../../..')
  , _ = require('../../utilities')

var NODE_TYPES = exports.NODE_TYPES = {
  ELEMENT_NODE: 1
, ATTRIBUTE_NODE: 2
, TEXT_NODE: 3
, DOCUMENT_NODE: 9
}

var Node = exports.Node = require('./node')
var NodeList = exports.NodeList = require('./node-list')

// Add the NODE_TYPES, like in the real DOM!
_.extend.call(Node, NODE_TYPES)
_.extend.call(NodeList, NODE_TYPES)