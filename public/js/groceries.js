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


// const file = document.querySelector('.imgInput')
// foodAddSubmitBtn.disabled = true

// file.addEventListener('change', (e) => {
//   const isEmpty = e.target.value.length == 0
//   console.log(isEmpty)
//   if(isEmpty){
//     foodAddSubmitBtn.disabled = true
//   } else {
//     foodAddSubmitBtn.disabled = false
//   }
// })

// delete table rows that were created as a result of Azure
document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".tableRowDelete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const row = event.target.parentNode.parentNode;
      row.remove();
    });
  });
});


// this code is to add new table rows when the Add Item button is clicked
const addItemBtn = document.querySelector('#addItemBtn');
const tBody = document.querySelector('#tBody');

addItemBtn.addEventListener('click', () => {
  const newRow = document.createElement('tr');
  const today = new Date();

  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24 * 4);
  const formattedExpirationDate = expirationDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit', 
    year: 'numeric'
  });
  const formattedDate = today.toLocaleDateString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric'
  });
  for (let i = 0; i < 4; i++) {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    const names = ['food', 'purchaseDate', 'quantity', 'expirationDate'];
    input.name = names[i];
    if (i === 1) {
      // prefill second input with today's date
      
      input.value = formattedDate;
    }  else if (i === 2) {
      // prefill third input with a quantity number of 1
      input.value = 1;
    } else if (i === 3) {
      // prefill fourth input with a date four days from now
      input.value = formattedExpirationDate;
    }
    cell.appendChild(input);
    newRow.appendChild(cell);
  }
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete item';
  deleteBtn.addEventListener('click', () => {
    newRow.remove();
  });
  const deleteTd = document.createElement('td');
  deleteTd.appendChild(deleteBtn);
  newRow.appendChild(deleteTd);
  tBody.appendChild(newRow);
});
