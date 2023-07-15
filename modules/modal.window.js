import { temp_id } from "../main"
import { temp} from "./db"

// Create Invite Members
export function inviteMemberFunction(arr, place) {
  // place.innerHTML = ""

  for (const inviter of arr) {
    let img = document.createElement('img')

    img.src = '/public/images/' + inviter.img + '.png'
    
    place.prepend(img)
  }
}

// Container Block
let arr = []
export function addBlockFunction(arr, place) {
  for (const block of arr) {
    let blockContainer = document.createElement('div')
    let blockSpan = document.createElement('span')
    let blockTodoList = document.createElement('div')
    let blockButton= document.createElement('button')

    blockContainer.classList.add('container')
    blockSpan.classList.add('todo-status')
    blockTodoList.classList.add('todo-list')
    blockButton.classList.add('add-task', 'create-btn')

    blockSpan.innerHTML = block.title
    blockButton.innerHTML = "+ Add a card"

    blockContainer.append(blockSpan, blockTodoList, blockButton)
    place.append(blockContainer)

    blockTodoList.ondragover = (e) => {
      e.preventDefault()
    }
  
    blockTodoList.ondragenter = function (e) {
      e.preventDefault()
      this.classList.add('hovered')
    }
  
    blockTodoList.ondragleave = function () {
      this.className = 'todo-list'
    }
  
    blockTodoList.ondrop = function () {
      this.className = 'todo-list'
      temp.forEach((item) => {
        if (item.id == temp_id) {
          this.append(item)
        }
      })
    }
  }
}