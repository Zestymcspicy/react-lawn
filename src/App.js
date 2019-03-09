import React, { Component } from 'react';
import SignInUp from './SignInUp';
import './App.css';
import Map from './Map.js'
import firebase from 'firebase'


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

    return (
      <div className="App">

        <SignInUp
          isSignedIn={this.state.isSignedIn}
          setUser={this.setUser}/>
        <Map
          setDestination={this.setDestination}
          setNearEndpoint={this.setNearEndpoint}
          />
      </div>
    );
  }
}

export default App;
