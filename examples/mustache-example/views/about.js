var App = require('sara')
  , $ = require('jquery')

var AboutView = module.exports = new App.View('Todo', {
  render: function () {
    $('main').html('About my app.')
  }
})
