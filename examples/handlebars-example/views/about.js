var TodoList = require('../index')

var AboutView = module.exports = new TodoList.View('Todo', {
  element: 'main'
, render: function () {
    'About my app.'
  }
})
