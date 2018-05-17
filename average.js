var grades = [];
var categoryData = [];
var categoryElements = [];
var advanced;
var singleCategory;

initializeAverage();

function initializeAverage() {
    loadAverageData().then(function() {
        changeMode(false);
        updateGrade();
    });
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

function changeMode(change) {
    var categorymanager = document.getElementById('category-manager-card');
    var categorychips = document.getElementById('category-chips-card');
    var categorygrades = document.getElementById('category-grades');
    if(change) {
        advanced = !advanced;
    }
    if(advanced) {
        document.getElementById('advanced').checked = true;
        categorymanager.setAttribute('class',categorymanager.getAttribute('class').toString().replace('hidden',''));
        categorychips.setAttribute('class','');
        categorygrades.setAttribute('class','');
        if(singleCategory != null) {
            singleCategory.remove();
        }
        document.getElementById('category-selector-chips').MDCChipSet.chips = [];
        if(categoryData.length == 0) {
            addCategory();
        }
        updateCategories();
        updateGrade();
    } else {
        document.getElementById('advanced').checked = false;
        for(var i = 0; i < categoryElements.length; i++) {
            categoryElements[i].remove();
        }
        categoryElements = [];
        document.getElementById('category-selector-chips').MDCChipSet.chips = [];
        if(!categorymanager.getAttribute('class').includes('hidden')) {
            categorymanager.setAttribute('class',categorymanager.getAttribute('class')+" hidden");
        }
        categorychips.setAttribute('class','hidden');
        categorygrades.setAttribute('class','hidden');
        singleCategory = new CategoryElement(new Category('Grades',grades,100,100),0);
        updateGrade();
    }
    uploadAverageData();
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
    if(categoryElements.length != 0) {
        //categoryElements[0].select();
    }
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
        categoryElements[i].setWeight(newWeight);
        sum += newWeight;
    }
    categoryElements[categoryElements.length-1].setWeight(100-sum);
}

function getCategoryName() {
    var names = [];
    var index = categoryData.length+1
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
    if(advanced) {
        categoryData[index].grades[categoryData[index].grades.length] = Grade;
        categoryElements[index].updateChips(categoryData[index].grades);
    } else {
        grades[grades.length] = Grade;
        singleCategory.updateChips(grades);
    }
    if(document.getElementById("autoclear").checked) {
        document.getElementById("grade").value = "";
    }
    updateGrade();
    uploadAverageData();
}

function removeGrade(category,index) {
    if(advanced) {
        categoryData[category].grades.splice(index,1);
        categoryElements[category].updateChips(categoryData[category].grades);
    } else {
        grades.splice(index,1);
        singleCategory.updateChips(grades);
    }
    updateGrade();
    uploadAverageData();
}

function clearGrades(index) {
    if(advanced) {
        categoryData[index].grades = [];
        categoryElements[index].updateChips([]);
    } else {
        grades = [];
       singleCategory.updateChips([]);
    }

    updateGrade();
    uploadAverageData();
}

function updateGrade() {
    if(advanced) {
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
    } else {
        var top = 0;
        var bottom = 0;
        for (var i = 0; i < grades.length; i++) {
            top += parseInt(grades[i].grade);
            bottom += parseInt(grades[i].weight);
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
        document.getElementById('average').innerHTML = sum + "%";
        sum = 0;
    }
}

function checkInput() {
    input = document.getElementById("grade").value;
    input = input.replace(/\s/g, '');
    if(input != "" && isNaN(input) && input.includes('/')) {
        var argOne = input.substring(0,input.indexOf('/'));
        var argTwo = input.substring(input.indexOf('/')+1);
        if(!isNaN(argOne) && !isNaN(argTwo)) {
            addGrade(new Grade(argOne,argTwo),getSelected());
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
    categoryData[index].weight = weight;
    updateGrade();
    uploadAverageData();
}

function reloadAllGrades() {
    if(advanced) {
        for (var i = 0; i < categoryElements.length; i++) {
            categoryElements[i].updateChips(categoryData[i].grades);
        }
    } else {
        singleCategory.updateChips(grades);
    }
}

function uploadAverageData() {
    if(categoryData == null) {
        categoryData = [];
    }
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).update({
        advanced: advanced,
        grades: grades,
        categories: categoryData
    }).then().catch(function(error) {
        console.log(error);
    });
}

function loadAverageData() {
    var db = firebase.firestore();
    return db.collection("users").doc(getUser().uid).get().then(function(doc) {
        advanced = doc.data().advanced;
        grades = doc.data().grades;
        categoryData = doc.data().categories;
    }).then().catch(function(error) {
        console.log(error);
    });
}