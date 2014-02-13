var TodoList = require('../app')

var TodoView = module.exports = new TodoList.View('Todo', {
  template: TodoList.template('todo', '../templates/todo.html')
, render: function (document) {
    var Mustache = require('mustache')
      , TodoController = require('../controllers/todo')
      , _ = require('../../../lib/sara').Utils
      , Todo = require('../models/todo')

    Todo.all().on('add remove changeAny', render.bind(this))
    render.bind(this)()

    function render() {
      Todo.all().forEach(function (todo) {
        todo.key = todo.id()
      })

      // render
      document.querySelector('main').innerHTML = Mustache.render(this.template.toString(), { todos: Todo.all(), completed: Todo.completed() })

      // events
      document.querySelector('div button').onclick = TodoController.clear
      document.querySelector('form').onsubmit = TodoController.create

      _(document.querySelectorAll('input[type="checkbox"]')).forEach(function (input) {
        input.onclick = TodoController.toggleChecked
      })
    }
  }
})
