let chemicals = [];
let unsavedChanges = [];

// Fetch the JSON data from the external file or local storage
function loadChemicalData() {
  const storedData = localStorage.getItem("chemicals");
  if (storedData) {
    chemicals = JSON.parse(storedData);
    loadTableData();
  } else {
    fetch("chemicalData.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        chemicals = data;
        loadTableData();
      })
      .catch((error) => {
        console.error("Error fetching the JSON data:", error);
      });
  }
}

// Function to render the table data
function loadTableData() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  chemicals.forEach((chemical, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <i class="fa-solid fa-check" style="font-size: 20px; padding:10px"></i>
      <td>${chemical.id}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'chemicalName', this.innerText)">${chemical.chemicalName}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'vendor', this.innerText)">${chemical.vendor}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'density', this.innerText)">${chemical.density}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'viscosity', this.innerText)">${chemical.viscosity}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'packaging', this.innerText)">${chemical.packaging}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'packSize', this.innerText)">${chemical.packSize}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'unit', this.innerText)">${chemical.unit}</td>
      <td contenteditable="true" oninput="editCell(${index}, 'quantity', this.innerText)">${chemical.quantity}</td>
    `;
    tableBody.appendChild(row);
  });
}
// Function to save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("chemicals", JSON.stringify(chemicals));
}

// Function to save edits to chemicals array and localStorage
function editCell(rowIndex, field, newValue) {
  chemicals[rowIndex][field] = newValue;
  saveToLocalStorage();
}

// Sorting function for ascending/descending toggle, excluding the first column
function sortTable(columnIndex) {
  const dataColumnIndex = columnIndex + 1;

  const getCellValue = (tr, idx) =>
    tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) =>
    ((v1, v2) =>
      v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
        ? v1 - v2
        : v1.toString().localeCompare(v2))(
      getCellValue(asc ? a : b, idx),
      getCellValue(asc ? b : a, idx)
    );

  const tableBody = document.getElementById("table-body");
  let rows = Array.from(tableBody.querySelectorAll("tr"));

  const th = document.querySelectorAll("th")[columnIndex];
  const asc = th.getAttribute("data-order") === "asc";
  th.setAttribute("data-order", asc ? "desc" : "asc");

  rows.sort(comparer(dataColumnIndex, !asc));

  rows.forEach((tr) => tableBody.appendChild(tr));
}

// Add new row
function addRow() {
  const newRow = {
    id: chemicals.length + 1,
    chemicalName: "New Chemical",
    vendor: "Unknown Vendor",
    density: 0,
    viscosity: 0,
    packaging: "Unknown",
    packSize: 0,
    unit: "kg",
    quantity: 0,
  };
  chemicals.push(newRow);
  loadTableData();
  saveToLocalStorage();
}

//Delete selected row
function deleteRow() {
  const selectedRow = getSelectedRow();
  if (selectedRow !== -1) {
    chemicals.splice(selectedRow, 1);
    loadTableData();
    saveToLocalStorage();
  }
}

// Function to get the selected row index
function getSelectedRow() {
  const rows = Array.from(document.querySelectorAll("#table-body tr"));
  return rows.findIndex((row) => row.classList.contains("selected"));
}

// Function to programmatically select a row by index for moving up/down
function selectRow(index) {
  const rows = document.querySelectorAll("#table-body tr");
  if (rows[index]) {
    rows[index].classList.add("selected");
    rows[index].querySelector('input[type="checkbox"]').checked = true;
  }
}

//Move selected row up
function moveRowUp() {
  const selectedRow = getSelectedRow();
  if (selectedRow > 0) {
    [chemicals[selectedRow], chemicals[selectedRow - 1]] = [
      chemicals[selectedRow - 1],
      chemicals[selectedRow],
    ];
    loadTableData();
    selectRow(selectedRow - 1);
  }
}

// Move selected row down
function moveRowDown() {
  const selectedRow = getSelectedRow();
  if (selectedRow !== -1 && selectedRow < chemicals.length - 1) {
    [chemicals[selectedRow], chemicals[selectedRow + 1]] = [
      chemicals[selectedRow + 1],
      chemicals[selectedRow],
    ];
    loadTableData();
    selectRow(selectedRow + 1);
  }
}

// Function to handle row selection and toggle the icon color
document.getElementById("table-body").addEventListener("click", (event) => {
  const rows = document.querySelectorAll("#table-body tr");
  rows.forEach((row) => {
    row.classList.remove("selected");
    const icon = row.querySelector(".fa-check");
    if (icon) {
      icon.classList.remove("selected-icon");
      icon.classList.add("deselected-icon");
    }
  });

  const selectedRow = event.target.closest("tr");
  if (selectedRow) {
    selectedRow.classList.add("selected");
    const icon = selectedRow.querySelector(".fa-check");
    if (icon) {
      icon.classList.remove("deselected-icon");
      icon.classList.add("selected-icon");
    }
  }
});

// Refresh data (reload from localStorage)
function refreshData() {
  loadChemicalData();
}
// Function to save edits to unsavedChanges array
function editCell(rowIndex, field, newValue) {
  chemicals[rowIndex][field] = newValue;
  // Keeping track of changes
  unsavedChanges[rowIndex] = {
    ...chemicals[rowIndex],
    [field]: newValue,
  };
}

// Save data (save the unsaved changes to local storage)
function saveData() {
  if (unsavedChanges.length > 0) {
    unsavedChanges.forEach((change, index) => {
      chemicals[index] = change;
    });
    saveToLocalStorage();
    unsavedChanges = [];
  }
}

window.onload = loadChemicalData;
