var Application = require('../sara.js')
  , Post = require('./resources/post')

module.exports = app = new Application({
  env: 'development'
, templating: 'handlebars'
, layout: 'views/layout.html'
})

// Resources
app.resource(Post)

// Routes
app.get('/', app.routes['/posts'])