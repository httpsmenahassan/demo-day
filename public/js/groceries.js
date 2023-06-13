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

document.querySelector('#container').replaceChild(canvas, groceryImg);

function drawCanvas(foodToHighlight) {
  const ctx = canvas.getContext('2d');

  let htw = groceryImg.height / groceryImg.width
  canvas.height = 800 * htw
  canvas.width = 800

  ctx.drawImage(groceryImg, 0, 0, canvas.width, canvas.height);

  let hth = canvas.height / groceryImg.height

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;


  for (const obj of jsonResponse) {
    if (foodToHighlight && foodToHighlight != obj.object) {
      continue
    }

    const rect = obj.rectangle;
    ctx.strokeRect(rect.x * hth, rect.y * hth, rect.w * hth, rect.h * hth)

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
  drawCanvas(row?.querySelector('#food')?.value)
})

