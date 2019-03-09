import React, {Component} from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import uiStyles from 'firebase/dist/firebaseui.css'
// const firebaseui = require('firebaseui');
const config = {
    apiKey: "AIzaSyBLylb4pCBdTnEIU1yWWC2Pnr9pLHHn1v0",
    authDomain: "lawnmower-maps.firebaseapp.com",
    databaseURL: "https://lawnmower-maps.firebaseio.com",
    projectId: "lawnmower-maps",
    storageBucket: "lawnmower-maps.appspot.com",
    messagingSenderId: "1067332476225",
    clientId: "1067332476225-0intu4ukpajk70lvkujju370lpn4qppd.apps.googleusercontent.com"
  };
firebase.initializeApp(config);
// const ui = new firebaseui.auth.AuthUI(firebase.auth())

class SignInUp extends Component {
state = {
  isSignedIn: false
}
signOut = () => firebase.auth().signOut();


uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
};
  componentDidMount(){
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
    (user) => {
      this.props.setUser(user);
      // this.setState({isSignedIn: !!user});
    }
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render(){

    if (!this.props.isSignedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div>

        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
      );
  }
}


export default SignInUp
