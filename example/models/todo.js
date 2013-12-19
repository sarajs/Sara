var Sara = require('../..')

// The todo model
with (Sara) var Todo = module.exports = new Model('Todo', {

  'title': String
, 'completed': Boolean

}, function initialize() {
  console.log("Made a new todo!")
})

// Active todos
Todo.add('active', function () {
  return this.where({ 'completed': false })
})

// Completed todos
Todo.add('complete', function () {
  return this.where({ 'completed': true })
})