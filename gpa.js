var c = null;
var classes = [];

function onload() {
    c = document.getElementById("class0").cloneNode(true);
}

function initializeGPA() {
    loadClassesFromFB().then(function() {
        updateClasses();
        calculateGPA();
    });
}

function addClass() {
    var newClass = new Class("","","");
    classes[classes.length] = newClass;
    updateClasses();
    uploadClassesToFB();
}
    
function Class(name,grade,qp) {
    return {
        name: name,
        grade: grade,
        qp: qp
    }
}

function ClassElement(Class,num) {
    var newClass = c.cloneNode(true);
    newClass.setAttribute("id","class"+num);
    newClass.childNodes[1].childNodes[1].setAttribute("id","classname"+num);
    newClass.childNodes[1].childNodes[3].setAttribute("for","classname"+num);
    newClass.childNodes[3].childNodes[1].setAttribute("id","classgrade"+num);
    newClass.childNodes[3].childNodes[3].setAttribute("for","classgrade"+num);
    newClass.childNodes[5].childNodes[1].setAttribute("id","classqp"+num);
    newClass.childNodes[5].childNodes[3].setAttribute("for","classqp"+num);
    newClass.childNodes[7].childNodes[1].setAttribute("id","classdelete"+num);
    document.getElementById("classes").appendChild(newClass);
    document.getElementById("classname"+num).value = Class.name;
    document.getElementById("classgrade"+num).value = Class.grade;
    document.getElementById("classqp"+num).value = Class.qp;
    document.getElementById("classdelete"+num).addEventListener('MDCIconToggle:change', ({detail}) => {
        deleteClass(num);
    });
    window.mdc.autoInit(document.getElementById('classes'));
}

function updateClasses() {
    document.getElementById("classes").innerHTML = "";
    if(classes.length == 0) {
        document.getElementById("classes").innerHTML = "No classes added";
    }
    for(i = 0; i < classes.length; i++) {
        new ClassElement(classes[i],i);
    }
}

function updateClassData(id) {
    classes[id].name = document.getElementById("classname"+id).value;
    classes[id].grade = document.getElementById("classgrade"+id).value;
    classes[id].qp = document.getElementById("classqp"+id).value;
    calculateGPA();
    uploadClassesToFB();
}

function calculateGPA() {
    var sum = 0;
    var grade = 0;
    var qp = 0;
    var count = 0;
    for(i = 0; i < classes.length; i++) {
        if(classes[i].grade != "") {
            grade = parseInt(document.getElementById("classgrade"+i).value);
            count++;
        } else {
            grade = 0;
        }
        if(classes[i].qp != "") {
            qp = parseInt(document.getElementById("classqp"+i).value);
        } else {
            qp = 0;
        }
        if(grade+qp > 100+qp) {
            sum += 100+qp;
        } else {
            sum += grade+qp;
        }
    }
    if(count > 0) {
        sum /= count;
        sum = sum.toFixed(3);
        document.getElementById("gpa").innerHTML = sum+"%";
    } else {
        document.getElementById("gpa").innerHTML = "0.000%";
    }
    
}

function deleteClass(id) {
    var parent = document.getElementById("classes");
    var d = document.getElementById("class"+id);
    parent.removeChild(d);
    classes.splice(id,1);
    uploadClassesToFB();
    updateClasses();
    
}

function uploadClassesToFB() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).update({
        classes: classes
    }).then().catch(function(error) {
        console.log(error);
    });
}

function loadClassesFromFB() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).get().then(function(doc) {
        classes = doc.data().classes;
    }).then().catch(function(error) {
        console.log(error);
    });
}