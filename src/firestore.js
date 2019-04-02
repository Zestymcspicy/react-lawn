import { firestore } from "./SignInUp.js"


function checkUser(incomingUser) {
  return firestore.collection("users").doc(incomingUser.uid).get().then((response) => {
  console.log(incomingUser)
  const data = response.data()
  if(data===undefined) {
    return addUser(incomingUser)
  } else {
    console.log(data)
    return data
  }
});
}

function dbChangeDestinations(user){
  const userRef = firestore.collection("users").doc(user.uid);
  userRef.set({
    savedLocations: user.savedLocations
  },
  { merge: true })
}


function addUser(user) {
  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    savedLocations: [],
  }
  return firestore.collection("users").doc(user.uid).set(newUser)
  .then(function(docRef) {
    return newUser
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
    return newUser
  });
}





export { checkUser, dbChangeDestinations }
