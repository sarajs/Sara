// Modules
var Sara = require('sara').adapter(require('sara-angular'))
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = require('./views/todo')

// Our app
var TodoList = module.exports = new Sara({
  env: 'development'
, template: '<html>'
          + '<head>'
          + '  <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>'
          + '  <script src="http://www.rivetsjs.com/dist/rivets.min.js"></script>'
          + '  <script src="/index.js"></script>'
          + '</head>'
          + '<main>'
          + '  <input rv-on-keypress="Todo.add">'
          + '  <ul>'
          + '    <li rv-each-todo="Todo.all" rv-class-done="todo.completed">'
          + '      <input type="checkbox" rv-checked="todo.completed" rv-id="todo.id">'
          + '      <label rv-for="todo.id">{ todo.title }</label>'
          + '    </li>'
          + '  </ul>'
          + '  <p>{ Todo:remaining } remaining</p>'
          + '  <section>'
          // + '    <button rv-on-click="Todo.showAll">Show All</button>'
          // + '    <button rv-on-click="Todo.showActive">Hide Completed</button>'
          + '  </section>'
          + '</main></html>'
})

// Storage
TodoList.stores(Todo)

// Data for testing
new Todo({ title: 'Play with the example', completed: true }).save()
new Todo({ title: 'Breeze through the guide', completed: false }).save()
new Todo({ title: 'Build your own Sara.js app', completed: false }).save()

// Routes
TodoList.get('/', function (req, res, window) {
  console.log(window.document.querySelector('main'))

  window.rivets.bind(window.document.querySelector('main'), {
    Todo: {
      all: [
        { id: 1, title: 'foo', completed: true }
      , { id: 2, title: 'bar', completed: false }
      ],

      remaining: 1,

      add: function (event) {
        if(event.keyCode === 13) {
          this.all.push({ id: 0, title: 'wat', completed: false })
        }
      }
    }
  })

  res.end(TodoList.template)
})

TodoList.get('/about', function (req, res, window) {
  window.document.querySelector('main').innerHTML = 'things about this todo app'

  res.end(window.document.documentElement.outerHTML)
})

TodoList.initialize()