var Sara = require('../../..')
	, Todo = require('../../models/todo')

with (Sara) module.exports = new View('_list').html([

    ['ul', bind('todos',
        ['li', [
            ['input', { type: 'checkbox', checked: bind('checked') }],
            ['span', bind('title')]
        ]]
    )], ['br']

])