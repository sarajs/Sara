var Sara = require('../..')
	, app = require('../app')
	, Todo = require('../models/todo')

with (Sara) module.exports = new Controller('Todo', {

	// GET /todos
	'index': function (request) {
		var TodoIndexView = require('../views/todos/index')
		return TodoIndexView.render(Todo.all)
	}

	// POST /todos
, 'create': function (request) {
		new Todo(request.body).save()
		return app.routes['/todos'].call()
	}

	// PUT /todos/:id
, 'update': function (request) {
		Todo.find(request.body.id).update(request.body)
		return app.routes['/todos'].call()
	}

	// DELETE /posts/:id
, 'destroy': function (request) {
		Todo.find(request.body.id).destroy()
		return app.routes['/todos'].call()
	}
	
})