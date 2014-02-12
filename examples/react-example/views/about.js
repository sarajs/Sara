var Sara = require('sara')
  , React = require('react')

var AboutView = module.exports = React.createClass({
  render: function () {
    with (React.DOM) return (
      div({},
          span({}, "hi")
         )
    )
  }
})