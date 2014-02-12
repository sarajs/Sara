// Modules
var Sara = require('../../lib/sara')

// Our app
var TodoList = module.exports = new Sara()
  .layout('./templates/layout.html')
  .initialize(function () {
    var Todo = require('./models/todo')
      , TodoView = require('./views/todo')
      , AboutView = require('./views/about')

    this.paths({
      '/': function (req, res) {
        TodoView.render(Todo.all(), res)
      }
    , '/about': function () {
        AboutView.render()
      }
    })
  })
