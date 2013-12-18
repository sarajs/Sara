var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo'.html([

  ["h2", "Active"],
  ["ul", [
    ["li", "first todo"]
  ]]

])