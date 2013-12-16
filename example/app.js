var Application = require('..')
  , Post = require('./resources/post')

var app = module.exports = new Application({
  env: 'development'
, templating: 'handlebars'
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
app.get('/', app.routes['/posts'])

app.routes['/'].html({
	navbar: [
		a: { content: 'homepage', href: 'http://google.com/' }
	, a: { content: 'homepage', href: 'http://google.com/' }
	]
})