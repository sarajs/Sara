var TodoList = require('../app')

var AboutView = module.exports = new TodoList.View('Todo', {
  render: function (document) {
    document.querySelector('main').innerHTML = 'About my app.'
  }
})
