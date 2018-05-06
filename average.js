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
        checkInput();
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

function Grade(grade,weight) {
    return {
        grade: grade,
        weight: weight
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
    var top = 0;
    var bottom = 0;
    for(i = 0; i < grades.length; i++) {
        top += parseInt(grades[i].grade);
        bottom += parseInt(grades[i].weight);
    }
    var sum = (top/bottom)*100;
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
    for(i = 0; i < grades.length; i++) {
        if(document.getElementById("weight").checked) {
            new Chip(grades[i].grade+"/"+grades[i].weight,grades.length);
        } else {
            new Chip(grades[i].grade,grades.length);
        }
    }
    if(document.getElementById("chips").innerHTML == "") {
        document.getElementById("chips").innerHTML = "No grades entered";
    }
}

function addChip(Grade) {
    console.log(Grade.grade);
    console.log(Grade.weight);
    grades[grades.length] = Grade;
    if(document.getElementById("autoclear").checked) {
        document.getElementById("grade").value = "";
    }
    updateChips();
    updateGrade();
    uploadGrades();
}

function checkInput() {
    input = document.getElementById("grade").value;
    if(isNaN(input) && input.includes('/')) {
        var argOne = input.substring(0,input.indexOf('/'));
        var argTwo = input.substring(input.indexOf('/')+1);
        if(!isNaN(argOne) && !isNaN(argTwo)) {
            addChip(new Grade(argOne,argTwo));
        }
    }
    if(!isNaN(input)) {
        console.log("one");
        addChip(new Grade(parseInt(input),100));
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