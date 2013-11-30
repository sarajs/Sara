var Application = require('../sara.js')
  , Presenter = require('./presenter')
  , Post = require('./resources/post')

module.exports = new Application({
  templating: 'handlebars'
, presenter: Presenter
, resources: {
    'post': Post
  }
, cache: {
    'posts': [
      { id: 1, title: 'foo', content: 'wat' }
    , { id: 2, title: 'bar', content: 'whut' }
    ]
  }
, routes: {
    '/': { resource: Post, action: 'all', template: 'posts/index.html' }
  }
})