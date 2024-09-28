## Chemical Supplies Table
This project is a web application that manages a list of chemical supplies in a table format. It allows users to add, edit, move a row up and down, delete, and sort chemical records. The application supports mobile responsiveness, with scrolling functionality for the table on smaller screens (mobile).

### Features
- Add, Edit, Delete Rows: Users can add new chemical supplies, edit existing data, and delete rows.
- Sorting: Click on table headers to sort columns in ascending or descending order (Alphabetically or Numerically).
- The user can move a row up or down as per need.
- Local Storage Support: Changes made to the table are saved to local storage.
- Toolbar with Icons: Toolbar buttons for adding, moving, deleting, refreshing, and saving rows.
- Mobile-Friendly/Responsiveness: Table content scrolls horizontally on mobile devices.
- Persistent Edits: Edited data is automatically saved to local storage and retrieved on page load (until the user clears the local storage).

**Project Structure**
```bash
/project-root
├── index.html          # Main HTML file containing the table and toolbar layout
├── styles.css          # Custom CSS for styling the table and making it responsive
├── script.js           # JavaScript file to manage table actions
├── chemicalData.json   # Example JSON data to preload if no data is found in local storage
```
How to Run the Project
Clone the Repository

```bash
git clone https://github.com/souvik-wizard/JsDeveloper-Assignment.git
cd JsDeveloper-Assignment
```
Open index.html in a Web Browser: Simply double-click the index.html file to launch the application in your default browser. (Or you can use live server extension for VS Code)

### Edit Table Data:

Click on the table cells to edit the content directly.
Changes are automatically saved to localStorage after editing.
Use the Toolbar:

Add Row: Adds a new chemical entry with default values.
Move Row Up/Down: Moves the selected row up or down.
Delete Row: Deletes the currently selected row.
Refresh Data: Reloads data from localStorage (or from chemicalData.json if no local data is available).
Save Data: Manually saves any unsaved changes.

### Dependencies
Font Awesome: Used for toolbar icons. Included via CDN in the HTML file.

## Screenshots

![image](https://github.com/user-attachments/assets/61f8ee5c-b368-42f1-ba52-d7406bb9a77a)

![Mobile sss](https://github.com/user-attachments/assets/4138b040-4744-4d24-aa69-72cb5a170188)
