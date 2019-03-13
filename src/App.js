import React, { Component } from 'react';
import SignInUp from './SignInUp';
import Header from './Header';
import './App.css';
import Map from './Map.js';
import { checkUser } from './firestore.js'
import { DestinationProvider } from './Context.js'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      destination: {
        coords: [],
        place_name: "No Place Name",
        nickname: null
      },
      nearEndpoint: [],
      user: {},
      originText: "",
      showOriginBox: true,
      saveDestination: this.saveDestination.bind(this)
    }
    this.setNearEndpoint = this.setNearEndpoint.bind(this);
    this.setDestination = this.setDestination.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setOriginText = this.setOriginText.bind(this);
    this.toggleOriginBox = this.toggleOriginBox.bind(this);
    this.saveDestination = this.saveDestination.bind(this);
  }

toggleOriginBox(){
  this.state.showOriginBox?
  this.setState({showOriginBox: false}):
  this.setState({showOriginBox: true})
}

setOriginText(originText){
  this.setState({originText})
}

setDestination(destination) {
  this.setState({destination});
}

setNearEndpoint(nearEndpoint) {
  this.setState({nearEndpoint});
}

async setUser(user){
  if (user!==null) {
     user = await checkUser(user)
      this.setState({
        user: user,
        isSignedIn: !!user
    })
  } else {
    this.setState({
      user: user,
      isSignedIn: !!user
    })
  }
}

saveDestination(){
  let savedLocations = this.state.user.savedLocations
  if(savedLocations.every(x=>x.coords!==this.state.destination.coords)){
    savedLocations.push(this.state.destination);
    this.setState({savedLocations})
  } else {
    alert("You've already saved this location.")
  }
}

  render() {
    const footerStyle = {
      position: 'absolute',
      bottom: "0%"
    }
    const destination = this.state.destination;


    return (
      <div className="App">
        <DestinationProvider value={this.state}>
          <Header
        showOriginBox={this.state.showOriginBox}
        originText={this.state.originText}/>
        </DestinationProvider>
        <SignInUp
          isSignedIn={this.state.isSignedIn}
          setUser={this.setUser}/>
        <Map
          showOriginBox={this.state.showOriginBox}
          toggleOriginBox={this.toggleOriginBox}
          setOriginText={this.setOriginText}
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
