// Modules
var Sara = require('sara') // .adapter(require('sara-angular'))
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , ListView = require('./views/list')
  , TodoView = require('./views/todo')
  , AboutView = require('./views/about')
  , _ = require('lodash')
  , React = require('react')

// Our app
var TodoList = module.exports = new Sara({
  env: 'development'
, template: '<html>'
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

// Routes
TodoList.get('/', function (req, res, window) {
  React.renderComponent(ListView({ items: Todo.all() }), window.document.querySelector('main'))
  res.writeHead(200)
  res.end(window.document.innerHTML)
})

TodoList.post('/new', function (req, res, window) {
  React.renderComponent(ListView({ items: Todo.all() }), window.document.querySelector('main'))
  res.writeHead(201)
  res.end(window.document.innerHTML)
})

TodoList.get('/about', function (req, res, window) {
  React.renderComponent(AboutView(), window.document.querySelector('main'))
  res.writeHead(200)
  res.end(window.document.documentElement.outerHTML)
})

// Start the router
TodoList.initialize()
