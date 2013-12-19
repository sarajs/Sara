// Modules
var Sara = require('..')
  , Layout = require('./views/layout')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')

// Our todo-list application
var app = module.exports = new Sara({
  environment: 'development'
})

// Resources
app.resource(Todo)

// Routes
with (TodoController) {
  app.get('/', all)
  app.get('/active', active)
  app.get('/completed', completed)
  app.post('/', create)
  app.put('/:id', update)
  app.delete('/:id', destroy)
}

// Data for testing
app.cache.todos = [
	new Todo({ 'title': 'Play with Sara\'s TodoMVC example', 'completed': true })
, new Todo({ 'title': 'Breeze through Sara\'s guide', 'completed': false })
, new Todo({ 'title': 'Build your own Sara.js app', 'completed': false })
]