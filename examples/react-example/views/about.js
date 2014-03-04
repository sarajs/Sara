var App = require('sara')
  , React = require('react')

var AboutView = module.exports = new App.View('About', {
  render: function () {
    var el = document.querySelector('main')
    React.unmountComponentAtNode(el)
    el.innerHTML = 'About my app.'
  }
})
