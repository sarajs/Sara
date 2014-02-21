var Sara = require('sara')

var Todo = module.exports = new Sara.Model('Todo', {
  title: ''
, completed: false
})

Todo.active = function () {
  return this.where({ completed: false })
}

Todo.completed =function completed() {
  return this.where({ completed: true })
}
