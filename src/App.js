import React, { Component } from 'react';
import SignInUp from './SignInUp';
import Header from './Header';
import './App.css';
import Map from './Map.js';
import { checkUser, dbChangeDestinations } from './firestore.js'
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
      saveDestination: this.saveDestination.bind(this),
      deleteDestination: this.deleteDestination.bind(this)
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

saveDestination(nickname){
  let savedLocations = this.state.user.savedLocations;
  if(savedLocations.every(x => x.coords!==this.state.destination.coords)){
    let location = this.state.destination;
    location.nickname = nickname;
    savedLocations.push(location);
    let user = this.state.user;
    user.savedLocations = savedLocations;
    this.setState({user});
    dbChangeDestinations(user);
  } else {
    alert("You've already saved this location.")
  }
}

deleteDestination(destination) {
  let savedLocations = this.state.user.savedLocations;
  let user = this.state.user;
  savedLocations = savedLocations.filter(x => destination.coords!==x.coords);
  user.savedLocations = savedLocations;
  this.setState({user})
  dbChangeDestinations(user)
}

  render() {
    const footerStyle = {
      position: 'absolute',
      bottom: "0%",
      fontSize: 12
    }


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
