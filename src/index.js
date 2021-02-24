let data = [
  {
    name: 'Iphone XR',
    cost: 60000,
  },
  {
    name: 'Samsung galaxy s10+',
    cost: 80000,
  },
  {
    name: 'Huawei View',
    cost: 50000,
  },
];

const itemsTable = document.getElementById('table');
const itemModal = document.getElementById('modal-window');
const itemNameField = document.getElementById('textName');
const itemCostField = document.getElementById('numberName');
const confirmDeleteModal = document.getElementById('confirmDelete');

let itemToEdit;
let itemToDelete;

function renderCell(row, content) {
  const cellElement = document.createElement('td');
  cellElement.classList.add('renderCell');
  cellElement.textContent = content;
  row.appendChild(cellElement);
  return cellElement;
}

function renderItem(item, idx) {
  const { name, cost } = item;

  const dataRow = document.createElement('tr');
  dataRow.setAttribute('data-id', idx);
  renderCell(dataRow, name);
  renderCell(dataRow, cost);

  const editButton = renderCell(dataRow, '✎');
  editButton.classList.add('editIcons');
  editButton.onclick = function () {
    itemModal.classList.remove('disabled');
    itemNameField.value = name;
    itemCostField.value = cost;
    itemToEdit = item;
  };

  const removeButton = renderCell(dataRow, '✖');
  removeButton.classList.add('removeAction');
  removeButton.onclick = function () {
    itemToDelete = item;
    confirmDeleteModal.classList.remove('disabled');
  };

  return dataRow;
}

function renderTable() {
  itemsTable.replaceChildren();

  const headerRow = document.createElement('tr');
  renderCell(headerRow, 'name');
  renderCell(headerRow, 'cost');
  renderCell(headerRow, 'actions');
  itemsTable.appendChild(headerRow);

  for (let i = 0; i < data.length; i += 1) {
    const dataRow = renderItem(data[i], i);
    itemsTable.appendChild(dataRow);
  }
}
renderTable();

document.getElementById('itemForm').onsubmit = function (e) {
  if (itemToEdit) {
    itemToEdit.name = itemNameField.value;
    itemToEdit.cost = Number(itemCostField.value);
  } else {
    data.push({ name: itemNameField.value, cost: Number(itemCostField.value) });
  }

  itemModal.classList.add('disabled');
  renderTable();
  e.preventDefault();
};

document.getElementById('cancel').onclick = function () {
  itemModal.classList.add('disabled');
};

document.getElementById('agreeDelete').onclick = function () {
  confirmDeleteModal.classList.add('disabled');
  data = data.filter((existingItem) => existingItem !== itemToDelete);
  renderTable();
};

document.getElementById('cancelDelete').onclick = function () {
  confirmDeleteModal.classList.add('disabled');
};

document.getElementById('addCart').addEventListener('click', () => {
  itemModal.classList.remove('disabled');
  itemNameField.value = '';
  itemCostField.value = '';
  itemToEdit = null;
});
