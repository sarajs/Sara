/*!
 *
 * The todo item component.
 *
 */

var React = require('react/addons')

var TodoView = module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin]

, getInitialState: function () {
    return {
      completed: this.props.completed
    }
  }

, handleChange: function (e) {
    this.setState({ completed: e.target.checked })
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