var TodoList = require('../app')

var TodoView = module.exports = new TodoList.View('Todo', {
  template: TodoList.template('todo', '../templates/todo.html')
, render: function (todos) {
    todos.forEach(function (todo) {
      todo.key = todo.id()
    })

    var Handlebars = require('handlebars')
      , TodoController = require('../controllers/todo')
      , handlebars = Handlebars.compile(this.template.toString())

    todos.on('add remove changeAny', function () {
      this.render(todos)
    }.bind(this))

    // render
    document.querySelector('main').innerHTML = handlebars(todos)

    // bind events
    document.querySelector('form').addEventListener('submit', TodoController.create)
    Array.prototype.slice.call(document.querySelectorAll('input[type="checkbox"]')).forEach(function (input) {
      input.addEventListener('click', TodoController.toggleChecked)
    })
  }
})
