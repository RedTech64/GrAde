var config = {
    apiKey: "AIzaSyDFCvOGyGSnnJhyb-isENFCCzuhXhGFO9k",
    authDomain: "redtech-grade.firebaseapp.com",
    databaseURL: "https://redtech-grade.firebaseio.com",
    projectId: "redtech-grade",
    storageBucket: "redtech-grade.appspot.com",
    messagingSenderId: "219651988629"
};
firebase.initializeApp(config);
        
var provider = new firebase.auth.GoogleAuthProvider();        
firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
}); 

function signin() {
    firebase.auth().signInWithRedirect(provider);
}