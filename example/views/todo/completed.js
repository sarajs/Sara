var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo', function initialize() {

	console.log("Rendering the todo index view.")

}).html([

  ["h2", "Completed"],
  ["ul", [
    ["li", "first todo"]
  ]]

])