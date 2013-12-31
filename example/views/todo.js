var app = require('../app')
  , fs = require('fs')
  , SaraAngular = require('sara-angular')

exports.render = function () {
  return SaraAngular(fs.readFileSync(app.root + '/templates/index.html').toString())
}