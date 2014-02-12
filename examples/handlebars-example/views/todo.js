var TodoList = require('../app')

var TodoView = module.exports = new TodoList.View('Todo', {
  template: TodoList.template('todo', '../templates/todo.html')
, render: function (todos) {
    var Handlebars = require('handlebars')
      , TodoController = require('../controllers/todo')
      , handlebars = Handlebars.compile(this.template.toString())
      , _ = require('../../../lib/sara').Utils

    todos.forEach(function (todo) {
      todo.key = todo.id()
    })

    todos.on('add remove changeAny', function () {
      this.render(todos)
    }.bind(this))

    // render
    document.querySelector('main').innerHTML = handlebars(todos)

    // events
    document.querySelector('form').onsubmit = TodoController.create

    _(document.querySelectorAll('input[type="checkbox"]')).forEach(function (input) {
      input.onclick = TodoController.toggleChecked
    })
  }
})
