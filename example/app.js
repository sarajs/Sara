var Application = require('../sara')
  , Handlebars = require('handlebars')

module.exports = new Application({
  env: 'testing'
, templates: Handlebars
, routes: {
    '/': require('./presenters/index')
  }
})