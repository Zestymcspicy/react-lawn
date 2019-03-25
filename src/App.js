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
        nickname: null,
        menuOpen: false,
      },
      directions: {
        directionSteps: [],
        overall: {}
      },
      user: {},
      originText: "",
      showOriginBox: true,
      saveDestination: this.saveDestination.bind(this),
      deleteDestination: this.deleteDestination.bind(this)
    }
    this.setDirections = this.setDirections.bind(this);
    this.setDestination = this.setDestination.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setOriginText = this.setOriginText.bind(this);
    this.toggleOriginBox = this.toggleOriginBox.bind(this);
    this.saveDestination = this.saveDestination.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this)

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
  this.setState({destination});
}

setmidPoints(midPoints) {
  this.setState({midPoints});
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
            menuOpen={this.state.menuOpen}
            toggleMenu={this.toggleMenu}
            showOriginBox={this.state.showOriginBox}
            originText={this.state.originText}/>
          <div style={styles.fade}></div>
        </DestinationProvider>
        <SignInUp
          isSignedIn={this.state.isSignedIn}
          setUser={this.setUser}/>
        <Map
          setDirections={this.setDirections}
          toggleMenu={this.toggleMenu}
          showOriginBox={this.state.showOriginBox}
          toggleOriginBox={this.toggleOriginBox}
          setOriginText={this.setOriginText}
          setDestination={this.setDestination}
          setmidPoints={this.setmidPoints}
          />

      </div>
    );
  }
}

export default App;
