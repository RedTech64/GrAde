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
var db = firebase.firestore();
var users = db.collection("users");

firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        console.log("User signed in");
        if(!user.isAnonymous)
            document.getElementById("auth").innerHTML = "Sign Out";
        setUpData().then(function() {
            initializeAverage();
            initializeGPA();
        });
    } else {
        console.log("User signed out");
        document.getElementById("auth").innerHTML = "Sign In";
        signInAnonymously();
    }
});

function signInAnonymously() {
  return firebase.auth().signInAnonymously().catch(function(error) {
    console.log(error);
  });
}

function signInGoogle() {
    firebase.auth().signInWithRedirect(provider);
    return firebase.auth().getRedirectResult().then().catch(function(error) {
        console.log(error);
    });
}

function signOutGoogle() {
    return firebase.auth().signOut().then().catch(function(error) {
        console.log(error);
    });
}

function auth() {
    var user = getUser();
    if(user == undefined || user.isAnonymous) {
        deleteData().then(deleteUser()).then(signInGoogle());
    } else {
        signOutGoogle();
    }
}

function setUpData() {
    var user = getUser();
    return users.doc(user.uid).get().then(function(doc) {
        if (!doc.exists) {
            users.doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                grades: [0],
                classes: []
            });
        }
    }).catch(function(error) {
        console.log(error);
    });
}

function deleteData() {
    return users.doc(getUser().uid).delete().then().catch(function(error) {
        console.error(error);
    });
}

function deleteUser() {
    return getUser().delete().then().catch(function(error) {
        console.log(error);
    });
}

function getUser() {
    return firebase.auth().currentUser;
}
