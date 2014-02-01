var Sara = require('sara')
  , Todo = require('../models/todo')

var TodoController = module.exports = new Sara.Controller()

TodoController.action(function create(view) {
  if (view.state.text) new Todo({ title: view.state.text }).save()
  view.state.text = ''
})

TodoController.action(function clear(view) {
  Todo.completed().forEach(function (todo) {
    todo.destroy()
  })
})