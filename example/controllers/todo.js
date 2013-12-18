var Sara = require('../..')
	, app = require('../app')
	, Todo = require('../models/todo')

// The Todo Controller
with (Sara) var TodoController = module.exports = new Controller('Todo', function initialize() {
  console.log("Initialized TodoController!")
})

// GET /
TodoController.action('all', function (request) {
	var view = require('../views/todo/all')
	return view.render(Todo.all())
})

// GET /active
TodoController.action('active', function (request) {
	var view = require('../views/todo/active')
	return view.render(Todo.active())
})

// GET /completed
TodoController.action('completed', function (request) {
	var view = require('../views/todo/completed')
	return view.render(Todo.completed())
})

// POST /
TodoController.action('create', function (request) {
	new Todo(request.body).save()
	return app.routes['/todos'].call()
})

// PUT /
TodoController.action('update': function (request) {
	Todo.find(request.body.id).update(request.body)
	return app.routes['/todos'].call()
})

// DELETE /
TodoController.action('destroy', function (request) {
	Todo.find(request.body.id).destroy()
	return app.routes['/todos'].call()
})