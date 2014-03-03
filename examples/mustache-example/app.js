// Modules
var App = require('sara')
  , TodoView = require('./views/todo')
  , AboutView = require('./views/about')

App.storage('todolist', require('../../lib/adapters/mongodb'))
  .layout('./templates/layout.html')
  .routes({
    '/': TodoView.render
  , '/about': AboutView.render
  })
  .init({ env: 'development', port: 1338 })
