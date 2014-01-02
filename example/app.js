// Modules
var Sara = require('..')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = Sara.template('./views/todo.html')

// Our app
var app = module.exports = new Sara({ env: 'development' })

// Resources
app.resource(Todo)

// Routes
app.get('/', function (request, response) {
  TodoController.render(TodoView, function (rendered) {
    response.write(rendered)
    response.end()
  })
})

// Data for testing
new Todo({ title: 'Play with Sara\'s TodoMVC example', completed: true })
new Todo({ title: 'Breeze through Sara\'s guide', completed: false })
new Todo({ title: 'Build your own Sara.js app', completed: false })

if (!process.browser) app.adapter(require('sara-angular'))