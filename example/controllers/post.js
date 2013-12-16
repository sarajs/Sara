var Sara = require('../..')
	, app = require('../app')
	, Post = require('../resources/post')

with (Sara) module.exports = new Controller('Post', {

	// GET /posts
	'index': function (request) {
		var PostIndexView = require('../views/posts/index')
		return new PostIndexView(Post.all)
	}

	// GET /posts/:id
, 'show': function (request) {
		var PostShowView = require('../views/posts/show')
		return new PostShowView(Post.find(request.body.id))
	}

	// GET /posts/new
, 'new': function (request) {
		var PostNewView = require('../views/posts/new')
		return new PostNewView(new Post())
	}

	// GET /posts/:id/edit
, 'edit': function (request) {
		var PostEditView = require('../views/posts/edit')
		return new PostEditView(Post.find(request.body.id))
	}

	// POST /posts
, 'create': function (request) {
		new Post(request.body).save()
		return app.routes['/posts'].call()
	}

	// PUT /posts/:id
, 'update': function (request) {
		Post.find(request.body.id).update(request.body)
		return app.routes['/posts'].call()
	}

	// DELETE /posts/:id
, 'destroy': function (request) {
		Post.find(request.body.id).destroy()
		return app.routes['/posts'].call()
	}
	
})