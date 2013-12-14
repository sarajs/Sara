var Application = require('..')
  , Post = require('./resources/post')

var app = module.exports = new Application({
  env: 'development'
, templating: 'handlebars'
, layout: 'views/layout.html'
})

// Resources
app.resource(Post)

// Routes
app.get('/', app.routes['/posts'])