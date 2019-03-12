import React, {Component} from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
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
export const firestore = firebase.firestore()

class SignInUp extends Component {

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
    }
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }
  render() {
    const signOutStyle = {
      right: 10,
      position: 'fixed',
      top: "4%"
    }

    if (!this.props.isSignedIn) {
      return (
        <div>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div style={signOutStyle}>
        <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      </div>
      );
  }
}


export default SignInUp
