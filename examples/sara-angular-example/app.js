// Modules
var Sara = require('sara').adapter(require('sara-angular'))
  , _ = require('sara/utils')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = require('./views/todo')

// Our app
var TodoList = module.exports = new Sara({ env: 'development' })

// Resources
TodoList.stores(Todo)

// Routes
TodoList.get('/', function (request, response) {
  TodoView.render().then(function (content) {
    response.end(content)
  })
})

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Breeze through the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara.js app', completed: false }).save()