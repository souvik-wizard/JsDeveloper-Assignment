let chemicals = [];

// Fetch the JSON data from the external file
function loadChemicalData() {
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

// Function to render the table data
function loadTableData() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  chemicals.forEach((chemical, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
     <i class="fa-solid fa-check" style="font-size: 20px; padding:10px"></i>
      <td>${chemical.id}</td>
      <td>${chemical.chemicalName}</td>
      <td>${chemical.vendor}</td>
      <td>${chemical.density}</td>
      <td>${chemical.viscosity}</td>
      <td>${chemical.packaging}</td>
      <td>${chemical.packSize ? chemical.packSize : "N/A"}</td>
      <td>${chemical.unit}</td>
      <td>${chemical.quantity}</td>
    `;
    tableBody.appendChild(row);

    // Enable editing on cells
    Array.from(row.cells).forEach((cell) => {
      cell.setAttribute("contenteditable", true);
      cell.addEventListener("blur", (event) => {
        saveChanges(index, cell.cellIndex, cell.textContent);
      });
      cell.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent new line
          cell.blur(); // Save changes when Enter is pressed
        }
      });
    });
  });
}

// Function to save changes after editing
function saveChanges(rowIndex, cellIndex, newValue) {
  chemicals[rowIndex][Object.keys(chemicals[rowIndex])[cellIndex]] = newValue;
  console.log("Updated Data:", chemicals); // For debug purposes
}

// Sorting function for ascending/descending toggle
function sortTable(columnIndex) {
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
  rows.sort(comparer(columnIndex, !asc));
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
}

// Function to get the selected row index
function getSelectedRow() {
  const rows = document.querySelectorAll("#table-body tr");
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].classList.contains("selected")) {
      return i;
    }
  }
  return -1; // No row selected
}

// Button: Move selected row up
function moveRowUp() {
  const selectedRow = getSelectedRow();
  if (selectedRow > 0) {
    // Swap the selected row with the row above it
    const temp = chemicals[selectedRow];
    chemicals[selectedRow] = chemicals[selectedRow - 1];
    chemicals[selectedRow - 1] = temp;

    // Reload the table and keep the same row selected
    loadTableData();
    selectRow(selectedRow - 1); // Reapply the selection to the row that moved up
  }
}

// Button: Move selected row down
function moveRowDown() {
  const selectedRow = getSelectedRow();
  // Ensure a row is selected and that it's not already the last row
  if (selectedRow >= 0 && selectedRow < chemicals.length - 1) {
    // Swap the selected row with the row below it
    const temp = chemicals[selectedRow];
    chemicals[selectedRow] = chemicals[selectedRow + 1];
    chemicals[selectedRow + 1] = temp;

    // Reload the table and keep the same row selected
    loadTableData();
    selectRow(selectedRow + 1); // Reapply the selection to the row that moved down
  }
}

// Button: Delete selected row
function deleteRow() {
  const selectedRow = getSelectedRow();
  if (selectedRow !== -1) {
    chemicals.splice(selectedRow, 1);
    loadTableData();
  }
}

// Button: Refresh data (reload from JSON)
function refreshData() {
  loadChemicalData();
}

// Button: Save data (here, we're just logging it to the console as an example)
function saveData() {
  console.log("Saved Data:", chemicals); // In a real-world app, you would send the updated chemicals array to the backend.
}

// Get selected row index (can be replaced by selection logic)
function getSelectedRow() {
  const rows = Array.from(document.querySelectorAll("#table-body tr"));
  return rows.findIndex((row) => row.classList.contains("selected"));
}

// Handle row selection
document.getElementById("table-body").addEventListener("click", (event) => {
  const rows = document.querySelectorAll("#table-body tr");
  rows.forEach((row) => row.classList.remove("selected"));
  event.target.parentNode.classList.add("selected");
});

window.onload = loadChemicalData;
