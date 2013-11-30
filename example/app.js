var Application = require('../sara')
  , Handlebars = require('handlebars')

module.exports = new Application({
  env: 'testing'
, templates: Handlebars
, routes: {
    '/about': require('./presenters/about')
  }
})