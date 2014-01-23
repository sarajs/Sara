var Sara = require('sara')
  , Todo = require('../models/todo')
  , TodoController = require('../controllers/todo')
  , TodoView = require('./todo')
  , React = require('react')

var ListView = module.exports = React.createClass({
  getInitialState: function() {
    return {
      items: this.props.items || []
    , text: ''
    }
  }

, onChange: function (e) {
    this.setState({ text: e.target.value })
  }

, onSubmit: function (e) {
    e.preventDefault()
    TodoController.create(this)
  }

, render: function () {
    with (React.DOM) return (
      main({},
        h3({}, "TODO"),
        ol({}, this.state.items.map(function(item) {
          return TodoView(item)
        })),
        form({ onSubmit: this.onSubmit , method: 'POST', action: '/new' },
          input({ onChange: this.onChange, placeholder: 'Something to do.', value: this.state.text }),
          button(null, 'Add #' + (this.state.items.length + 1))
        )
      )
    )
  }
})