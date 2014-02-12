var TodoList = require('../index')

var TodoView = module.exports = new TodoList.View('Todo', {
  template: '../templates/todo.html'
, element: 'body'
, render: function (data) {
    var Handlebars = require('handlebars')
      , handlebars = Handlebars.compile(this.template.toString())

    document.querySelector('main').innerHTML = handlebars(data)
  }
})
