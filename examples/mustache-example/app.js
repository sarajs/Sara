// Modules
var App = require('sara')
  , Todo = require('./models/todo')
  , TodoView = require('./views/todo')
  , AboutView = require('./views/about')
  , TodoController = require('./controllers/todo')

App.storage('todolist', require('../../lib/adapters/mongodb'))
  .layout('./templates/layout.html')
  .routes({
    '/': TodoView.render
  , '/about': AboutView.render
  })
  .init({ env: 'development' })
