document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

let btnelemnt = document.getElementById('add-btn');
let inputelemnt = document.getElementById('todo-input');
let ullist = document.getElementById('todo-items-list');
let editingTask = null;

function saveTasksToLocalStorage() {
    const tasks = [];
    const items = ullist.getElementsByTagName('li');
    for (let item of items) {
        const task = {
            text: item.querySelector("span").innerText,
            completed: item.querySelector("input[type=checkbox]").checked,
            backgroundColor: item.classList.contains('completed') ? 'completed' : ''
        };
        tasks.push(task);
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let task of tasks) {
        addTaskToDOM(task.text, task.completed,task.backgroundColor );
    }
}

function addTaskToDOM(taskText, completed = false,backgroundColor='') {
    let li = document.createElement("li");
    if (backgroundColor === 'completed') {
        li.classList.add('completed');
    }

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener('change', markComplete);
    li.appendChild(checkbox);

    let spanEl = document.createElement("span");
    spanEl.innerText = taskText;
    li.appendChild(spanEl);

    li.style.cssText = 'animation-name:slideIn;';
    ullist.appendChild(li);

    let trashbtn = document.createElement('i');
    trashbtn.classList.add("fas", "fa-trash");
    li.appendChild(trashbtn);

    let editbtn = document.createElement('i');
    editbtn.classList.add("fas", "fa-edit");
    li.appendChild(editbtn);
    inputelemnt.value = "";
    inputelemnt.focus();

    // for (let cls of classList) {
    //     li.classList.add(cls);
    // }

    saveTasksToLocalStorage();  // Save tasks whenever a new task is added
}

btnelemnt.addEventListener("click", function() {
    let inputdata = inputelemnt.value.trim();

    if (!inputdata) {
        showToast('Task cannot be empty');
        return;
    }

    if (isDuplicateTask(inputdata)) {
        showToast('Duplicate task name is not allowed');
        return;
    }

    if (editingTask) {
        editingTask.querySelector("span").innerText = inputdata;
        btnelemnt.innerHTML = '<i class="fas fa-plus"></i> Add';
        editingTask = null;
        successToast("Task Edited Successfully");
        saveTasksToLocalStorage();
    } else {
        successToast('Task added Successfully ');
        addTaskToDOM(inputdata);
    }

     inputelemnt.value = "";
     inputelemnt.focus();
});

ullist.addEventListener("click", function(event) {
    if (event.target.classList.contains('fa-trash')) {
        deleteElementWithConfirmation(event);
    } else if (event.target.classList.contains('fa-edit')) {
        editElementWithConfirmation(event);
    }
});

function isDuplicateTask(inputdata) {
    const items = ullist.getElementsByTagName('li');
    for (let item of items) {
        if (item.querySelector('span').innerText === inputdata) {
            return true;
        }
    }
    return false;
}

function markComplete(event) {
    let item = event.target.parentElement;
    if (event.target.checked) {
        item.classList.add("completed");
        successToast("Task successfully Completed");
        
    } else {
        item.classList.remove("completed");
        showToast("Task  Incomplete");
        
    }
    saveTasksToLocalStorage();
}

function showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 800);
}
function successToast(message) {
    let toastContainer = document.getElementById('toast-container');
    let toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> ${message}`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 800);
}




function deleteElementWithConfirmation(event) {
    if (event.target.classList.contains('fa-trash')) {
        let item = event.target.parentElement;
        showToasts("Are you sure you want to delete this task?", (confirmed) => {
            if (confirmed) {
                item.classList.add("slideout");
                item.addEventListener("transitionend", function () {
                    item.remove();
                    saveTasksToLocalStorage();
                    
                });
                successToast('Task Deleted Successfully');
            }
           
        });
    }
}

function editElementWithConfirmation(event) {
    if (event.target.classList.contains('fa-edit')) {
        showToasts("Are you sure you want to edit this task?", (confirmed) => {
            if (confirmed) {
                editingTask = event.target.parentElement;
                let editedvalue = editingTask.querySelector("span").innerText;
                inputelemnt.value = editedvalue;
                inputelemnt.focus();
                btnelemnt.innerHTML = 'Save';
                
            }
        });
    }
    
}

function showToasts(message, callback) {
    document.getElementById('main-container').classList.add('blur');
    let toastContainer = document.getElementById('yes');
    let toast = document.createElement('div');
    toast.className = 'deletetoast';
    toast.innerHTML = `
        <i class="fas fa-info-circle"></i> ${message}
        <button class="yes-btn">Yes</button>
        <button class="no-btn">No</button>
    `;
    toastContainer.appendChild(toast);

    toast.querySelector('.yes-btn').addEventListener('click', () => {
        callback(true);
        toast.remove();
        document.getElementById('main-container').classList.remove('blur');
    });

    toast.querySelector('.no-btn').addEventListener('click', () => {
        callback(false);
        toast.remove();
        document.getElementById('main-container').classList.remove('blur');
    });
}

inputelemnt.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        btnelemnt.click(); // Trigger the click event on the add button
    }
});