var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo').layout(Layout).html([

  ["h2", "All"],
  ["ul", [
    ["li", "first todo"]
  ]]

])