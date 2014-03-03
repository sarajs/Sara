var App = require('sara')
  , List = require('../components/list')
  , React = require('react')
  , Todo = require('../models/todo')

var TodoView = module.exports = new App.View('Todo', {
  prerender: function (document) {
    document.querySelector('main').innerHTML = React.renderComponentToString(List({ items: Todo.all() }))
  }
, render: function () {
    React.renderComponent(List({ items: Todo.all() }), document.querySelector('main'))
  }
})
