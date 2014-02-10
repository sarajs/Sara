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
                 return TodoView(item)
               })
             )
         , form({ type: 'text', onSubmit: TodoController.create.bind(this), method: 'POST', action: '/new' }
               , input({ onChange: this.handleChange, placeholder: 'Something to do.', value: this.state.text })
               , button(null, 'Add #' + (this.props.items.length + 1))
               )
         )
    )
  }
})
