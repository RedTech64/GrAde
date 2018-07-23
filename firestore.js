function initialize() {
    setupAverage();
    var db = firebase.firestore();
    setupAverage();
    setupClasses();
    return db.collection("users").doc(getUser().uid).onSnapshot(function(doc) {
        initializeFinalGrade(doc.data());
    });
    db.collection("users").doc(getUser().uid).update({
        id: getUser().uid,
        name: getUser().displayName,
        email: getUser().email,
        web: true,
    });
}

function setupAverage() {
    var db = firebase.firestore();
    db.collection("users").doc(getUser().uid).collection("averages").onSnapshot(function(docs) {
        var data = {};
        data.average = [];
        docs.forEach(function(doc) {
            data.average.push({
                id: doc.data().id,
                name: doc.data().name,
                categories: doc.data().categories,
                selectedCategory: doc.data().selectedCategory,
            });
        });
        db.collection("users").doc(getUser().uid).get().then(function(doc){
            data.selectedAverage = doc.data().selectedAverage;
            initializeAverage(data);
        });
    });
}

function setupClasses() {
    var db = firebase.firestore();
    db.collection("users").doc(getUser().uid).collection("classes").onSnapshot(function(docs) {
        var data = {};
        data.classes = [];
        docs.forEach(function(doc) {
            data.classes.push({
                id: doc.data().id,
                name: doc.data().name,
                grade: doc.data().grade,
                qp: doc.data().qp,
            });
        });
        initializeGPA(data);
    });
}