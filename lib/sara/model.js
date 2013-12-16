/*!
 *
 * MODEL
 *
 * A class meant to be extended for creating resources.
 *
 */

var _ = require('../utilities')

module.exports = (function Model(name, schema) {

	var Model = (function (data) {
		this._id = this.constructor._app.history.posts.filter(function () { return this.method = 'POST' }) + 1
	})
	
	Model._name = name

	_.extend.call(Model, schema)

	return Model

}).add('all', function () {

	return { 'posts': this._app.cache.posts }

}).add('find', function (id) {

	var posts = this._app.cache.posts
		, i = posts.length

	while (i--) if (posts[i].id === id) return posts[i]
	
	return null

}).add(_.toJSON)