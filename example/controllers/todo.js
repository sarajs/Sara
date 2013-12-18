var Sara = require('../..')
	, app = require('../app')
	, Todo = require('../models/todo')

with (Sara) module.exports = new Controller('Todo', function initialize() {
  
  console.log("Initialized TodoController!")
  
}).action('all', function (request) { // GET /
	
	var view = require('../views/todo/all')
	return view.render(Todo.all())
	
}).action('active', function (request) { // GET /active
  
	var view = require('../views/todo/active')
	return view.render(Todo.active())
  
}).action('completed', function (request) { // GET /completed

	var view = require('../views/todo/completed')
	return view.render(Todo.completed())

}).action('create', function (request) { // POST /

	new Todo(request.body).save()
	return app.routes['/todos'].call()

}).action('update': function (request) { // PUT /

	Todo.find(request.body.id).update(request.body)
	return app.routes['/todos'].call()

}).action('destroy', function (request) { // DELETE /

	Todo.find(request.body.id).destroy()
	return app.routes['/todos'].call()

})