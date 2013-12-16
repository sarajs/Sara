var Application = require('..')
  , Post = require('./resources/post')
  , PostView = require('./views/post')

var app = module.exports = new Application({
  env: 'development'
, layout: 'views/layout.html'
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