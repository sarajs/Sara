var Sara = require('..')
  , Post = require('./resources/post')
  , Layout = require('./views/layout')
  , PostView = require('./views/post')

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
app.get('/', PostView.index)