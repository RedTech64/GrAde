var classes = [];

function initializeGPA(data) {
    if(data.classes == null) {
        classes = [];
        uploadClassesToFB();
    }
    var oldClasses = classes;
    classes = data.classes;
    if(JSON.stringify(oldClasses) != JSON.stringify(classes)) {
        updateClasses();
        calculateGPA();
    } else if(classes.length == 0 && oldClasses.length == 0) {
        updateClasses();
    }
}

function addClass() {
    var newClass = new Class("",null,null);
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
    var newClass = document.getElementById('class').cloneNode(true);
    newClass.setAttribute("id","class"+num);
    newClass.removeAttribute("class");
    newClass.childNodes[1].childNodes[1].childNodes[1].setAttribute("id","classname"+num);
    newClass.childNodes[1].childNodes[1].childNodes[3].setAttribute("for","classname"+num);
    newClass.childNodes[1].childNodes[3].childNodes[1].setAttribute("id","classgrade"+num);
    newClass.childNodes[1].childNodes[3].childNodes[3].setAttribute("for","classgrade"+num);
    newClass.childNodes[1].childNodes[5].childNodes[1].setAttribute("id","classqp"+num);
    newClass.childNodes[1].childNodes[5].childNodes[3].setAttribute("for","classqp"+num);
    newClass.childNodes[1].childNodes[7].childNodes[1].setAttribute("id","classdelete"+num);
    document.getElementById("classes").appendChild(newClass);
    document.getElementById("classname"+num).value = Class.name;
    document.getElementById("classgrade"+num).value = Class.grade;
    document.getElementById("classqp"+num).value = Class.qp;
    document.getElementById("classdelete"+num).onclick = function() {
        deleteClass(num);
    };
    mdc.autoInit(document, () => {});
}

function updateClasses() {
    document.getElementById("classes").innerHTML = "";
    if(classes.length == 0) {
        var no = document.getElementById('no-class').cloneNode(true);
        no.setAttribute('class',no.getAttribute('class').replace('hidden',''));
        document.getElementById('classes').appendChild(no);
    }
    for(var i = 0; i < classes.length; i++) {
        var grade;
        var qp;
        if(classes[i].grade == null) {
            grade = "";
        } else {
            grade = classes[i].grade.toString()
        }
        if(classes[i].qp == null) {
            qp = "";
        } else {
            qp = classes[i].qp.toString()
        }
        if(classes[i].linkID != "") {
            link = true;
            console.log("RUN");
            console.log(average);
            for(var j = 0; j < average.length; j++) {
                if(average[j].id == classes[i].linkID) {
                    for (var k = 0; k < average[j].categories.length; k++) {
                        var top = 0;
                        var bottom = 0;
                        var chips = average[j].categories[k].grades;
                        console.log(average[j]);
                        for (var l = 0; l < chips.length; l++) {
                            top += parseInt(chips[l].grade);
                            bottom += parseInt(chips[l].weight);
                        }
                        var sum = (top / bottom) * 100;
                        if (isNaN(sum)) {
                            sum = 0;
                        }
                        if (document.getElementById("decimal").checked) {
                            sum = sum.toFixed(2);
                        } else {
                            sum = sum.toFixed(0);
                        }
                        grade = sum * (average[j].categories[k].weight / 100);
                        sum = 0;
                    }
                    if (isNaN(grade)) {
                        grade = 0;
                    }
                    classes[i].grade = grade;
                    calculateGPA();
                }
            }
        }
        new ClassElement(new Class(classes[i].name,grade,qp),i);
    }
}

function updateClassData(id) {
    classes[id].name = document.getElementById("classname"+id).value;
    if(isNaN(document.getElementById("classgrade"+id).value) || document.getElementById("classgrade"+id).value == "") {
        classes[id].grade = null;
    } else {
        classes[id].grade = parseInt(document.getElementById("classgrade"+id).value);
    }
    if(isNaN(document.getElementById("classqp"+id).value) || document.getElementById("classqp"+id).value == "") {
        classes[id].qp = classes[id].qp = null;
    } else {
        classes[id].qp = parseInt(document.getElementById("classqp"+id).value);
    }
    calculateGPA();
    uploadClassesToFB();
}

function calculateGPA() {
    var sum = 0;
    var grade = 0;
    var qp = 0;
    var count = 0;
    for(var i = 0; i < classes.length; i++) {
        if(classes[i].grade != "" && classes[i].grade != null) {
            grade = classes[i].grade;
            count++;
        } else {
            grade = 0;
        }
        if(classes[i].qp != "" && classes[i].grade != null) {
            qp = classes[i].qp;
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
    classes.splice(id,1);
    calculateGPA();
    updateClasses();
    uploadClassesToFB();

}

function uploadClassesToFB() {
    var db = firebase.firestore();
    var ids = [];
    classes.forEach(function(c) {
        ids.push(c.id);
    });
    db.collection("users").doc(getUser().uid).collection("classes").get().then(function(docs) {
        docs.forEach(function (doc) {
            if (!ids.includes(doc.id)) {
                db.collection("users").doc(getUser().uid).collection("classes").doc(doc.id).delete();
            }
        });
    });
    classes.forEach(function(c) {
        if(c.id == null) {
            db.collection("users").doc(getUser().uid).collection("classes").add({
                name: c.name,
                grade: c.grade,
                qp: c.qp,
                linkName: "",
                linkID: ""
            }).then(function(ref) {
                ref.get().then(function(doc) {
                }).then(function() {
                    ref.update({
                        id: ref.id
                    });
                });
            });
        } else {
            db.collection("users").doc(getUser().uid).collection("classes").doc(c.id).update({
                id: c.id,
                name: c.name,
                grade: c.grade,
                qp: c.qp
            });
        }
    });
}