var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, Layout = require('../layout')

with (Sara) module.exports = new View('Todo').layout(Layout).html([

  ['ul', data('todos', [
    ['li', [
      ['input', { 'type': 'checkbox', 'checked': data('checked') }]
      ['span', data('title')]
    ]]
  ])], ['br'],
  ['a', { 'href': '/', 'class': 'active' }, 'all'],
  ['a', { 'href': '/active' }, 'active'],
  ['a', { 'href': '/completed' }, 'completed']

])