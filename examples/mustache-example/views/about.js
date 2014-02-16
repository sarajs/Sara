var TodoList = require('../app')
  , $ = require('jquery')

var AboutView = module.exports = new TodoList.View('Todo', {
  render: function (document) {
    $(document).find('main').html('About my app.')
  }
})
