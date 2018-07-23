class CategoryElement {

    constructor(Category,index) {
        this.name = Category.name;
        this.grades = Category.grades;
        this.weight = Category.weight;
        this.index = index;

        this.average = 0;

        //Create Category Grade
        this.grade = document.getElementById('category-grade').cloneNode(true);
        this.grade.setAttribute('class',this.grade.getAttribute('class').replace('hidden',''));
        this.grade.setAttribute('id','category-grade'+this.index);
        document.getElementById('category-grades').appendChild(this.grade);

        //Create Category Chip
        var categorychips = document.getElementById('category-selector-chips');
        categorychips.MDCChipSet.addChip(this.name,null,null);
        this.chip = categorychips.MDCChipSet.chips[this.index];
        document.getElementById('category-selector-chips').childNodes[this.index].setAttribute('id','category-chip'+this.index);
        document.getElementById('category-selector-chips').childNodes[this.index].onclick = function() {
          fixCategoryChips(this.id.substring(13));
        };

        //Create Grade Card
        this.card = document.getElementById('category-card').cloneNode(true);
        this.card.setAttribute('id','category-card'+this.index);
        this.card.childNodes[1].setAttribute('id','category-title'+this.index);
        this.card.childNodes[5].childNodes[3].setAttribute('id','category-chips'+this.index);
        this.card.childNodes[9].childNodes[1].setAttribute('id','category-clear'+this.index);
        document.getElementById('average-cards').appendChild(this.card);
        this.title = document.getElementById('category-title'+this.index);
        this.chips = document.getElementById('category-chips'+this.index);
        this.clear = document.getElementById('category-clear'+this.index);
        this.clear.onclick = function() {
            clearGrades(this.id.substring(14));
        };
        mdc.autoInit(document.getElementById('category-card'+this.index));
        this.card.setAttribute('class',this.card.getAttribute('class').toString().replace('hidden',''));
        this.updateChips(this.grades);

        //Create Category Editor
        this.edit = document.getElementById('category').cloneNode(true);
        this.edit.setAttribute('class','');
        this.edit.setAttribute('id','category'+this.index);
        this.edit.childNodes[1].childNodes[1].setAttribute('id','category-name'+this.index);
        this.edit.childNodes[1].childNodes[1].childNodes[1].setAttribute('id','category-name-input'+this.index);
        this.edit.childNodes[1].childNodes[1].childNodes[3].setAttribute('for','category-name-input'+this.index);
        this.edit.childNodes[1].childNodes[1].childNodes[1].value = " ";
        this.edit.childNodes[1].childNodes[3].setAttribute('id','category-weight'+this.index);
        this.edit.childNodes[1].childNodes[3].childNodes[1].setAttribute('id','category-weight-input'+this.index);
        this.edit.childNodes[1].childNodes[3].childNodes[3].setAttribute('for','category-weight-input'+this.index);
        this.edit.childNodes[1].childNodes[3].childNodes[1].value = " ";
        this.edit.childNodes[1].childNodes[5].setAttribute('id','category-slider'+this.index);
        this.edit.childNodes[1].childNodes[7].childNodes[1].setAttribute('id','category-delete'+this.index);
        document.getElementById('category-list-container').appendChild(this.edit);
        this.nameField = new mdc.textField.MDCTextField(document.getElementById('category-name'+this.index));
        this.nameFieldInput = document.getElementById('category-name-input'+this.index);
        this.nameFieldInput.onchange = function() {
            var index = parseInt(this.getAttribute('id').substring(19));
            updateName(this.value,index);
        };
        this.weightField = new mdc.textField.MDCTextField(document.getElementById('category-weight'+this.index));
        this.weightFieldInput = document.getElementById('category-weight-input'+this.index);
        this.weightFieldInput.oninput = function() {
            var index = parseInt(this.getAttribute('id').substring(21));
            var value = this.value;
            if(isNaN(parseInt(value))) {
                value = 0;
            }
            updateWeight(value,index);
        };
        this.slider = new mdc.slider.MDCSlider(document.getElementById('category-slider'+this.index));
        console.log(this.slider);
        document.getElementById('category-slider'+this.index).addEventListener('MDCSlider:change',function() {
            var index = parseInt(this.getAttribute('id').substring(15));
            var category = categoryElements[index];
            updateWeight(category.slider.value,index);
        });
        this.trash = document.getElementById('category-delete'+this.index);
        this.trashMDC = new mdc.iconToggle.MDCIconToggle(this.trash);
        this.trash.onclick = function() {
            removeCategory(this.id.substring(15));
        };
        this.setWeight(this.weight);
        this.updateGradeDisplay();
        this.setName(this.name);
    }

    setName(name) {
        this.nameField.value = name;
        this.title.innerHTML = name;
        document.getElementById('category-selector-chips').childNodes[this.index].childNodes[0].innerHTML = name;
        this.updateGradeDisplay();
    }

    setWeight(weight) {
        this.slider.value = parseInt(weight);
        this.weightField.value = parseInt(weight);
        syncWeight();
    }

    setGrade(grade) {
        this.average = grade;
        this.updateGradeDisplay();
    }

    getWeight() {
        return this.slider.value;
    }

    getName() {
        return this.nameField.value;
    }

    getIndex() {
        return this.index;
    }

    select() {
        document.getElementById('category-selector-chips').MDCChipSet.getDefaultFoundation().select(document.getElementById('category-selector-chips').MDCChipSet.chips[this.index].getDefaultFoundation());
    }

    remove() {
        document.getElementById('category-grades').removeChild(this.grade);
        this.chip.remove();
        document.getElementById('category-selector-chips').MDCChipSet.chips.splice(this.index,1);
        document.getElementById('category-list-container').removeChild(this.edit);
        document.getElementById('average-cards').removeChild(this.card);
    }

    showTrash() {
        this.trash.setAttribute('class',this.trash.getAttribute('class').toString().replace('hidden',''))
    }

    hideTrash() {
        this.trash.setAttribute('class',this.trash.getAttribute('class')+' hidden');
    }

    updateChips(grades) {
        this.chips.innerHTML = "";
        for(var i = 0; i < grades.length; i++) {
            if(document.getElementById("weight").checked) {
                this.newChip(grades[i].grade+"/"+grades[i].weight,i);
            } else {
                if(grades[i].weight != 0) {
                    this.newChip(Math.round((grades[i].grade/grades[i].weight)*100),i);
                } else {
                    this.newChip(grades[i].grade+"/"+grades[i].weight,i);
                }
            }
        }
        if(this.chips.innerHTML == "") {
            this.chips.innerHTML = "No grades entered";
        }
    }

    newChip(grade,num) {
        var deletechip = document.getElementById("delete-chip").cloneNode(true);
        deletechip.setAttribute('id','delete-chip'+num);
        deletechip.setAttribute('category',this.index);
        if(this.chips.innerHTML == "No grades entered") {
            this.chips.innerHTML = "";
        }
        this.chips.MDCChipSet.addChip(grade,null,deletechip);
        document.getElementById("delete-chip"+num).onclick = function() {
            removeGrade(this.getAttribute('category'),this.id.substring(11));
        }
    }

    updateGradeDisplay() {
        this.grade.innerHTML = this.getName()+": "+this.average+"%";
    }
}