import React, {Component} from 'react';
import firebase from 'firebase';
import firebaseui from 'firebaseui';
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
    


  signOut() {
    firebase.auth().signOut();
  }

  uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
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


    const styles = {
      signOutIn: {
        textAlign: "center",
        right: 10,
        position: 'fixed',
        top: "3%"
      },
      button: {
        width: "100%",
        border: "none",
        backgroundColor: "transparent"
      }
    }

    if (this.props.wantsToSignIn===true) {
      return (
        <div>
          <StyledFirebaseAuth
            uiCallback={ui => ui.disableAutoSignIn()}
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}>
          </StyledFirebaseAuth>
        </div>
      );
    }
    return (
      this.props.user!==null||undefined?
      <div style={styles.signOutIn}>
        <span>Hello {this.props.user.displayName}</span>
        <button
          onClick={() => firebase.auth().signOut()}
          style={styles.button}>
          Sign-out</button>
      </div>
      :
      <div style={styles.signOutIn}>
        <button
          onClick={()=>this.props.openSignIn()}
          style={styles.button}>
          SignIn
        </button>
      </div>

      );
  }
}


export default SignInUp;
