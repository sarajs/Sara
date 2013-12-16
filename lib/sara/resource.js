/*!
 *
 * RESOURCE
 *
 * A class meant to be extended for creating resources.
 *
 */

var _ = require('./utility')

module.exports = (function Resource(name, schema) {

	this._name = name
	_.extend(this, schema)

}).add(function all() {

	return { 'posts': this.cache }

}).add(function find(id) {

	var posts = this.app.cache.posts
		, i = posts.length

	while (i--) if (posts[i].id === id) return posts[i]
	
	return null

})