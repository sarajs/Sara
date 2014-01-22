// Modules
var Sara = require('sara').adapter(require('sara-angular'))
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')
  , TodoView = require('./views/todo')
  , _ = require('underscore')

// Our app
var TodoList = module.exports = new Sara({
  env: 'development'
, template: '<html>'
          + '<head>'
          + '  <style>.done{text-decoration:line-through;color:#AAA;}</style>'
          + '  <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>'
          + '  <script src="http://www.rivetsjs.com/dist/rivets.min.js"></script>'
          + '  <script src="/index.js"></script>'
          + '</head>'
          + '<main>'
          + '  <input rv-on-keypress="add">'
          + '  <ol>'
          + '    <li rv-each-todo="all" rv-class-done="todo.completed">'
          + '      <input type="checkbox" rv-checked="todo.completed" rv-id="todo.id">'
          + '      <label rv-for="todo.id">{ todo.title }</label>'
          + '    </li>'
          + '  </ol>'
          + '  <p>{ remaining } remaining</p>'
          + '  <section>'
          + '    <button rv-on-click="hide">Hide Completed</button>'
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
  var controller = {
        all: Todo.all()
      , remaining: Todo.active().length
      , add: function (event) {
          if (event.keyCode === 13) {
            var title = document.querySelector('input').value
            if (title) {
              new Todo({ title: title, completed: false }).save()
              document.querySelector('input').value = ''
            }
            this.remaining = Todo.active().length
          }
        }
      , hide: function () {
          Todo.completed().forEach(function (todo) {
            todo.destroy()
          })
          this.remaining = Todo.active().length
        }
      }

  if (global.view) global.view.unbind()

  _.bindAll(controller, 'add', 'hide')

  global.view = window.rivets.bind(window.document.querySelector('main'), controller)

  res.end(TodoList.template)
})

TodoList.get('/about', function (req, res, window) {
  window.document.querySelector('main').innerHTML = 'things about this todo app'
  res.end(window.document.documentElement.outerHTML)
})

// DOM Ready
window.addEventListener('load', function () {
  TodoList.initialize()
})