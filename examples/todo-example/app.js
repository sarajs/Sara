// Modules
var Sara = require('sara') // .adapter(require('sara-angular'))
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , ListView = require('./views/list')
  , TodoView = require('./views/todo')
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
          + '  </body>'
          + '</html>'
})

// Storage
TodoList.stores(Todo)

// Routes
TodoList.get('/', function (req, res) {
  React.renderComponent(ListView({ items: Todo.all() }), document.body)
  res.writeHead(200)
  res.end(document.innerHTML)
})

TodoList.post('/new', function (req, res) {
  React.renderComponent(ListView({ items: Todo.all() }), document.body)
  res.writeHead(201)
  res.end(document.innerHTML)
})

TodoList.get('/about', function (req, res) {
  document.body.innerHTML = 'things about this todo app'
  res.writeHead(200)
  res.end(document.documentElement.outerHTML)
})

// DOM Ready
window.addEventListener('load', function () {
  TodoList.initialize()
})