/*!
 *
 * The todo item component.
 *
 */

var React = require('react')
  , TodoController = require('../controllers/todo')

var TodoItem = module.exports = React.createClass({
  render: function () {
    with (React.DOM) return (
      li({},
         label({ className: this.props.completed ? 'completed' : null },
               input({ checked: this.props.completed, type: "checkbox", id: this.props.id, onChange: TodoController.toggleChecked.bind(this) }),
               span({}, this.props.title)
              )
        )
    )
  }
})
