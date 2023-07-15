import { temp } from "./modules/db"
import { useHttp } from "./modules/http.request"
import { selectOption, selectedMemberArr } from "./modules/interface"
import { addBlockFunction, inviteMemberFunction } from "./modules/modal.window"
const { request } = useHttp()

let block = document.querySelector('.main')
let todoList = document.querySelectorAll('.todo-list')
let createTask = document.querySelectorAll('.create-btn')
let modal = document.querySelector('.modal-bg')
let inviteModal = document.querySelector('.invite-bg')
let addBlockModal = document.querySelector('.add-block-bg')
let closeModal = document.querySelectorAll('.exit')
let form = document.forms.form
let inviteForm = document.forms.inviteForm
let addBlockForm = document.forms.addBlockForm

let selectMember = document.querySelector('#select-member')
let taskMemberBox = document.querySelector('.task-member')

let inviteMember = document.querySelector('.member')
let inviteMemberAmount = document.querySelector('.member span')
let inviteMemberBtn = document.querySelector('.invite-btn')
let addBlockBtn = document.querySelector('#add-block')

// Request
request("/members", "get").then(res => {
  selectOption(res, selectMember)
  inviteMemberFunction(res, inviteMember)
  inviteMemberAmount.innerHTML = '+' + res.length
})

request("/todos", "get").then(res => {
  taskFunction(res)
})

request("/blocks", "get").then(res => {
  addBlockFunction(res, block)
})

// // Variable
// let temp = []
export let temp_id

// Add Tasks Form Onsubmit
form.onsubmit = (e) => {
  e.preventDefault()

  let task = {
    id: Math.random(),
    members: []
  }

  let fm = new FormData(form)

  fm.forEach((value, key) => {
    task[key] = value
  })

  selectedMemberArr.forEach(member => {
    console.log(member.name);
    task.members.push(member.id)
  })

  console.log(task);

  request("/todos", "post", task)
  location.assign('/')
  form.reset()
}

// Invite Form
inviteForm.onsubmit = (e) => {
  e.preventDefault()

  let inviteMembers = {}

  let fm = new FormData(inviteForm)

  fm.forEach((value, key) => {
    inviteMembers[key] = value
  })

  request("/members", "post", inviteMembers)
  location.assign('/')
  inviteForm.reset()
}

// Add Block Form
addBlockForm.onsubmit = (e) => {
  e.preventDefault()
  
  let block = {}

  let fm = new FormData(addBlockForm)

  fm.forEach((value, key) => {
    block[key] = value
  })

  request("/blocks", "post", block)
  location.assign('/')
  addBlockForm.reset()
}

// Create Tasks
function taskFunction(arr) {

  for (const todo of arr) {
    let item = document.createElement('div')
    let h3 = document.createElement('h3')
    let p = document.createElement('p')
    let imgDiv = document.createElement('div')
    for (const avatar of todo.members) {
      let img = document.createElement('img')

      imgDiv.classList.add('img-box')
      request("/members", "get").then(res => {
        res.forEach(member => {
          if (avatar === member.id) {
            img.src = '/public/images/' + member.img + '.png'
          }
        })
      })

      imgDiv.append(img)
    }

    item.classList.add('todo-item')
    item.setAttribute('id', todo.id)
    item.setAttribute('draggable', true)

    h3.innerHTML = todo.title
    p.innerHTML = todo.description

    item.append(h3, p, imgDiv)

    if (todo.status === 'todo') {
      todoList[0].append(item)
    } else if (todo.status === 'doing') {
      todoList[1].append(item)
    } else if (todo.status === 'done') {
      todoList[2].append(item)
    }

    temp.push(item)

    item.ondragstart = () => {
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
    this.classList.add('hovered')
  }

  list.ondragleave = function () {
    this.className = 'todo-list'
  }

  list.ondrop = function () {
    this.className = 'todo-list'
    temp.forEach((item) => {
      if (item.id == temp_id) {
        this.append(item)
      }
    })
  }
}

// Modal
createTask.forEach(btn => {
  btn.onclick = () => {
    modal.style.display = 'flex'
  }
})

closeModal.forEach(btn => {
  btn.onclick = () => {
    modal.style.display = 'none'
    inviteModal.style.display = 'none'
    addBlockModal.style.display = 'none'
  }
})

inviteMemberBtn.onclick = () => {
  inviteModal.style.display = 'flex'
}

addBlockBtn.onclick = () => {
  addBlockModal.style.display = 'flex'
}
// Modal
