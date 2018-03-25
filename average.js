function handle(e) {
    if(e.keyCode === 13){
        e.preventDefault();
        addchip();
    }
}
var count = 0;
var list = [];
function Chip(grade) {
    if(document.getElementById("chips").innerHTML == "No grades entered")
        document.getElementById("chips").innerHTML = "";
    document.getElementById("chips").innerHTML = document.getElementById("chips").innerHTML + "<span class=\"pad mdl-chip mdl-chip--deletable\" id=\"" + "chip" + count + "\"><span class=\"mdl-chip__text\">" + grade + "</span><button type=\"button\" class=\"mdl-chip__action\" id=\"" + "delete" + count + "\" onclick=\"remove(this.id)\"><i class=\"material-icons\">cancel</i></button></span>";
        list[count] = parseInt(grade);
        count++;
        update();
    }

function remove(id) {
    list[parseInt(id.substring(6))] = null;
    var c = document.getElementById(chips)
    chips.removeChild(document.getElementById(document.getElementById(id).parentNode.id));
    if(document.getElementById("chips").innerHTML == "") {
        document.getElementById("chips").innerHTML = "No grades entered";
    }
    update();
}

function update() {
    var sum = 0;
    var num = 0;
    for(i = 0; i < list.length; i++) {
        if(list[i] != null) {
            sum += parseInt(list[i]);
            num++;
        }	
    }
    sum /= num;
    if(document.getElementById("decimal").checked)
        sum = sum.toFixed(2);
    else
        sum = sum.toFixed(0);
    if(num == 0)
        document.getElementById("average").innerHTML = "0%";
    else
        document.getElementById("average").innerHTML = sum+"%";
    sum = 0;
}

function addchip() {
   if(!document.getElementById("grade").value == "")
        new Chip(document.getElementById("grade").value);
    if(document.getElementById("autoclear").checked)
        document.getElementById("grade").value = "";
}