var Sara = require('sara')
  , React = require('react')
  , TodoItem = require('./todo')
  , Todo = require('../models/todo')
  , TodoController = require('../controllers/todo')

var ListView = module.exports = React.createClass({
  componentDidMount: function () {
    this.props.items.on('add remove reset sort changeAny', this.forceUpdate.bind(this), this)
  }

, componentWillUnmount: function() {
    this.props.items.off(null, null, this)
  }

, getInitialState: function () {
    return { text: '' }
  }

, handleChange: function (e) {
    this.setState({ text: e.target.value })
  }

, render: function () {
    with (React.DOM) return (
      div({},
          span({}, Todo.completed().length + ' completed')
         , button({ onClick: TodoController.clear.bind(this) }, 'Clear')

         , ol({}
             , this.props.items.map(function(item) {
                 item.key = item.id
                 return TodoItem(item)
               })
             )
         , form({ type: 'text', onSubmit: TodoController.create.bind(this), method: 'POST', action: '/new' }
               , input({ onChange: this.handleChange, placeholder: 'Something to do.', value: this.state.text })
               , button(null, 'Add')
               )
         )
    )
  }
})
