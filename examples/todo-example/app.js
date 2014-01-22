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
          + '  <script>window.onerror = console.error</script>'
          + '  <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>'
          + '  <script src="http://www.rivetsjs.com/dist/rivets.min.js"></script>'
          + '  <script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>'
          + '  <script src="/index.js"></script>'
          + '</head>'
          + '<main>'
          + '  <input rv-on-keypress="model.add">'
          + '  <ul>'
          + '    <li rv-each-todo="model.all" rv-class-done="todo.completed">'
          + '      <input type="checkbox" rv-checked="todo.completed" rv-id="todo.id">'
          + '      <label rv-for="todo.id">{ todo.title }</label>'
          + '    </li>'
          + '  </ul>'
          + '  <p>{ model.remaining } remaining</p>'
          + '  <section>'
          + '    <button rv-on-click="model.hide">Hide Completed</button>'
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
  if (process.browser) {
    var model = {
          all: Todo.all()
        , remaining: 1
        , add: function (event) {
            if (event.keyCode === 13) {
              var title = document.querySelector('input').value
              document.querySelector('input').value = ''
              this.all.push({ id: Math.random(), title: title, completed: false })
            }
            this.remaining = this.all.length
          }
        , hide: function () {
            var that = this
            this.all.forEach(function (todo) {
              if (todo.completed == true) that.all.splice(that.all.indexOf(todo), 1)
            })
            this.remaining = this.all.length
          }
        }

    _.bindAll(model, 'add', 'hide')

    window.rivets.bind(window.document.querySelector('main'), {
      model: model
    })
  }

  res.end(TodoList.template)
})

TodoList.get('/about', function (req, res, window) {
  window.document.querySelector('main').innerHTML = 'things about this todo app'
  res.end(window.document.documentElement.outerHTML)
})

// DOM Ready
window.onload = function () {
  TodoList.initialize()
}