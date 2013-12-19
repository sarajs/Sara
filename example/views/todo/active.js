var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo').layout(Layout).html([

  ['ul', each('todos', [
    ['li', [
      ['input', { 'type': 'checkbox', 'checked': data('checked') }]
      ['span', data('title')]
    ]]
  ])], ['br'],
  ['a', { 'href': '/' }, 'all'],
  ['a', { 'href': '/active', 'class': 'active' }, 'active'],
  ['a', { 'href': '/completed' }, 'completed']

])