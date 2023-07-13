import members, { memberBox } from "./modules/db"
import { selectOption, taskMember } from "./modules/interface"

let containers = document.querySelectorAll('.container')
let todoList = document.querySelectorAll('.todo-list')
let createTask = document.querySelectorAll('.create-btn')
let modal = document.querySelector('.modal-bg')
let closeModal = document.querySelector('.exit')
let form = document.forms.form

let selectMember = document.querySelector('#select-member')
let taskMemberBox = document.querySelector('.task-member')
selectOption(members, selectMember)
taskMember(members, taskMemberBox)

let todos = []
let temp = []
let temp_id

form.onsubmit = (e) => {
  e.preventDefault()

  let task = {
    id: Math.random()
  }

  let fm = new FormData(form)

  fm.forEach((value, key) => {
    task[key] = value
  })

  todos.push(task)
  taskFunction(todos)
  modal.style.display = 'none'
  form.reset()
  console.log(todos);
  todos = []
}

createTask.forEach(btn => {
  btn.onclick = () => {
    modal.style.display = 'flex'
  }
})

closeModal.onclick = () => {
  modal.style.display = 'none'
}

function taskFunction(arr) {

  for (const todo of arr) {
    let item = document.createElement('div')
    let h3 = document.createElement('h3')
    let p = document.createElement('p')

    item.classList.add('todo-item')
    item.setAttribute('id', todo.id)
    item.setAttribute('draggable', true)

    h3.innerHTML = todo.title
    p.innerHTML = todo.description

    item.append(h3, p)

    if (todo.status === 'todo') {
      todoList[0].append(item)
    } else if (todo.status === 'doing') {
      todoList[1].append(item)
    } else if (todo.status === 'done') {
      todoList[2].append(item)
    }

    temp.push(item)

    item.ondragstart = () => {
      console.log(temp);
      temp_id = todo.id
      item.classList.add('hold')
      setTimeout(() => (item.className = 'hide'), 0)
    }

    item.ondragend = () => {
      item.className = 'todo-item'
    }
  }

}

// DnD
for (const list of todoList) {
  list.ondragover = (e) => {
    e.preventDefault()
  }

  list.ondragenter = function (e) {
    e.preventDefault()
  }

  list.ondragleave = function () {
    this.className = 'todo-list'
  }

  list.ondrop = function () {
    console.log(this);
    this.className = 'todo-list'
    temp.forEach((item) => {
      if (item.id == temp_id) {
        this.append(item)
      }
    })
  }
}