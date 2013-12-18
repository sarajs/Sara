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

// Bootstrapped data
app.cache.todos = [
	new Todo({ title: 'foo', content: 'bar' })
, new Todo({ title: 'wat', content: 'wut' })
]

// Routes
app.get('/', TodoController.all)
app.get('/active', TodoController.active)
app.get('/completed', TodoController.completed)
app.post('/', TodoController.create)
app.put('/:id', TodoController.update)
app.delete('/:id', TodoController.destroy)