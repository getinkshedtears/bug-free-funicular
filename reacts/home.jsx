var React = require('react');
var ReactDOM = require('react-dom');

var Home = React.createClass({
    
    render: function() {
        
        return (
        <div>
            You made it to the logged-in version!
            <a href = '/logout'>Now log out</a>
        </div>)
        
    }
    
});

ReactDOM.render(<Home />, document.getElementById('anchor'));