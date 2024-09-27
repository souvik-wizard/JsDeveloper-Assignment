let chemicals = [];

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

// Function to save edits to chemicals array and localStorage
function editCell(rowIndex, field, newValue) {
  chemicals[rowIndex][field] = newValue;
  saveToLocalStorage();
}

// Function to save to localStorage
function saveToLocalStorage() {
  localStorage.setItem("chemicals", JSON.stringify(chemicals));
}

// Sorting function for ascending/descending toggle, excluding the first column
function sortTable(columnIndex) {
  // Adjust the column index to account for the first column (icon)
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

  // Apply sorting based on the dataColumnIndex (which skips the icon column)
  const th = document.querySelectorAll("th")[columnIndex];
  const asc = th.getAttribute("data-order") === "asc";
  th.setAttribute("data-order", asc ? "desc" : "asc");

  rows.sort(comparer(dataColumnIndex, !asc));

  rows.forEach((tr) => tableBody.appendChild(tr));
}

// Button: Add new row
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

// Button: Delete selected row
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

// Button: Move selected row up
function moveRowUp() {
  const selectedRow = getSelectedRow();
  if (selectedRow > 0) {
    // Swap the selected row with the one above it
    [chemicals[selectedRow], chemicals[selectedRow - 1]] = [
      chemicals[selectedRow - 1],
      chemicals[selectedRow],
    ];
    loadTableData();
    selectRow(selectedRow - 1); // Reapply the selection to the moved row
  }
}

// Button: Move selected row down
function moveRowDown() {
  const selectedRow = getSelectedRow();
  if (selectedRow !== -1 && selectedRow < chemicals.length - 1) {
    // Swap the selected row with the one below it
    [chemicals[selectedRow], chemicals[selectedRow + 1]] = [
      chemicals[selectedRow + 1],
      chemicals[selectedRow],
    ];
    loadTableData();
    selectRow(selectedRow + 1); // Reapply the selection to the moved row
  }
}

// Function to programmatically select a row by index
function selectRow(index) {
  const rows = document.querySelectorAll("#table-body tr");
  if (rows[index]) {
    rows[index].classList.add("selected");
    rows[index].querySelector('input[type="checkbox"]').checked = true; // Keep checkbox checked
  }
}

// Handle row selection
document.getElementById("table-body").addEventListener("click", (event) => {
  const rows = document.querySelectorAll("#table-body tr");
  rows.forEach((row) => row.classList.remove("selected"));
  event.target.parentNode.classList.add("selected");
});

// Button: Refresh data (reload from localStorage)
function refreshData() {
  loadChemicalData();
}

// Button: Save data (local storage is updated immediately when editing)
function saveData() {
  saveToLocalStorage();
}

window.onload = loadChemicalData;
