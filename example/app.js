var Application = require('../index')
  , Post = require('./resources/post')

module.exports = app = new Application({
  env: 'development'
, templating: 'handlebars'
, layout: 'views/layout.html'
})

// Resources
app.all(Post)

// Routes
app.get('/', app.routes['/posts'])