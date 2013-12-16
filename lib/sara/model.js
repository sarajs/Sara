/*!
 *
 * MODEL
 *
 * A class meant to be extended for creating resources.
 *
 */

var _ = require('./utility')

with (_) module.exports = (function Model(name, schema) {

	this._name = name
	extend(this, schema)

}).add(function all() {

	return { 'posts': this.app.cache.posts }

}).add(function find(id) {

	var posts = this.app.cache.posts
		, i = posts.length

	while (i--) if (posts[i].id === id) return posts[i]
	
	return null

}).add(toJSON)