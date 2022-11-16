const list = document.querySelector('#list');
const form = document.querySelector('#new-todo-form');
const formInput = document.querySelector("#todo-input");
const todoTemplate = document.querySelector("#list-template-item");
const LOCAL_STORAGE_PREFIX = "ADVANCE_TODO_LIST";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();
// console.log(todos)
todos.forEach(renderTodo);


form.addEventListener('submit',e=>{
    e.preventDefault();
    if(formInput.value.length == 0) return;

    const newTodo = {
        name : formInput.value,
        isComplete : false,
        id : new Date().valueOf().toString()
    }
    
    todos.push(newTodo);
    renderTodo(newTodo);
    saveTodo();
    formInput.value="";
})

// display todo passed as arguments using html template
function renderTodo(newTodo){
    const newTodoTemplate = todoTemplate.content.cloneNode(true);
    const newTodoTemplateItemText =newTodoTemplate.querySelector("[data-list-item-text]");
    const newTodoTemplateCheckBox = newTodoTemplate.querySelector('[data-list-item-checkbox]');
    const listItem =newTodoTemplate.querySelector('.list-item');

    newTodoTemplateItemText.innerText = newTodo.name;
    newTodoTemplateCheckBox.checked = newTodo.isComplete;
    listItem.dataset.todoId=newTodo.id;
    list.prepend(newTodoTemplate);
}

// saves todos array in local storage
function saveTodo(){
    localStorage.setItem(TODOS_STORAGE_KEY,JSON.stringify(todos));
}


// gets todos array from local storage
function loadTodos(){
    const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
    return JSON.parse(todosString) || [];
}


// Event Triggeres when we check the check Box
list.addEventListener('change' , e => {
    if(!e.target.matches('[data-list-item-checkbox]')) return;
    
    const parent = e.target.closest('.list-item');
    const todoId = parent.dataset.todoId;
    const todo = todos.find(t=> t.id === todoId);
    
    todo.isComplete = e.target.checked;
    
    saveTodo()
})

// events trigrred when we click on todo or delete
list.addEventListener('click' , e => {

    if(e.target.matches('[data-button-delete]') ){
        const parent = e.target.closest('.list-item');
        const todoId = parent.dataset.todoId;
        todos = todos.filter(t=> t.id !== todoId)    
        parent.remove()
    }
    
    if(e.target.matches('[data-list-item-text]')){
        const parent = e.target.closest('.list-item');
        const checkBox = parent.querySelector('[data-list-item-checkbox]')
        const todoId = parent.dataset.todoId;        
        const todo = todos.find(t=> t.id === todoId);
        checkBox.checked = !checkBox.checked
        todo.isComplete = checkBox.checked;   
    }

    saveTodo()
})



