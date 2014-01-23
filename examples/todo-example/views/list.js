var Sara = require('sara')
  , Todo = require('../models/todo')
  , TodoController = require('../controllers/todo')
  , TodoView = require('./todo')
  , React = require('react')

var ListView = module.exports = React.createClass({
  componentDidMount: function () {
    this.props.items.forEach(function(todo) {
      todo.on('add change remove', this.forceUpdate.bind(this, null), this)
    }, this)
  }

, componentWillUnmount: function () {
    this.props.items.forEach(function(todo) {
      todo.off(null, null, this)
    }, this)
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
           header({},
                  h2({}, 'Todo List'),
                  span({}, Todo.active().length + ' remaining'),
                  button({ onClick: this.handleClick }, 'Clear')
                 ),
           main({},
                ol({},
                   this.state.items.map(function(item) {
                     item.key = item.id
                     return TodoView(item)
                   })
                  ),
                form({ onSubmit: this.handleSubmit , method: 'POST', action: '/new' },
                     input({ onChange: this.handleChange, placeholder: 'Something to do.', value: this.state.text }),
                     button(null, 'Add #' + (this.state.items.length + 1))
                    )
               )
          )
    )
  }
})