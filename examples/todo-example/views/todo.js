/*!
 *
 * The todo item component.
 *
 */

var React = require('react')

var TodoView = module.exports = React.createClass({
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
