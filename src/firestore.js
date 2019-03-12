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
        console.log(userArr[0])
        return userArr[0];
      }
    })
  }


function addUser(user) {
  const newUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    savedLocations: [],
  }
  firestore.collection("users").add(newUser)
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
    return newUser
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}





export { checkUser }
