var App = require('sara')
  , Mustache = require('mustache')
  , TodoController = require('../controllers/todo')
  , Todo = require('../models/todo')
  , $ = require('jquery')

var TodoView = module.exports = new App.View('Todo', {
  template: App.template('todo', '../templates/todo.html').toString()

, render: function () {
    function render() {
      $('main').html(Mustache.render(this.template, { todos: Todo.all(), completed: Todo.completed() }))

      with (TodoController) {
        $('div button').click(clear)
        $('form').submit(create)
        $('input[type="checkbox"]').click(toggleChecked)
      }
      
      return render.bind(this)
    }

    Todo.all().on('add remove changeAny', render.call(this))
  }
})
