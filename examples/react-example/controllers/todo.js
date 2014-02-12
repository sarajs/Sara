var TodoList = require('../app')
  , Todo = require('../models/todo')

var TodoController = module.exports = new Sara.Controller()

/**
 * CREATE
 */
TodoController.action(function create(e) {

  if (this.state.text) new Todo({ title: this.state.text }).save()
  this.setState({ text: '' })

/**
 * CLEAR
 */
}).action(function clear(e) {

  Todo.completed().forEach(function (todo) {
    todo.destroy()
  })

/**
 * TOGGLE
 */
}).action(function toggleChecked(e) {

  Todo.find(this.props.key).set('completed', e.target.checked)

})
