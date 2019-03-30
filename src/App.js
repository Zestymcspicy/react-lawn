import React, { Component } from 'react';
import SignInUp from './SignInUp';
import Header from './Header';
import './App.css';
import Map from  './Map.js';
import { checkUser, dbChangeDestinations } from './firestore.js'
import { DestinationProvider } from './Context.js'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      destination: {
        coords: [],
        place_name: "No Place Name",
        nickname: null,
        menuOpen: false,
      },
      directions: {
        directionSteps: [],
        overall: {}
      },
      wantsToSignIn: true,
      directionsVisible: false,
      user: {},
      originText: "",
      showOriginBox: true,
      saveDestination: this.saveDestination.bind(this),
      deleteDestination: this.deleteDestination.bind(this),
      closeDirections: this.closeDirections.bind(this),
      openDirections: this.openDirections.bind(this),
    }
    this.openSignIn = this.openSignIn.bind(this)
    this.setDirections = this.setDirections.bind(this);
    this.setDestination = this.setDestination.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setOriginText = this.setOriginText.bind(this);
    this.toggleOriginBox = this.toggleOriginBox.bind(this);
    this.saveDestination = this.saveDestination.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.openDirections = this.openDirections.bind(this);
  }



toggleMenu(){
  this.state.menuOpen?
  this.setState({menuOpen: false}):
  this.setState({menuOpen: true})
}


toggleOriginBox(){
  this.state.showOriginBox?
  this.setState({showOriginBox: false}):
  this.setState({showOriginBox: true})
}

setOriginText(originText){
  this.setState({originText})
}

setDirections(directions) {
  this.setState({ directions })
}

setDestination(destination) {
  this.setState({ destination });
}

openDirections(){
  this.setState({directionsVisible: true})
}

closeDirections(){
  this.setState({directionsVisible: false})
}

openSignIn() {
  this.setState({wantsToSignIn: true})
}


async setUser(user){
  if (user!==null) {
     user = await checkUser(user)
      this.setState({
        user: user,
        wantsToSignIn: false
    })
  } else {
    this.setState({
      user: user,
      wantsToSignIn: false
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
    const styles = {
      fade: {
        height: 20,
        backgroundImage: "linear-gradient(#139f25, transparent)"
      }
    }
    return (
      <div className="App">
        <DestinationProvider value={this.state}>
          <Header
            directionsVisible={this.state.directionsVisible}
            menuOpen={this.state.menuOpen}
            toggleMenu={this.toggleMenu}
            showOriginBox={this.state.showOriginBox}
            originText={this.state.originText}/>
          <div style={styles.fade}></div>
        </DestinationProvider>
        <SignInUp
          user={this.state.user}
          wantsToSignIn={this.state.wantsToSignIn}
          setUser={this.setUser}
          openSignIn={this.openSignIn}/>
        <Map
          openDirections={this.openDirections}
          setDirections={this.setDirections}
          toggleMenu={this.toggleMenu}
          showOriginBox={this.state.showOriginBox}
          toggleOriginBox={this.toggleOriginBox}
          setOriginText={this.setOriginText}
          setDestination={this.setDestination}
          />

      </div>
    );
  }
}

export default App;
