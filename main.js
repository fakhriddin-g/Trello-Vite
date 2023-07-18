import {
	temp
} from "./modules/db"
import {
	useHttp
} from "./modules/http.request"
import {
	selectOption,
	selectedMemberArr,
	statusOption
} from "./modules/interface"
import {
	inviteMemberFunction
} from "./modules/modal.window"
import {
	searching
} from "./modules/search"
const {
	request
} = useHttp()

let block = document.querySelector('.main')
let todoList = document.querySelectorAll('.todo-list')
let todoItem = document.querySelectorAll('.todo-item')
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

let search = document.querySelector('.search-input')
let taskStatus = document.querySelector('.task-status')

// Request
request("/members", "get").then(res => {
	selectOption(res, selectMember)
	inviteMemberFunction(res, inviteMember)
	inviteMemberAmount.innerHTML = '+' + res.length
})

request("/blocks", "get")
	.then(res => {
		addBlockFunction(res, block)
	})
	.then(() => {
		request("/todos", "get").then(res => {
			taskFunction(res)
		})
	})



// // Variable
let todoGlobalStatus
export let temp_id
let h3Arr = []
let statusOptionArr = []



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
		item.setAttribute('data', todo.status)

		h3.innerHTML = todo.title
		p.innerHTML = todo.description

		item.append(h3, p, imgDiv)

		let blockToAppend = document.querySelector(`#${todo.status.trim()} .todo-list`)

		blockToAppend.append(item)

		temp.push(item)
		h3Arr.push(h3)

		item.ondragstart = () => {
			temp_id = todo.id
			item.classList.add('hold')
			setTimeout(() => (item.className = 'hide'), 0)
		}

		item.ondragend = () => {
			item.className = 'todo-item'
		}

		// Search
		searching(h3Arr, search)
	}

}

// Add Block
let arr = []

function addBlockFunction(arr, place) {

	for (const block of arr) {
		let data = block.title.toLowerCase().trim()

		let blockContainer = document.createElement('div')
		let blockSpan = document.createElement('span')
		let blockTodoList = document.createElement('div')
		let blockButton = document.createElement('button')

		blockContainer.classList.add('container')
		blockSpan.classList.add('todo-status')
		blockTodoList.classList.add('todo-list')
		blockTodoList.setAttribute('data', data)
		blockButton.classList.add('add-task', 'create-btn')

		blockSpan.innerHTML = block.title
		blockButton.innerHTML = "+ Add a card"

		blockContainer.append(blockSpan, blockTodoList, blockButton)
		place.append(blockContainer)

		statusOptionArr.push(data)

		blockContainer.id = block.title.toLowerCase().replaceAll(' ', '')



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
					request("/todos/" + item.id, "patch", {
						status: this.getAttribute(['data'])
					})
					this.append(item)
				}
			})
		}
	}

	statusOption(statusOptionArr, taskStatus)
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
				request("/todos/" + item.id, "patch", {
					status: this.getAttribute(['data'])
				})
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