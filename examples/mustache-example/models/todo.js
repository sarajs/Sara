var TodoList = require('../app')

var Todo = module.exports = new TodoList.Model('Todo', {
  title: ''
, completed: false
})

Todo.active = function () {
  return this.where({ completed: false })
}

Todo.completed =function completed() {
  return this.where({ completed: true })
}
