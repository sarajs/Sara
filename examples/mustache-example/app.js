// Modules
var Sara = require('../../lib/sara')

// Our app
var TodoList = module.exports = new Sara()

  .storage(require('../../lib/adapters/mongodb'))

  .layout('./templates/layout.html')

  .initialize(function () {

    var Todo = require('./models/todo')
      , TodoView = require('./views/todo')
      , AboutView = require('./views/about')
      , TodoController = require('./controllers/todo')

    this.routes({
      '/': function () {
        return TodoView.render(Todo.all())
      }
    , '/about': function () {
        return AboutView.render()
      }
    })

  })
