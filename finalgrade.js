finalgrade = [];

function initializeFinalGrade() {
    loadFGDataFromFB().then(function() {
        console.log(finalgrade);
        document.getElementById('quarter1').MDCTextField.value = finalgrade[0];
        document.getElementById('quarter2').MDCTextField.value = finalgrade[1];
        document.getElementById('semester1-exam').MDCTextField.value = finalgrade[2];
        document.getElementById('quarter3').MDCTextField.value = finalgrade[3];
        document.getElementById('quarter4').MDCTextField.value = finalgrade[4];
        document.getElementById('semester2-exam').MDCTextField.value = finalgrade[5];
        window.mdc.autoInit(document, () => {});
        updateFinalGrade();
    });
}

function checkArrowKeys(e,id) {
    if(e.keyCode == 38 && !isNaN(document.getElementById(id).value) && document.getElementById(id).value != ''){
        console.log(id);
        e.preventDefault();
        document.getElementById(id).value = parseInt(document.getElementById(id).value)+1;
        updateFinalGrade();
    }
    if(e.keyCode == 40 && !isNaN(document.getElementById(id).value) && document.getElementById(id).value != ''){
        console.log(id);
        e.preventDefault();
        document.getElementById(id).value = parseInt(document.getElementById(id).value)-1;
        updateFinalGrade();
    }
}

function updateFinalGrade() {
    finalgrade[0] = document.getElementById('quarter1').MDCTextField.value;
    finalgrade[1] = document.getElementById('quarter2').MDCTextField.value;
    finalgrade[3] = document.getElementById('quarter3').MDCTextField.value;
    finalgrade[4] = document.getElementById('quarter4').MDCTextField.value;
    finalgrade[2] = document.getElementById('semester1-exam').MDCTextField.value;
    finalgrade[5] = document.getElementById('semester2-exam').MDCTextField.value;
    var sem1 = finalgrade[0]*.4+finalgrade[1]*.4+finalgrade[2]*.2;
    var sem2 = finalgrade[3]*.4+finalgrade[4]*.4+finalgrade[5]*.2;
    document.getElementById('semester1-grade').innerHTML = "Semester 1: "+(sem1).toFixed(0)+"%";
    document.getElementById('semester2-grade').innerHTML = "Semester 2: "+(sem2).toFixed(0)+"%";
    document.getElementById('final-grade').innerHTML = (sem1*.5+sem2*.5).toFixed(0)+"%";
    uploadFGDataToFB();
}

function uploadFGDataToFB() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).update({
        finalgrade: finalgrade
    }).then().catch(function(error) {
        console.log(error);
    });
}

function loadFGDataFromFB() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).get().then(function(doc) {
        finalgrade = doc.data().finalgrade;
    }).then().catch(function(error) {
        console.log(error);
    });
}