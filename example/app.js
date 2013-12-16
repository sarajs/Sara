var Sara = require('..')
  , Layout = require('./views/layout')
  , Post = require('./resources/post')
  , PostView = require('./views/post')
  , PostController = require('./controllers/post')

var app = module.exports = new Sara({
  env: 'development'
, cache: {
		'posts': [
			new Post({ title: 'foo', content: 'bar' })
		, new Post({ title: 'wat', content: 'wut' })
		]
	}
})

// Resources
app.resource(Post)

// Routes
app.get('/', PostController.index)
app.get('/posts', PostController.index)
app.get('/posts/:id', PostController.show)
app.get('/posts/:id/new', PostController.new)
app.get('/posts/:id/edit', PostController.edit)
app.post('/posts', PostController.create)
app.put('/posts/:id', PostController.update)
app.delete('/posts/:id', PostController.destroy)