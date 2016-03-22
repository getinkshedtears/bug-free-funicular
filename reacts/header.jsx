var React = require('react');
var ReactDOM = require('react-dom');

var Title = React.createClass({
  render: function() {
    return (
      <div className = 'main-title'>
        It's A Voting App!
      </div>
    )
  }
});

ReactDOM.render(<Title />, document.getElementById('header'));