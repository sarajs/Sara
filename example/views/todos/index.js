var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo', {

	layout: Layout

, initialize: function () {
		console.log("Rendering the todo index view.")
	}

, html: new HTML(['p', 'All todos.'])

})