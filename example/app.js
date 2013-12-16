var Sara = require('..')
  , Layout = require('./views/layout')
  , Post = require('./resources/post')
  , PostView = require('./views/post')
  , PostController = require('./controllers/post')

var app = module.exports = new Sara({
  env: 'development'
, layout: Layout
, cache: {
		'posts': [
			new Post({ id: 1, title: 'foo', content: 'bar' })
		, new Post({ id: 2, title: 'wat', content: 'wut' })
		]
	}
})

// Resources
app.resource(Post)

// Routes
app.get('/', PostController.index)