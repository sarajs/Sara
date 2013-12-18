var Sara = require('../..')

with (Sara) module.exports = new Model('Todo', {

  'title': String
, 'completed': Boolean

}).add('active', function () {

  return this.where({ 'completed': false })

}).add('complete', function () {
  
  return this.where({ 'completed': true })
  
})