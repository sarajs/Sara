var App = require('sara')
  , $ = require('jquery')

var AboutView = module.exports = new App.View('Todo', {
  render: function (document) {
    $(document).find('main').html('About my app.')
  }
})
