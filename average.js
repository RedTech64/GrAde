var average = [];
var categoryData = [];
var categoryElements = [];
var averageElements = [];
var selected;
var initialized = false;
var oldData = [];
var link = false;

function initializeAverage(data) {
    console.log(data);
    var oldAverage = average;
    var oldSelected = selected;
    average = data.average;
    for(var i = 0; i < average.length; i++) {
        if(average[i].id == data.selectedAverage) {
            selected = i;
        }
    };
    oldData = data.categories;
    if(oldData != null) {
        average[0] = new Average('Average 1', 0, oldData);
    }
    if(average == null || average.length == 0) {
        average = [];
        average[0] = new Average('Average 1',0,[new Category('Category 1',[],100,100)]);
        selected = 0;
    }
    if(!initialized) {
        updateAverages();
        loadAverage(selected);
        initialized = true;
        uploadAverageData();
    } else {
        if(oldSelected != selected) {
            updateAverages();
            loadAverage(selected);
        } else if(JSON.stringify(oldAverage[selected].categories) != JSON.stringify(average[selected].categories)) {
            console.log('New Data: Updating: categories');
            categoryData = average[selected].categories;
            updateCategories();
            updateAverages();
        } else if(JSON.stringify(oldAverage[selected]) != JSON.stringify(average[selected])) {
            console.log('New Data: Updating: averages');
            updateAverages();
            loadAverage(selected);
        } else {
            console.log('New Data: Updating: nothing');
        }
        updateGrade();
    }
}

function loadAverage(index) {
    selected = index;
    categoryData = average[index].categories;
    updateCategories();
    updateGrade();
}

function handle(e) {
    if(e.keyCode === 13){
        e.preventDefault();
        checkInput();
    }
}

function Grade(grade,weight) {
    return {
        grade: grade,
        weight: weight
    }
}

function Category(name,grades,weight,max) {
    return {
        name: name,
        grades: grades,
        weight: weight,
        max: max
    }
}

function Average(name,selectedCategory,categories) {
    return {
        name: name,
        selectedCategory: selectedCategory,
        categories: categories
    }
}

function addAverage() {
    var name = getAverageName();
    average[average.length] = new Average(name,0,[new Category('Category 1',[],100,100)]);
    updateAverages();
    uploadAverageData();
}

function AverageElement(name,index) {
    var averageElement = document.getElementById('average-selection').cloneNode(true);
    averageElement.setAttribute('id','average-selection'+index);
    averageElement.childNodes[1].childNodes[1].childNodes[1].childNodes[1].setAttribute('id','average-radio'+index);
    if(index == selected) {
        averageElement.childNodes[1].childNodes[1].childNodes[1].childNodes[1].checked = true;
    }
    averageElement.childNodes[1].childNodes[3].setAttribute('id','average-name'+index);
    averageElement.childNodes[1].childNodes[3].childNodes[1].setAttribute('id','average-name-input'+index);
    averageElement.childNodes[1].childNodes[5].childNodes[1].setAttribute('for','average-name-input'+index);
    averageElement.childNodes[1].childNodes[5].setAttribute('id','average-delete'+index);
    if(index == 0 && average.length == 1) {
        averageElement.childNodes[1].childNodes[5].setAttribute('class','hidden');
    }
    averageElement.setAttribute('class','center');
    document.getElementById('average-list-container').appendChild(averageElement);
    mdc.autoInit(averageElement);
    document.getElementById('average-name'+index).MDCTextField.value = name;
    document.getElementById('average-radio'+index).onclick = function() {
      var index = parseInt(this.id.substring(13));
      if(index != selected) {
          loadAverage(index);
          selected = index;
          uploadAverageData();
      }
    };
    document.getElementById('average-delete'+index).onclick = function() {
        removeAverage(this.id.substring(14));
    }
}

function removeAverage(index) {
    average.splice(index,1);
    if(index == selected) {
        if(index == 0) {
            loadAverage(index)
        } else {
            selected = index-1;
            loadAverage(index-1);
        }
    }
    updateAverages();
    uploadAverageData();
}

function updateAverages() {
    document.getElementById('average-list-container').innerHTML = '';
    averageElements = [];
    for(var i = 0; i < average.length; i++) {
        averageElements[i] = new AverageElement(average[i].name,i);
    }
}

function updateCategories() {
    for(var i = 0; i < categoryElements.length; i++) {
        categoryElements[i].remove();
    }
    document.getElementById('category-selector-chips').MDCChipSet.chips = [];
    categoryElements = [];
    for(var k = 0; k < categoryData.length; k++) {
        categoryElements[categoryElements.length] = new CategoryElement(categoryData[k],k);
	}
	if(categoryElements.length == 1) {
        categoryElements[0].hideTrash();
    }
    document.getElementById('category-selector-chips').MDCChipSet.getDefaultFoundation().select(categoryElements[average[selected].selectedCategory].chip.getDefaultFoundation());
}

function fixCategoryChips(index) {
    average[selected].selectedCategory = parseInt(index);
    for(var i = 0; i < categoryData.length; i++) {
        var foundation = document.getElementById('category-selector-chips').MDCChipSet.chips[i].getDefaultFoundation();
        if(i == index) {
            foundation.setSelected(true);
        } else {
            foundation.setSelected(false);
        }
    }
    uploadAverageData();
}

function addCategory() {
    var name = getCategoryName();
    var grades = [];
    categoryData[categoryData.length] = new Category(name,grades,100,100);
    categoryElements[categoryElements.length] = new CategoryElement(categoryData[categoryData.length-1],categoryElements.length);
    if(categoryElements.length == 2) {
        categoryElements[0].showTrash();
    }
    if(categoryElements.length == 1) {
        categoryElements[0].hideTrash();
    }
    var sum = 0;
    var newWeight;
    for(var i = 0; i < categoryElements.length-1; i++) {
        newWeight = categoryElements[i].getWeight()*((categoryElements.length-1)/categoryElements.length);
        newWeight = Math.floor(newWeight);
        categoryElements[i].setWeight(newWeight);
        categoryData[i].weight = newWeight;
        sum += newWeight;
        sum = Math.floor(sum);
    }
    categoryElements[categoryElements.length-1].setWeight(100-sum);
    categoryData[categoryData.length-1].weight = 100-sum;
    uploadAverageData();
}

function getAverageName() {
    var names = [];
    var index = 1;
    for(var i = 0; i < average.length; i++) {
        names[names.length] = average[i].name;
    }
    while(true) {
        if (names.includes('Average ' + index)) {
            index++;
        } else {
            return 'Average '+index;
        }
    }
}

function getCategoryName() {
    var names = [];
    var index = 1;
    for(var i = 0; i < categoryData.length; i++) {
        names[names.length] = categoryData[i].name;
    }
    while(true) {
        if (names.includes('Category ' + index)) {
            index++;
        } else {
            return 'Category '+index;
        }
    }
}

function removeCategory(index) {
    categoryData.splice(index,1);
    updateCategories();
    uploadAverageData();
}

function syncWeight(index) {

}

function getSelected() {
    var chips = document.getElementById('category-selector-chips');
    for(var i = 0; i < chips.childNodes.length; i++) {
        if(chips.childNodes[i].getAttribute('class').includes('selected')) {
            return i;
        }
    }
}

function addGrade(Grade, index) {
    categoryData[index].grades[categoryData[index].grades.length] = Grade;
    categoryElements[index].updateChips(categoryData[index].grades);
    if(document.getElementById("autoclear").checked) {
        document.getElementById("grade").value = "";
    }
    updateGrade();
    uploadAverageData();
    if(link) {
        updateClasses();
    }
}

function removeGrade(category,index) {
    categoryData[category].grades.splice(index,1);
    categoryElements[category].updateChips(categoryData[category].grades);
    updateGrade();
    uploadAverageData();
    if(link) {
        updateClasses();
    }
}

function clearGrades(index) {
    categoryData[index].grades = [];
    categoryElements[index].updateChips([]);
    updateGrade();
    uploadAverageData();
    if(link) {
        updateClasses();
    }
}

function updateGrade() {
    var average = 0;
    for (var i = 0; i < categoryData.length; i++) {
        var top = 0;
        var bottom = 0;
        var chips = categoryData[i].grades;
        for (var j = 0; j < chips.length; j++) {
            top += parseInt(chips[j].grade);
            bottom += parseInt(chips[j].weight);
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
        categoryElements[i].setGrade(sum);
        average += sum * (categoryData[i].weight / 100);
        sum = 0;
    }
    if (isNaN(average)) {
        average = 0;
    }
    if (document.getElementById("decimal").checked) {
        average = average.toFixed(2);
    } else {
        average = average.toFixed(0);
    }
    document.getElementById('average').innerHTML = average + "%";
}

function checkInput() {
    input = document.getElementById("grade").value;
    input = input.replace(/\s/g, '');
    if(input != "" && isNaN(input) && input.includes('/')) {
        var argOne = input.substring(0,input.indexOf('/'));
        var argTwo = input.substring(input.indexOf('/')+1);
        if(!isNaN(argOne) && !isNaN(argTwo)) {
            addGrade(new Grade(parseInt(argOne),parseInt(argTwo)),getSelected());
        }
    }
    if(input != "" && !isNaN(input)) {
        addGrade(new Grade(parseInt(input),100),getSelected());
    }
}

function updateName(name,index) {
    categoryElements[index].setName(name);
    categoryData[index].name = name;
    uploadAverageData();
}

function updateWeight(weight,index) {
    categoryElements[index].setWeight(weight);
    categoryData[index].weight = parseInt(weight);
    updateGrade();
    uploadAverageData();
}

function reloadAllGrades() {
    for (var i = 0; i < categoryElements.length; i++) {
        categoryElements[i].updateChips(categoryData[i].grades);
    }
}

function uploadAverageData() {
    if(categoryData == null) {
        categoryData = [];
    }
    var db = firebase.firestore();
    var ids = [];
    average.forEach(function(a) {
        ids.push(a.id);
    });
    db.collection("users").doc(getUser().uid).collection("averages").get().then(function(docs) {
        docs.forEach(function (doc) {
            if (!ids.includes(doc.id)) {
                db.collection("users").doc(getUser().uid).collection("averages").doc(doc.id).delete();
            }
        });
    });
    average[selected].categories = categoryData;
    average.forEach(function(average) {
        if(average.id == null) {
            db.collection("users").doc(getUser().uid).collection("averages").add({
                name: average.name,
                categories: average.categories,
                selectedCategory: average.selectedCategory
            }).then(function(ref) {
                ref.get().then(function(doc) {
                }).then(function() {
                    ref.update({
                        id: ref.id
                    });
                });
            });
        } else {
            db.collection("users").doc(getUser().uid).collection("averages").doc(average.id).update({
                id: average.id,
                name: average.name,
                categories: average.categories,
                selectedCategory: average.selectedCategory
            });
        }
    });
    db.collection("users").doc(getUser().uid).update({
        selectedAverage: average[selected].id
    });
}