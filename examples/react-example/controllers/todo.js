var App = require('sara')
  , Todo = require('../models/todo')

var TodoController = module.exports = new App.Controller()

/**
 * CREATE
 */
.action(function create(e) {
  if (this.state.text) new Todo({ title: this.state.text }).save()
  this.setState({ text: '' })
})

/**
 * CLEAR
 */

.action(function clear(e) {
  Todo.read('completed').pipe(Todo.write('destroy'))
})

/**
 * TOGGLE
 */
.action(function toggleChecked(e) {
  Todo.find(this.props.key).set('completed', e.target.checked)
})
