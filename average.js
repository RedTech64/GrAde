var grades = [0];

function initialize() {
    loadData().then(function() {
        updateChips();
        update();
    });
}

function handle(e) {
    if(e.keyCode === 13){
        e.preventDefault();
        addChip();
    }
}

function Chip(grade,num) {
    if(document.getElementById("chips").innerHTML == "No grades entered")
        document.getElementById("chips").innerHTML = "";
    document.getElementById("chips").innerHTML = document.getElementById("chips").innerHTML + "<span class=\"pad mdl-chip mdl-chip--deletable\" id=\"" + "chip" + num + "\"><span class=\"mdl-chip__text\">" + grade + "</span><button type=\"button\" class=\"mdl-chip__action\" id=\"" + "delete" + num + "\" onclick=\"remove(this.id)\"><i class=\"material-icons\">cancel</i></button></span>";
    }

function remove(id) {
    grades.splice(id.substring(6),1);
    grades[0]--;
    updateChips();
    update();
    uploadData();
    }

function update() {
    var sum = 0;
    for(i = 1; i < grades.length; i++) {
        sum += parseInt(grades[i]);
    }
    sum /= (grades.length-1);
    if(document.getElementById("decimal").checked) {
        sum = sum.toFixed(2);
    } else {
        sum = sum.toFixed(0);
    }
    if(grades.length == 1) {
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
        new Chip(document.getElementById("grade").value,grades[0]+1);
        grades[grades[0]+1] = parseInt(document.getElementById("grade").value);
        grades[0]++;
        update();
        uploadData();
    }
    if(document.getElementById("autoclear").checked)
        document.getElementById("grade").value = "";
}

function uploadData() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).update({
        grades: grades
    });
}

function loadData() {
        var db = firebase.firestore();
        return db.collection("users").doc(getUser().uid).get().then(function(doc) {
        grades = doc.data().grades;
        });
}