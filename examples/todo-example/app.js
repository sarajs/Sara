// Modules
var Sara = require('sara').adapter(require('sara-angular'))
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = require('./views/todo')

// Our app
var TodoList = module.exports = new Sara({ env: 'development' })

// Storage
TodoList.stores(Todo)

// Routes
TodoList.get('/', function (req, res) {
  res.end('<script src="/index.js"></script><a href="/about">about</a>')
})

TodoList.get('/about', function (req, res) {
  res.end('<script src="/index.js"></script><a href="/">home</a>')
})

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Breeze through the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara.js app', completed: false }).save()