const itemTemplate = document.querySelector("#list-item-template");
const list = document.querySelector(".list-items > ul");
 const filterOption = document.querySelector(".filter-todo");   //

const items = [];
let currentMenu = null;

function storeItems() {
    localStorage.setItem('todo-list', JSON.stringify(items));
}

function loadItems() {
  let storedItems = localStorage.getItem('todo-list');
  if (!storedItems) {
    return [
        { title: 'Setup repository', checked: false },  
        { title: 'Design UI', checked: false },  
        { title: 'Get groceries', checked: false },  
        { title: 'Automate', checked: false },  
        { title: 'Wash dishes', checked: false },  
        { title: 'Setup code', checked: false }  
    ];
  }

  try {
    storedItems = JSON.parse(storedItems);
  } catch(e) {
    storedItems = [];
  }

  return storedItems;
}
  
function getAnimationDuration(node) {
  const style = window.getComputedStyle(node);
  let duration = style.getPropertyValue('--animation-duration');
  duration = parseFloat(duration);

  return duration;
}

function displayItem(item, atTop = false, appear = false) {
  if (atTop) {
    items.unshift(item);
  } else {
    items.push(item);
  }

    const itemNode = itemTemplate.content.firstElementChild
       .cloneNode(true);

       const itemTitle = itemNode.querySelector('.list-item__title > *');
       itemTitle.innerText = item.title;

       if (item.checked) {
        itemNode.classList.add('checked');
       }
       if (item.important) {
        itemNode.classList.add('important');
       }

    itemNode.addEventListener('click', (e) => {
        item.checked = !item.checked;      //menit 10.53 
        storeItems();
        if (item.checked) {
          itemNode.classList.add('checked');
        } else {
          itemNode.classList.remove('checked');  
        }
    }); 
    
    //bintang : important buttton 
    const importantButton = itemNode.querySelector('.list-item__important');
    importantButton.addEventListener('click', (e) => {
      e.stopPropagation();
      item.important = !item.important;
      itemNode.classList.toggle('important');
      storeItems();
    });

    const menuButton = itemNode.querySelector('.list-item__menu-button');
    const menuBase = itemNode.querySelector('.list-item__menu-base');
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();

      if (currentMenu) {
        currentMenu.classList.remove('open');
        currentMenu = null;
      }

      menuBase.classList.add('open');
      currentMenu = menuBase;
    });
    menuBase.addEventListener('click', (e) => {
      e.stopPropagation();
      menuBase.classList.remove('open');
      currentMenu = null;
    });

    const deleteButton = itemNode.querySelector('.list-item__delete-button');
    deleteButton.addEventListener('click', () => {
      itemNode.classList.add('deleted');
      const duration = getAnimationDuration(deleteButton);
      setTimeout(() => {
        const index = items.indexOf(item);
        items.splice(index, 1);
        storeItems();
        list.removeChild(itemNode);
      }, duration);
    });

    

  
    if (atTop) {
        list.prepend(itemNode);
    } else {
        list.appendChild(itemNode);  
    }    
    
    if (appear) {
      itemNode.classList.add('appear');
    }
}

const addPanel = document.querySelector('.add-panel');   //menit 17:56 
const addNavButton = document.querySelector('.navbar .add-button');
addNavButton.addEventListener('click',() => {
  addNavButton.classList.toggle('open');
  addPanel.classList.toggle('open');
});


const addTodoButton = document.querySelector('.add-panel__button');
const addTodoInput = document.querySelector('.add-panel__input');

function addItem() {
  const title = addTodoInput.value;
  if (!title) {
    return;
  }

  const newItem = {
    title,
    checked: false,
  };
  displayItem(newItem, true, true);
  storeItems();

  addTodoInput.value = '';

  addTodoButton.classList.add('sending');
  const duration = getAnimationDuration(addTodoButton);

  // for being able to restart the animation 26:50
  setTimeout(() => {
    addTodoButton.classListremove('sending');
  }, duration);
}

addTodoButton.addEventListener('click', () => {
  addItem();
});
addTodoInput.addEventListener('keyup', (e) => {
  if (e.altKey  || e.shiftKey ||  e.ctrlKey) {
    return;
  }

  if (e.key === 'Enter') {
    addItem();
   } else if (e.key === 'Escape') {
      addTodoInput.value = '';
    }
}, true);

const currentItems = loadItems();
currentItems
  .forEach((item) => {
    displayItem(item);
});

function filterTodo(e){
  const todo = loadItems.childNodes;
  todo.forEach(function(todo) {
    switch (e.target.classList) {
      case "list-item__important":
        todo.style.display = "flex";
        break;
        case "list-item__note":
          if (todo.classList.contains("list-item__important")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
    }
  }) 
}