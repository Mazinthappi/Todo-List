let btnelemnt = document.getElementById('add-btn') ;
let inputelemnt = document.getElementById('todo-input') ;
let ullist = document.getElementById('todo-items-list') ;
let inputdata;

 

function addelement(event){
    let inputdata = inputelemnt.value;
    
    let li = document.createElement("li");

    let spanEl = document.createElement("span"); 
    li.appendChild(spanEl);
    spanEl.innerText=inputdata;

    li.style.cssText ='animation-name:slideIn;'
    ullist.appendChild(li)
    //console.log(li)
    inputelemnt.value=""; 
    inputelemnt.focus()  
    
    // create delete button
    let trashbtn = document.createElement('i');
    trashbtn.classList.add("fas","fa-trash");
    li.appendChild(trashbtn);

    //create edit button
    let editbtn = document.createElement('i');
    editbtn.classList.add("fas","fa-edit");
    li.appendChild(editbtn);
    
}

function deletelement(event){

    //console.log(event.target.classList[0])
    if(event.target.classList[1] ==='fa-trash'){
        let item = event.target.parentElement;
        var result = confirm("Are you sure you want to delete this item?");
        if (result) {
            item.classList.add("slideout");  //animation
        item.addEventListener("transitionend",function(){ //addeventlistner for end of the transition
            item.remove();          
         }); 
            
        } else {
            console.log("Delete action canceled.");
        }
              
    }    
}

function editelement(event){
    
    if(event.target.classList[1] === 'fa-edit'){
        let editedvalue = prompt("please edit value");
        //console.log(editedvalue);
        let item = event.target.parentElement;
        let spanEl=item.querySelector("span");
        spanEl.innerText=editedvalue;
    }
    
//console.log(event.target.classList);
}

btnelemnt.addEventListener("click",addelement);
ullist.addEventListener("click",deletelement);
ullist.addEventListener("click",editelement);


