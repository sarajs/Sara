var Sara = require('sara')
  , Todo = require('../models/todo')

exports.create = function (view) {
  if (view.state.text) {
    new Todo({ title: view.state.text }).save()

    view.setState({
      items: Todo.all()
    , text: ''
    })
  }
}