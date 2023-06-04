const foodAddSubmitBtn = document.querySelector('.foodAddSubmit')

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
    } else if (i === 2) {
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
  deleteBtn.classList.add('btn')
  deleteBtn.classList.add('btn-secondary')
  deleteBtn.textContent = 'Delete item';
  deleteBtn.addEventListener('click', () => {
    newRow.remove();
  });
  const deleteTd = document.createElement('td');
  deleteTd.appendChild(deleteBtn);
  newRow.appendChild(deleteTd);
  tBody.appendChild(newRow);
});
