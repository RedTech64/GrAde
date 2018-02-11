var c = null;
var classNum = 1;
var list = [];

function onload() {
    c = document.getElementById("class0").cloneNode(true);
    list[0] = c;
}

function addclass() {
    var newC = c.cloneNode(true);
    newC.setAttribute("id","class"+classNum);
    newC.childNodes[1].childNodes[1].setAttribute("id","classname"+classNum);
    newC.childNodes[1].childNodes[3].setAttribute("for","classname"+classNum);
    newC.childNodes[3].childNodes[1].setAttribute("id","classgrade"+classNum);
    newC.childNodes[3].childNodes[3].setAttribute("for","classgrade"+classNum);
    newC.childNodes[5].childNodes[1].setAttribute("id","classqp"+classNum);
    newC.childNodes[5].childNodes[3].setAttribute("for","classqp"+classNum);
    newC.childNodes[7].setAttribute("for","classqp"+classNum);
    newC.childNodes[9].setAttribute("id","classmenu"+classNum);
    newC.childNodes[11].setAttribute("for","classmenu"+classNum);
    newC.childNodes[11].childNodes[1].setAttribute("id","classdelete"+classNum);
    newC.childNodes[11].childNodes[3].setAttribute("id","classduplicate"+classNum);
    document.getElementById("classes").appendChild(newC);
    list[classNum] = newC;
    classNum++;
    componentHandler.upgradeDom();
}

function classupdate() {
    var sum = 0;
    var count = 0;
    var grade = 0;
    var qp = 0;
    for(i = 0; i < list.length; i++) {
        if(list[i] != null) {
            if(document.getElementById("classgrade"+i).value != "") {
                grade = parseInt(document.getElementById("classgrade"+i).value);
            }
            if(document.getElementById("classqp"+i).value != "") {
                qp = parseInt(document.getElementById("classqp"+i).value);
            }
            count++;
            if(grade+qp > 100+qp)
                sum += 100+qp;
            else
                sum += grade+qp;
        }
    }
    if(count > 0) {
        sum /= count;
        sum = sum.toFixed(2);
        document.getElementById("gpa").innerHTML = sum+"%";
    }
    
}

function removeclass(id) {
    var e = document.getElementById("classes");
    var d = document.getElementById("class"+id.substring(11));
    e.removeChild(d);
    list[parseInt(id.substring(11))] = null;
}