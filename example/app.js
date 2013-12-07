var Application = require('../sara.js')
  , Post = require('./resources/post')

module.exports = app = new Application({
  env: 'development'
, templating: 'handlebars'
})

app.get('/', app.router.posts)

app.routes(Post)