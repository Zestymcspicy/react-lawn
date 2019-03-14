import { firestore } from "./SignInUp.js"


function checkUser(incomingUser) {
  return firestore.collection("users").get().then((response) => {
    if(response===null||undefined) {
      addUser(incomingUser)
    }
    const dataArray = [];
      response.forEach(doc => {
        const data = doc.data()
        dataArray.push(data)
      })
      if (dataArray.length===0){
        addUser(incomingUser);
      }
      const userArr = dataArray.filter(x=> x.uid===incomingUser.uid);
      if(userArr.length===0){
        addUser(incomingUser)
      } else {
        return userArr[0];
      }
    })
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
  firestore.collection("users").doc(user.uid).set(newUser)
  .then(function(docRef) {
    return newUser
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}





export { checkUser, dbChangeDestinations }
