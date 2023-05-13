// const editBts = document.querySelectorAll('.edit')

// editBts.forEach((btn) => btn.addEventListener('click', edit))

// function edit() {
//     const input = this.parentNode.childNodes[0]
//     input.select()
//     input.focus()
//     input.addEventListener('keyup', saveText)
// }

// function saveText(e) {
//     const newValue = e.target.value
//     const _id = e.target.dataset.id
//     const index = e.target.dataset.index
//     console.log(index)
//     fetch('/updateText', {
//         method: 'put',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             newValue, _id, index
//         })
//     }).then((res) => res.json())
//         .then((data) => console.log(data))
// }

const manualFoodAddInput = document.querySelector('.manualFoodAdd')
const foodAddSubmitBtn = document.querySelector('.foodAddSubmit')

// switch to toggle on/off depending on if a user has started typing in the input
// let isDisabled = true
// foodAddSubmitBtn.disabled = isDisabled
// manualFoodAddInput.addEventListener('input', (e) => {
//     const isNonEmptyInput = e.target.value.length > 0
//     // console.log(isNonEmptyInput)
//     // console.log(e.target.value)
//     if (isNonEmptyInput) {
//         // console.log('it\'s not empty')
//         isDisabled = false
//     } else {
//         isDisabled = true
//     }
//     foodAddSubmitBtn.disabled = isDisabled
// })

// file.addEventListener('change', (e) => {
//     console.log(e.target.value)
//     const isEmptyFile = e.target.value.length === 0

//     if (isEmptyFile) {
//         // console.log('it\'s not empty')
//         isDisabled = false
//     } else {
//         isDisabled = true
//     }
//     foodAddSubmitBtn.disabled = isDisabled
// })


const file = document.querySelector('.imgInput')
foodAddSubmitBtn.disabled = true

file.addEventListener('change', (e) => {
  const isEmpty = e.target.value.length == 0
  console.log(isEmpty)
  if(isEmpty){
    foodAddSubmitBtn.disabled = true
  } else {
    foodAddSubmitBtn.disabled = false
  }
})
