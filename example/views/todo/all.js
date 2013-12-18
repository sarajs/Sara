var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo', function initialize() {

	console.log("Rendering the todo index view.")

}).layout(Layout).html([

  ["h2", "All"],
  ["ul", [
    ["li", "first todo"]
  ]]

])