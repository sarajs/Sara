var Sara = require('sara')
  , Todo = require('../models/todo')

var TodoController = module.exports = new Sara.Controller({

}).action(function create() {

  if (this.state.text) new Todo({ title: this.state.text }).save()
  this.state.text = ''

}).action(function clear() {

  Todo.completed().forEach(function (todo) {
    todo.destroy()
  })

}).action(function toggleChecked(e) {

  Todo.find(this.props.key).set('completed', e.target.checked)

})
