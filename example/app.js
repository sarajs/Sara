var Application = require('../sara.js')
  , Presenter = require('./presenter')
  , Post = require('./resources/post')

module.exports = app = new Application({
  templating: 'handlebars'
, presenter: new Presenter()
, resources: {
    'post': Post
  }
, routes: {
    '/': { context: Post.all, template: 'posts/index.html' }
  }
})