var Sara = require('sara')
  , $ = require('jquery')

var AboutView = module.exports = new Sara.View('Todo', {
  render: function (document) {
    $(document).find('main').html('About my app.')
  }
})
