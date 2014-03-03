// Modules
var App = require('sara')
  , Todo = require('./models/todo')
  , TodoView = require('./views/todo')
  , AboutView = require('./views/about')
  , TodoController = require('./controllers/todo')

App.storage('todolist', require('../../lib/adapters/mongodb'))

App.layout('./templates/layout.html')

App.routes({
  '/': function () {
    return TodoView.render(Todo.all())
  }
, '/new': function (req) {
    TodoController.create()
    return AboutView.render()
  }
, '/about': function () {
    return AboutView.render()
  }
})

App.init({ env: 'development' })
