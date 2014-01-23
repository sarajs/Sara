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
          + '    <link href="/index.css" rel="stylesheet" type="text/css">'
          + '  </head>'
          + '  <body>'
          + '  </body>'
          + '</html>'
})

// Storage
TodoList.stores(Todo)

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Read the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara app', completed: false }).save()

// Routes
TodoList.get('/', function (req, res) {
  React.renderComponent(ListView({ items: Todo.all(), remaining: Todo.active().length }), document.body)

  res.writeHead(200)
  res.end(window.document.innerHTML)
})

TodoList.post('/new', function (req, res) {
  res.writeHead(201)
  React.renderComponent(ListView({ items: Todo.all() }), document.body)
  res.end(window.document.innerHTML)
})

TodoList.get('/about', function (req, res) {
  window.document.body.innerHTML = 'things about this todo app'

  res.writeHead(200)
  res.end(window.document.documentElement.outerHTML)
})

// DOM Ready
window.addEventListener('load', function () {
  TodoList.initialize()
})