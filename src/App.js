import React, { Component } from 'react';
import SignInUp from './SignInUp';
import Header from './Header'
import './App.css';
import Map from './Map.js'



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      destination: [],
      nearEndpoint: [],
      user: {}
    }
    this.setNearEndpoint = this.setNearEndpoint.bind(this);
    this.setDestination = this.setDestination.bind(this);
    this.setUser = this.setUser.bind(this);
  }

setDestination(destination) {
  this.setState({destination});
}

setNearEndpoint(nearEndpoint) {
  this.setState({nearEndpoint});
}

setUser(user){
  this.setState({
    user: user,
    isSignedIn: !!user
  })
}

  render() {
    const footerStyle = {
      position: 'absolute',
      bottom: "0%"
    }

    return (
      <div className="App">
      <Header/>
        <SignInUp
          isSignedIn={this.state.isSignedIn}
          setUser={this.setUser}/>
        <Map
          setDestination={this.setDestination}
          setNearEndpoint={this.setNearEndpoint}
          />
          <footer style={footerStyle}>
          Hamburger By Google Inc., <a href="https://creativecommons.org/licenses/by/4.0" title="Creative Commons Attribution 4.0">CC BY 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=36335118">Link</a>
          </footer>
      </div>
    );
  }
}

export default App;
