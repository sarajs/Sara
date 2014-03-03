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
    return TodoView.render({
      todos: Todo.all()
    , completed: Todo.completed().length
    }, '/')
  }
, '/completed': function (req) {
    TodoController.create()
    return AboutView.render(null, '/new')
  }
, '/about': function () {
    return AboutView.render(null, '/about')
  }
})

App.init({ env: 'development' })
