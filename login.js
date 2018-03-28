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

function signin() {
    firebase.auth().signInWithRedirect(provider);
}
