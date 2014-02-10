// Modules
var Sara = require('sara')
  , Todo = require('./models/todo')
  , TodoController = require('./controllers/todo')

// Our app
var TodoList = module.exports = new Sara({
  template: '<html>'
          + '  <head>'
          + '  <style>body { font-family: Helvetica; } label { -webkit-user-select: none; } label.done { text-decoration: line-through; color: grey; } ol { padding-left: 1.5em; }</style>'
          + '  </head>'
          + '  <body>'
          + '    <header>'
          + '      <h2>Todo List</h2>'
          + '      <nav>'
          + '        <a href="/">todos</a>'
          + '        <a href="/about">about</a>'
          + '      </nav>'
          + '      <br>'
          + '    </header>'
          + '    <main></main>'
          + '  </body>'
          + '</html>'

, init: function () {
  }
})

// Storage
TodoList.stores(Todo)
global.Todo = Todo
global.TodoController = TodoController

// Routes
TodoList.get('/', function (req, res) {
  var React = require('react')

  var TodoView = React.createClass({
    getInitialState: function () {
      return {
        completed: this.props.completed
      }
    }

  , handleChange: function (e) {
      this.setState({ completed: e.target.checked })
      Todo.find(this.props.id).set('completed', e.target.checked)
    }

  , render: function () {
      with (React.DOM) return (
        li({},
           label({ className: this.state.completed ? 'done' : null },
                 input({ checked: this.state.completed, type: "checkbox", id: this.props.id, onChange: this.handleChange }),
                 span({}, this.props.title)
                )
          )
      )
    }
  })


  var ListView = React.createClass({
    _subscribe: function (model) {
      if (!model) return
      model.on('add remove reset sort changeAny', this.forceUpdate.bind(this), this)
    }

  , _unsubscribe: function (model) {
      if (!model) return
      model.off(null, null, this)
      model.forEach(function (model) {
                      model.off(null, null, this)
                    }.bind(this))
    }

  , componentDidMount: function () {
      this._subscribe(this.props.items)
    }

  , componentWillReceiveProps: function (nextProps) {
      if (this.props.items !== nextProps.model) {
        this._unsubscribe(this.props.items)
        this._subscribe(nextProps.items)
      }
    }

  , componentWillUnmount: function() {
      this._unsubscribe(this.props.items)
    }

  , getInitialState: function() {
      return {
        items: this.props.items || []
      , text: ''
      }
    }

  , handleChange: function (e) {
      this.setState({ text: e.target.value })
    }

  , handleSubmit: function (e) {
      e.preventDefault()
      TodoController.create(this)
    }

  , handleClick: function (e) {
      TodoController.clear(this)
    }

  , render: function () {
      with (React.DOM) return (
        div({},
            span({}, Todo.completed().length + ' completed')
           , button({ onClick: this.handleClick }, 'Clear')

           , ol({}
               , this.state.items.map(function(item) {
                   item.key = item.id
                   return TodoView(item)
                 })
               )
           , form({ type: 'text', onSubmit: this.handleSubmit , method: 'POST', action: '/new' }
                 , input({ onChange: this.handleChange, placeholder: 'Something to do.', value: this.state.text })
                 , button(null, 'Add #' + (this.state.items.length + 1))
                 )
           )
      )
    }
  })

  React.renderComponent(ListView({ items: Todo.all() }), window.document.querySelector('main'))

  res.writeHead(200)
  res.end(window.document.innerHTML)
})

// Start the router
TodoList.initialize()
