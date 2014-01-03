var Sara = require('sara')

// Load angular
Sara.Controller = require('sara-react')

module.exports = new Sara.Controller('Todo', React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return React.DOM.div({}, 'Seconds Elapsed: ', this.state.secondsElapsed);
  }
}))