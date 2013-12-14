/*!
 *
 * RESOURCE
 *
 * A class meant to be extended for creating resources.
 *
 */

var _ = require('./utility')

module.exports = (function (name, schema) {


}).add(function all() {

  return { posts: [{ id: 1, title: 'foo', content: 'wat' }, { id: 2, title: 'bar', content: 'wut' }] }

}).add(function find(id) {

  return { id: 1, title: 'foo', content: 'wat' }

}).add(_.extend)