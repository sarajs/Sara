var Sara = require('sara')
  , TodoView = require('./todo')
  , React = require('react')

var ListView = module.exports = React.createClass({
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