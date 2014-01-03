// Modules
var Sara = require('sara')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = Sara.template('./views/todo.html')

// Our app
var TodoList = module.exports = new Sara({ env: 'development' })

// Resources
TodoList.resource(Todo)

// Routes
TodoList.get('/', function (request, response) {
  TodoController.render(TodoView, function (rendered) {
    response.write(rendered)
    response.end()
  })
})

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Breeze through the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara.js app', completed: false }).save()

// FIXME: this is a hack, remove it
if (!process.browser) TodoList.adapter(require('sara-angular'))