var Sara = require('../../..')
	, Todo = require('../../models/todo')
	, layout = require('../layout')
	, _list = require('./_list')

with (Sara) module.exports = new View('Todo').layout(layout).partials([_list]).html([

    bind('_list'),
    ['strong', ['a', { href: '/' }, 'all']],
    ['a', { href: '/active' }, 'active'],
    ['a', { href: '/completed' }, 'completed']

])