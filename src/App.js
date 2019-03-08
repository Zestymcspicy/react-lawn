import React, { Component } from 'react';
import './App.css';
import Map from './Map.js'



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      destination: [],
      nearEndpoint: []
    }
    this.setNearEndpoint = this.setNearEndpoint.bind(this);
    this.setDestination = this.setDestination.bind(this);
  }

setDestination(destination) {
  this.setState({destination});
}

setNearEndpoint(nearEndpoint) {
  this.setState({nearEndpoint});
}

  render() {

    return (
      <div className="App">
        <Map
          setDestination={this.setDestination}
          setNearEndpoint={this.setNearEndpoint}
          />
      </div>
    );
  }
}

export default App;
