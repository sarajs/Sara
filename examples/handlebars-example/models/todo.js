var TodoList = require('../index')

var Todo = module.exports = new TodoList.Model('Todo', {
  title: ''
, completed: false
}).add(function active() {
  return this.where({ completed: false })
}).add(function completed() {
  return this.where({ completed: true })
})
