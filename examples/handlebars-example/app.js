// Modules
var Sara = require('../../lib/sara')

// Our app
var TodoList = module.exports = new Sara()
  .layout('./templates/layout.html')
  .initialize(function () {
    var Todo = require('./models/todo')
      , TodoView = require('./views/todo')
      , AboutView = require('./views/about')

    this.routes({
      '/': function () {
        return TodoView.render(Todo.all())
      }
    , '/about': function () {
        return AboutView.render()
      }
    })
  })
