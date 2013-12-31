var Sara = require('../..')
	, app = require('../app')
	, Todo = require('../models/todo')

// The todo controller
with (Sara) var TodoController = module.exports = new Controller('Todo')

// GET /
TodoController.action('all', function (request) {
  var view = require('../views/todo')
  return view.render(Todo.all())
})

// GET /active
TodoController.action('active', function (request) {
	var view = require('../views/todo')
	return view.render(Todo.active())
})

// GET /completed
TodoController.action('completed', function (request) {
	var view = require('../views/todo')
	return view.render(Todo.completed())
})

// POST /
TodoController.action('create', function (request) {
	new Todo(request.body).save()
	return app.visit('/todos')
})

// PUT /
TodoController.action('update', function (request) {
	Todo.find(request.body.id).update(request.body)
	return app.visit('/todos')
})

// DELETE /
TodoController.action('destroy', function (request) {
	Todo.find(request.body.id).destroy()
	return app.visit('/todos')
})