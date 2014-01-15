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
TodoList.get(['/', '/about'], function (req, res) {
  console.log(TodoView)
  TodoView.render(function (err, content) {
    res.end(content)
  })
})

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Breeze through the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara.js app', completed: false }).save()