var TodoList = require('../index')

var AboutView = module.exports = new TodoList.View('Todo', {
  element: 'main'
, render: function () {
    return 'About my app.'
  }
})
