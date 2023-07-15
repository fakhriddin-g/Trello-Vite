import { useHttp } from "./http.request"

let taskMemberBox = document.querySelector('.task-member')
const { request } = useHttp()

export let selectedMemberArr = []
let memberArr = []
let membersArr = []
request("/members", "get").then(res => {
  memberArr = res
})

// Set Options
export function selectOption(arr, select) {

  for (const member of arr) {
    let option = new Option()

    option.innerHTML = member.name

    select.append(option)

    select.onchange = () => {
      let selectedOption = select.options[select.selectedIndex];
      let memberName = select.value
      let selectedUser = memberArr.find(item => item.name === memberName);
      select.removeChild(selectedOption);
      membersArr.push(selectedUser)
      taskMember(membersArr, taskMemberBox, select)

      selectedMemberArr.push(selectedUser)
      // console.log(selectedMemberArr);
    }
  }

}

// Option Members
export function taskMember(arr, place, select) {
  place.innerHTML = ""

  for (const member of arr) {
    let memberBox = document.createElement('div')
    let memberBoxImg = document.createElement('img')
    let memberBoxSpan = document.createElement('span')
    let memberBoxDelete = document.createElement('div')

    memberBox.classList.add('member-box')
    memberBoxDelete.classList.add('member-box__delete')

    memberBoxImg.src = '/public/images/' + member.img + '.png'
    memberBoxSpan.innerHTML = member.name
    memberBoxDelete.innerHTML = 'x'

    memberBox.append(memberBoxImg, memberBoxSpan, memberBoxDelete)
    place.append(memberBox)
    
  }

}