var grades = [];

function initializeAverage() {
    loadGrades().then(function() {
        updateChips();
        updateGrade();
    });
}

function handle(e) {
    if(e.keyCode === 13){
        e.preventDefault();
        addChip();
    }
}

function Chip(grade,num) {
    var chips = document.getElementById("chips");
    var deletechip = document.getElementById("deletechip").cloneNode(true);
    deletechip.setAttribute("id","deletechip"+num);
    if(chips.innerHTML == "No grades entered") {
        chips.innerHTML = "";
    }
    chips.MDCChipSet.addChip(grade,null,deletechip);
    document.getElementById("deletechip"+num).onclick = function() {
        remove(this.id.substring(10));
    }
    }

function remove(id) {
    var chips = document.getElementById("chips");
    var num = 0;
    for(i = 0; i < chips.childElementCount; i++) {
        if(!chips.childNodes[i].getAttribute("class").includes("exit")) {
            chips.childNodes[i].childNodes[1].setAttribute("id","deletechip"+num);
            num++;
        }
    }
    grades.splice(id,1);
    if(grades.length == 0) {
        chips.innerHTML = "No grades entered";
    }
    updateGrade();
    uploadGrades();
    }

function updateGrade() {
    var sum = 0;
    for(i = 0; i < grades.length; i++) {
        sum += parseInt(grades[i]);
    }
    sum /= (grades.length);
    if(document.getElementById("decimal").checked) {
        sum = sum.toFixed(2);
    } else {
        sum = sum.toFixed(0);
    }
    if(grades.length == 0) {
        document.getElementById("average").innerHTML = "0%";
    } else {
        document.getElementById("average").innerHTML = sum+"%";
    }
    sum = 0;
}

function updateChips() {
    var chips = document.getElementById("chips");
    chips.innerHTML = "";
    for(i = 1; i < grades.length; i++) {
        if(grades[i] != null) {
            new Chip(grades[i],i);
        }
    }
    if(document.getElementById("chips").innerHTML == "") {
        document.getElementById("chips").innerHTML = "No grades entered";
    }
}

function addChip() {
    if(!document.getElementById("grade").value == "") {
        new Chip(document.getElementById("grade").value,grades.length);
        grades[grades.length] = parseInt(document.getElementById("grade").value);
        if(document.getElementById("autoclear").checked) {
            document.getElementById("grade").value = "";
        }
        updateGrade();
        uploadGrades();
    }
}

function uploadGrades() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).update({
        grades: grades
    }).then().catch(function(error) {
        console.log(error);
    });
}

function loadGrades() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).get().then(function(doc) {
        grades = doc.data().grades;
    }).then().catch(function(error) {
        console.log(error);
    });
}