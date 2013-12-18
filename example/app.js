var Sara = require('..')
  , Layout = require('./views/layout')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')

var app = module.exports = new Sara({
  env: 'development'
})

// Resources
app.resource(Todo)

// Cache
app.cache.todos = [
	new Todo({ title: 'foo', content: 'bar' })
, new Todo({ title: 'wat', content: 'wut' })
]

// Routes
app.get('/', TodoController.index)
app.get('/todos', TodoController.index)
app.post('/todos', TodoController.create)
app.put('/todos/:id', TodoController.update)
app.delete('/todos/:id', TodoController.destroy)