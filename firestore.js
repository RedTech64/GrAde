function initialize() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).onSnapshot(function(doc) {
        initializeAverage(doc.data());
        initializeGPA(doc.data());
        initializeFinalGrade(doc.data());
    });
}