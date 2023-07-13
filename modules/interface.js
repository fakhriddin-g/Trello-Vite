
export function selectOption(arr, select) {
  for (const member of arr) {
    let option = new Option()

    option.innerHTML = member.name

    select.append(option)

    arr.forEach(item => {

      let opt = new Option(item.name, JSON.stringify(item))
      let filtred = JSON.parse(opt.value)
      console.log(filtred);
      // if (!temp.includes(filtred.id)) {
        // select.append(opt)
      // }
    })
  }
}

export function taskMember(arr, place) {
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