var Sara = require('sara')

// The todo model
var Todo = module.exports = new Sara.Model('Todo', {

  title: String
, completed: Boolean

}, function initialize() {
 
  console.log("Made a new todo!")
  
})

// Active todos
// Todo.add(function active() {
//   return this.where({ 'completed': false })
// })

// Active todos
Todo.add(function active() {
  return this.where({ 'completed': false })
})

// Completed todos
Todo.add(function completed() {
  return this.where({ 'completed': true })
})