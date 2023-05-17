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



const groceryImg = document.querySelector('.uploadedGroceryHaulImage')

const canvas = document.createElement('canvas');
// Replace the <img> tag with the canvas element -- takes image,processes it into canvas, when done deletes image and places canvas in its place

document.querySelector('.container').replaceChild(canvas, groceryImg);

function drawCanvas(foodToHighlight) {
  // Draw the image on the canvas
  const ctx = canvas.getContext('2d');
  // Create a canvas element and set its width and height to match the image

  let htw = groceryImg.height / groceryImg.width
  canvas.height = 800 * htw
  canvas.width = 800

  //shrinking img down to canvas size
  ctx.drawImage(groceryImg, 0, 0, canvas.width, canvas.height);

  let hth = canvas.height / groceryImg.height

  // Set the stroke style and line width
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  // Loop through the objects in the JSON and draw the rectangles and labels on the canvas

  for (const obj of jsonResponse) {
    // if a specific foodToHighlight wasn't provided, we WILL draw ALL foods on the canvas 
    // if detected food doesn't match foodToHighlight don't draw on canvas
    if (foodToHighlight && foodToHighlight != obj.object) {
      // go to next item in the loop aka DON'T DRAW
      continue
    }
    // Draw the rectangle on each item recognized by Azure
    const rect = obj.rectangle;
    ctx.strokeRect(rect.x * hth, rect.y * hth, rect.w * hth, rect.h * hth)

    // Draw the label
    const label = obj.object;
    ctx.fillStyle = 'red';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(label, rect.x * hth, rect.y * hth - 5);
  }
}


window.addEventListener('load', () => {
  drawCanvas()
  const imageHiddenInput = document.querySelector('#detectedFoodsWithBoxes')
  imageHiddenInput.value = canvas.toDataURL()
})

document.querySelector('#groceryTable').addEventListener('mouseover', (event) => {
  const row = event.target.closest('tr')
  // if row exists and has a querySelector then use the querySelector, otherwise returns 
  drawCanvas(row?.querySelector('#food')?.value)
})

