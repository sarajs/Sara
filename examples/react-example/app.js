// Modules
var Sara = require('sara')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')

// Our app
var TodoList = module.exports = new Sara({
  template: '<html>'
          + '  <head>'
          + '  <style>body { font-family: Helvetica; } label { -webkit-user-select: none; } label.done { text-decoration: line-through; color: grey; } ol { padding-left: 1.5em; }</style>'
          + '  </head>'
          + '  <body>'
          + '    <header>'
          + '      <h2>Todo List</h2>'
          + '      <nav>'
          + '        <a href="/">todos</a>'
          + '        <a href="/about">about</a>'
          + '      </nav>'
          + '      <br>'
          + '    </header>'
          + '    <main></main>'
          + '  </body>'
          + '</html>'
})

// Storage
TodoList.stores(Todo)
global.Todo = Todo
global.TodoController = TodoController

// Routes
TodoList.get('/', function (req, res) {
  var React = require('react')
    , TodoView = require('./views/todo')
    , ListView = require('./views/list')

  React.renderComponent(ListView({ items: Todo.all() }), document.querySelector('main'))
  res.end(document.innerHTML)
})

TodoList.get('/about', function (req, res) {
  var React = require('react')
    , AboutView = require('./views/about')

  React.renderComponent(AboutView(), document.querySelector('main'))
  res.end(document.innerHTML)
})

// Start the router
TodoList.initialize()
