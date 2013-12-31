// Modules
var Sara = require('..')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , fs = require('fs')

// Our todo-list application
var app = module.exports = new Sara({
  environment: 'development'
})

// Assets
app.asset('/angular.js', fs.readFileSync(app.root + '/node_modules/sara-angular/lib/angular/angular.min.js').toString())

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
	new Todo({ title: 'Play with Sara\'s TodoMVC example', completed: true })
, new Todo({ title: 'Breeze through Sara\'s guide', completed: false })
, new Todo({ title: 'Build your own Sara.js app', completed: false })
]