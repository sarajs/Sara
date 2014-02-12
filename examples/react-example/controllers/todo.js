var Sara = require('sara')
  , Todo = require('../models/todo')

var TodoController = module.exports = new Sara.Controller({

/**
 * CREATE
 */
}).action(function create(e) {

  if (this.state.text) new Todo({ title: this.state.text }).save()
  this.state.text = ''

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
