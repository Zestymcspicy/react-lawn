<p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
return (
  <div>
    <h2>Tell me where to mow</h2>
    <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
  </div>
);
