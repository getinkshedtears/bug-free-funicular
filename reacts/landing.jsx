var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jQuery');
var DateFormat = require('dateformat');
var Quiche = require('quiche');

var VotingApp = React.createClass({
  getInitialState: function() {
    return({
    loggedIn: false,
    loginState: false,
    registerState: false,
    showLoginOrRegister: false,
    showNewVote: false,
    showVoteView: false,
    currentVote: {},
    votes: [],
    sortBy: 'newest'
    })
  },
  
  componentDidMount: function() {
    
    this.serverRequest = $.get('/api/loggedIn', function (result) {
      if (result) {
        this.setState({loggedIn: true})
      }
      else {
        this.setState({loggedIn: false})
      }
      
    }.bind(this));
    
    this.getVotes();
    
  },
  
  getVotes: function() {
    
    var sort = this.state.sortBy;

    $.ajax({
      url: '/api/votes',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({votes: data})
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err)
      }.bind(this)
  })
    
  },
  
  addVote: function(int) {
      
    var data = {
        id: this.state.currentVote._id,
        thing: int
      };
    
      $.ajax({
        url: '/api/cast',
        dataType: 'json',
        type: 'POST',
        data: data,
        success: function(data) {
          this.setState({currentVote: data})
        }.bind(this),
      })
    },
  
  getSortedVotes: function() {
    var sortedVotes = this.state.sortBy;
    
    if (this.state.sortBy === 'newest') {
      sortedVotes = this.state.votes.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
      });
    }
    
    if (this.state.sortBy === 'oldest') {
      sortedVotes = this.state.votes.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(a.date) - new Date(b.date);
      });
    }
    
    if (this.state.sortBy === 'popular') {
      sortedVotes = this.state.votes.sort(function(a, b){
        return (b.thing1.votes + b.thing2.votes) - (a.thing1.votes + a.thing2.votes)
      })
    }
    
    if (this.state.sortBy === 'unpopular') {
      sortedVotes = this.state.votes.sort(function(a, b){
        return (a.thing1.votes + a.thing2.votes) - (b.thing1.votes + b.thing2.votes)
      })
    }
    
    return sortedVotes;
    
  },
  
  setCurrentVote: function(vote) {
    this.setState({currentVote: vote});
  },
  
  setSortBy: function(sort) {
    this.setState({sortBy: sort});
    this.getVotes();
  },
  
  setShowNewVote: function(show) {
    this.setState({showNewVote: show})
  },
  
  setShowVoteView: function(show) {
    this.setState({showVoteView: show})
  },
  
  setShowLoginOrRegister: function(show, state) {
    this.setState({showLoginOrRegister: show});
    if (state === 'login') {
      this.setLoginState(true)
      this.setRegisterState(false)
    }
    else {
      this.setRegisterState(true)
      this.setLoginState(false)
    }
  },
  
  setRegisterState: function(show) {
    this.setState({registerState: show})
  },
  
  setLoginState: function(show) {
    this.setState({loginState: show})
  },
  
  submitNew: function(vote) {
    $.ajax({
      url: '/api/new',
      dataType: 'json',
      type: 'POST',
      data: vote,
      success: function(data) {
        alert(data.message);
        this.getVotes();
      }.bind(this),
      error: function(xhr, status, err) {
        alert(err)
      }.bind(this)
  })},
  
  render: function() {
    return (
      <div>
        {this.state.showVoteView ? <VoteView close = {this.setShowVoteView} currentVote = {this.state.currentVote} addVote = {this.addVote} /> : null}
        {this.state.showNewVote ? <VoteForm close = {this.setShowNewVote} submit = {this.submitNew}/> : null}
        {this.state.showLoginOrRegister ? <Login close = {this.setShowLoginOrRegister} login = {this.state.loginState} register = {this.state.registerState} /> : null}
        <Title />
        <MainWindow show = {this.setShowLoginOrRegister} loggedIn = {this.state.loggedIn} showNewVote = {this.setShowNewVote} votes = {this.getSortedVotes()} sort= {this.setSortBy} details = {this.setShowVoteView} setVote = {this.setCurrentVote}/>
      </div>
    )
  }
})

var Title = React.createClass({
  render: function() {
    return (
      <div className = 'main-title'>
        It's A Voting App!
      </div>
    )
  }
});

var MainWindow = React.createClass({
  
  getInitialState: function() {
    return ({sortBy:'newest'})
  },
  
  handleChange: function(string) {
    var sortBy = string;
    
    this.setState({sortBy: sortBy});
    this.props.sort(sortBy);
  },
  
  isActive: function(value) {
    return 'sort-' + ((value === this.state.sortBy) ? 'active' : 'inactive');
  },
  
  render: function() {
    return(
      <div>
        <div className = 'wrapper'>
          <CreateNew show = {this.props.showNewVote} />
          <LoginWindow show = {this.props.show} loggedIn = {this.props.loggedIn}/>

          <div className = 'sort-bar'>
            <span className = {this.isActive('newest')} onClick = {this.handleChange.bind(null, 'newest')}>Newest</span> | 
            <span className = {this.isActive('oldest')} onClick = {this.handleChange.bind(null, 'oldest')}>Oldest</span> |
            <span className = {this.isActive('popular')} onClick = {this.handleChange.bind(null, 'popular')}>Most Popular</span> |
            <span className = {this.isActive('unpopular')} onClick = {this.handleChange.bind(null, 'unpopular')}>Least Popular</span>
          
          </div>
          <Votes votes = {this.props.votes} details = {this.props.details} setVote = {this.props.setVote}/>
        </div>
      </div>
      )
  }
});


var LoginWindow = React.createClass({
  render: function(){
    return (
      <div>
        <div className = 'login-window'>
          {this.props.loggedIn ? null : <RegisterButton show = {this.props.show}/> }
          {this.props.loggedIn ? null : <LoginButton show = {this.props.show}/> }
          {this.props.loggedIn ? <LogoutButton /> : null}
        </div>
      </div>
    ) 
  }
});

var LoginButton = React.createClass({
  render: function() {
    return(
      <div className = 'button-landing' onClick = {this.props.show.bind(null, true, 'login')}>Log in</div>
    )
  }
})

var RegisterButton = React.createClass({
  render: function() {
    return(
      <div className = 'button-landing' onClick = {this.props.show.bind(null, true, 'register')}>Register</div>
    )
  }
})

var LogoutButton = React.createClass({
  render: function() {
    return (
      <a href = '/logout'>
        <div className = 'button-landing'>Logout</div>
      </a>
      )
  }
})


var Login = React.createClass({
 
  getInitialState: function() {
        return {username: '', password: '', message: ''}
    },
 
  registerOrLogin: function() {
    if (this.props.login) {
      return 'Login'
    }
    if (this.props.register) {
      return 'Register'
    }
    else return 'Not found'
  },
  
  getUsername: function() {
    if (this.props.login) {
      return 'username'
    }
    else return 'newUsername'
  },
  
  getPassword: function() {
    if (this.props.login) {
      return 'password'
    }
    else return 'newPassword'
  },

  setUsername: function(e) {
        this.setState({username: e.target.value})
    },
    
  setPassword: function(e) {
        this.setState({password: e.target.value})
    },
    
  onSubmit: function(e) {
        var self = this;
      
        e.preventDefault()
        
        var data = {
            username: this.state.username,
            password: this.state.password
        }
        
        $.ajax({
            type: 'POST',
            url: '/login',
            data: data
        })
        .done(function(data) {
            window.location.replace("/");
        })
        .fail(function(jqXhr) {
            self.setState({message: 'invalid username or password'})
        })
        },
  
  render: function() {
    
    return (
      
      <div id = 'screen'>
        <div id = 'loginWindow'>
          <div id = 'login-exit' onClick = {this.props.close.bind(this, false, null)}>
            <div className = 'text-valign'>X</div>
          </div>
          <div className = 'title-text'>{this.registerOrLogin()}</div>
            <div className = 'show-message'>{this.state.message}</div>
            <div id = 'login-inputs'>
              <form type = 'form' onSubmit = {this.onSubmit}>
                <input type = 'text' name = {this.getUsername()} onChange = {this.setUsername} placeholder = 'username'/>
                <input type = 'password' name = {this.getPassword()} onChange = {this.setPassword} placeholder = 'password' />
                {this.props.login ? <button type = 'submit'>Login</button> : null}
                {this.props.register ? <button type = 'submit'>Register</button> : null}
              </form>
            </div>
        </div>
      </div>
      
    )
  }
});

var Votes = React.createClass({
  
  render: function(){
    return (
        <div className = 'votes-window'>
          {this.props.votes.map(function(vote){
            return (<Vote key = {vote.id} thing1 = {vote.thing1.thing} thing2 = {vote.thing2.thing} setVote = {this.props.setVote.bind(null, vote)} details = {this.props.details.bind(null, true)}/>)
          }, this)}
        </div>
    )
  }
});

var Vote = React.createClass({
  handleClick: function() {
    this.props.setVote();
    this.props.details();
  },
  
  render: function() {
    return(
    <div className = 'vote'>
            <div className = 'vote-title' onClick = {this.handleClick}>
              <div className = 'voteThing1'><span className = 'text-valign'>{this.props.thing1}</span></div> <div className = 'vs-title'>vs</div> <div className = 'voteThing2'>{this.props.thing2}</div>
            </div>
    </div>
  )}
});

var CreateNew = React.createClass({
  render: function() {
    
    return(
    
      <div className = 'new-button' onClick = {this.props.show.bind(null, true)}>
        <div className = 'text-valign'>+</div>
      </div>
      
    )}
  
});

var VoteForm = React.createClass({
  
  getInitialState: function() {
    return({thing1: '', thing2: ''})
  },
  
  setThing1: function(e) {
    this.setState({thing1: e.target.value})
  },
  
  setThing2: function(e) {
    this.setState({thing2: e.target.value})
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    var thing1 = this.state.thing1.trim();
    var thing2 = this.state.thing2.trim();
    
    if (!thing1 || !thing2) {
      alert ('Nothing');
      return;
    }
    
    this.props.submit({thing1: thing1, thing2: thing2})
    
  },
  
  render: function() {
   
   return(
     <div id = 'screen'>
      <div className = 'vote-form'>
        <div id = 'login-exit' onClick = {this.props.close.bind(null, false)}>
            <div className = 'text-valign'>X</div>
        </div>
        
        <div className = 'create-wrapper'>
          <form>
            <input type = 'text' name = 'thing1' placeholder = 'Thing One' onChange = {this.setThing1}></input>
            <p>vs</p>
            <input type = 'text' name = 'thing2' placeholder = 'Thing Two' onChange = {this.setThing2}></input>
            
            <p/>
            <div className = 'button-landing-center' onClick = {this.handleSubmit}>Go!</div>
          
          </form>
        </div>
        
      </div>
     </div> 
    
  )}
});


var VoteView = React.createClass({
  
  clickHandler: function(int) {
    this.props.addVote(int);
  },
  
  formattedDate: function(date) {
    var formatted = DateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT");
    return formatted;
  },
  
  render: function() {
    
    return (
      <div id = 'screen'>
        <div className = 'detail-wrapper'>
          <div id = 'login-exit' onClick = {this.props.close.bind(null, false)}>
            <div className = 'text-valign'>X</div>
          </div>
          <div className = 'detail-title'>
            <div className = 'title'>{this.props.currentVote.thing1.thing} vs {this.props.currentVote.thing2.thing}</div>
            <div className = 'author'>posed by author on {this.formattedDate(this.props.currentVote.date)}</div>
          </div>
          <div className = 'detail-left'>
            <div className = 'detail-thing'>
              <div>{this.props.currentVote.thing1.thing}</div>
              <div className = 'current-votes'>Votes: {this.props.currentVote.thing1.votes}</div>
              <div className = 'button-landing-center' onClick = {this.clickHandler.bind(null, 1)}>Vote!</div>
            </div>
            <div className = 'detail-thing'>
              <div>{this.props.currentVote.thing2.thing}</div>
              <div className = 'current-votes'>Votes: {this.props.currentVote.thing2.votes}</div>
              <div className = 'button-landing-center' onClick = {this.clickHandler.bind(null, 2)}>Vote!</div>
            </div>
          </div>
          <div className = 'detail-right'>
            <Chart vote = {this.props.currentVote} />
          </div>
        </div>
      </div>
      )
  }
  
});

var Chart = React.createClass({
  
  createChart: function() {
    var pie = new Quiche('pie');
    pie.setTransparentBackground(); // Make background transparent
    pie.addData(this.props.vote.thing1.votes + 1, this.props.vote.thing1.thing, 'FF0000');
    pie.addData(this.props.vote.thing2.votes + 1, this.props.vote.thing2.thing, '0000FF');
    var imageUrl = pie.getUrl(true); // First param controls http vs. https
    return imageUrl;
  },
  
  render: function() {
    
    return (
      
      <div>

        <img src = {this.createChart()}/>
      
      </div>
      
      )
    
  }
  
});

ReactDOM.render(<VotingApp />, document.getElementById('anchor'));