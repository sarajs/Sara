var Sara = require('sara')
  , Todo = require('../models/todo')

exports.create = function (view) {
  if (view.state.text) {
    new Todo({ title: view.state.text }).save()

    view.setState({
      items: Todo.all()
    , text: ''
    , remaining: Todo.active().length
    })
  }
}

exports.clear = function (view) {
  Todo.completed().forEach(function (todo) {
    todo.destroy()
  })

  view.setState({
    items: Todo.all()
  , text: ''
  , remaining: Todo.active().length
  })
}