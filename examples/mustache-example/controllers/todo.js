var App = require('sara')
  , Todo = require('../models/todo')

global.Todo = Todo

var TodoController = module.exports = new App.Controller()

/**
 * CREATE
 */
.action(function create(e) {
  var input = document.querySelector('input[type="text"]')
  if (input.value) new Todo({ title: input.value }).save()
  input.value = ''
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
  Todo.find(this.id).set('completed', e.target.checked)
})
