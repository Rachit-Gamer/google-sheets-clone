const initialCellState = {
    fontFamily_data: 'monospace',
    fontSize_data: '14',
    isBold: false,
    isItalic: false,
    textAlign: 'start',
    isUnderlined: false,
    color: '#000000',
    backgroundColor: '#ffffff',
    content: ''
};

let sheetsArray = [];
let activeSheetIndex = -1;
let activeSheetObject = {};
let activeCell = false;
let dependencies = {}; // Tracks dependencies between cells
let selectedCells = [];

// Functionality elements
let fontFamilyBtn = document.querySelector('.font-family');
let fontSizeBtn = document.querySelector('.font-size');
let boldBtn = document.querySelector('.bold');
let italicBtn = document.querySelector('.italic');
let underlineBtn = document.querySelector('.underline');
let leftBtn = document.querySelector('.start');
let centerBtn = document.querySelector('.center');
let rightBtn = document.querySelector('.end');
let colorBtn = document.querySelector('#color');
let bgColorBtn = document.querySelector('#bgcolor');
let addressBar = document.querySelector('.address-bar');
let formula = document.querySelector('.formula-bar');
let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Grid header row element
let gridHeader = document.querySelector('.grid-header');

// Add header column
let bold = document.createElement('div');
bold.className = 'grid-header-col';
bold.innerText = 'SL. NO.';
gridHeader.append(bold);
for(let i = 65; i <= 90; i++){
    let bold = document.createElement('div');
    bold.className = 'grid-header-col';
    bold.innerText = String.fromCharCode(i);
    bold.id = String.fromCharCode(i);
    gridHeader.append(bold);
}

for(let i = 1; i <= 100; i++){
    let newRow = document.createElement('div');
    newRow.className = 'row';
    document.querySelector('.grid').append(newRow);

    let bold = document.createElement('div');
    bold.className = 'grid-cell';
    bold.innerText = i;
    bold.id = i;
    newRow.append(bold);

    for(let j = 65; j <= 90; j++){
        let cell = document.createElement('div');
        cell.className = 'grid-cell cell-focus';
        cell.id = String.fromCharCode(j) + i;
        cell.contentEditable = true;

        attachCellListeners(cell);
        newRow.append(cell);
    }
}

function cellFocus(event){
    let key = event.target.id;
    addressBar.innerHTML = event.target.id;
    activeCell = event.target;

    let activeBg = '#c9c8c8';
    let inactiveBg = '#ecf0f1';

    fontFamilyBtn.value = activeSheetObject[key].fontFamily_data;
    fontSizeBtn.value = activeSheetObject[key].fontSize_data;
    boldBtn.style.backgroundColor = activeSheetObject[key].isBold ? activeBg : inactiveBg;
    italicBtn.style.backgroundColor = activeSheetObject[key].isItalic ? activeBg : inactiveBg;
    underlineBtn.style.backgroundColor = activeSheetObject[key].isUnderlined ? activeBg : inactiveBg;
    setAlignmentBg(key, activeBg, inactiveBg);
    colorBtn.value = activeSheetObject[key].color;
    bgColorBtn.value = activeSheetObject[key].backgroundColor;

    formula.value = activeCell.innerText;

    document.getElementById(event.target.id.slice(0, 1)).classList.add('row-col-focus');
    document.getElementById(event.target.id.slice(1)).classList.add('row-col-focus');
}

function cellInput(){
    let key = activeCell.id;
    formula.value = activeCell.innerText;
    activeSheetObject[key].content = activeCell.innerText;
}

function setAlignmentBg(key, activeBg, inactiveBg){
    leftBtn.style.backgroundColor = inactiveBg;
    centerBtn.style.backgroundColor = inactiveBg;
    rightBtn.style.backgroundColor = inactiveBg;
    if(key){
        document.querySelector('.' + activeSheetObject[key].textAlign).style.backgroundColor = activeBg;
    } else {
        leftBtn.style.backgroundColor = activeBg;
    }
}

function cellFocusOut(event){
    document.getElementById(event.target.id.slice(0, 1)).classList.remove('row-col-focus');
    document.getElementById(event.target.id.slice(1)).classList.remove('row-col-focus');
}

function createGrid(rows = 100, columns = 26) {
    const gridContainer = document.querySelector('.grid');
    if (!gridContainer) {
        console.error("Grid container not found!");
        return;
    }

    // Clear any existing grid content
    gridContainer.innerHTML = '<div class="grid-header"></div>';

    // Create grid header for column names
    const gridHeader = gridContainer.querySelector('.grid-header');
    const rowHeader = document.createElement('div');
    rowHeader.className = 'grid-header-col';
    rowHeader.innerText = 'SL. NO.';
    gridHeader.append(rowHeader);

    for (let col = 0; col < columns; col++) {
        const columnHeader = document.createElement('div');
        columnHeader.className = 'grid-header-col';
        columnHeader.innerText = getColumnName(col + 1); // A-Z, then AA, AB, etc.
        gridHeader.append(columnHeader);
    }

    // Create rows with cells
    for (let row = 1; row <= rows; row++) {
        const newRow = document.createElement('div');
        newRow.className = 'row';

        // Row header
        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-cell';
        rowHeader.innerText = row;
        newRow.append(rowHeader);

        // Cells in the row
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell cell-focus';
            cell.id = `${getColumnName(col + 1)}${row}`;
            cell.contentEditable = true;

            attachCellListeners(cell); // Attach listeners for interactions
            newRow.append(cell);
        }

        gridContainer.append(newRow);
    }
    console.log("Grid created with rows and columns.");
}

function attachCellListeners(cell) {
    cell.addEventListener('click', (e) => {
        if (e.ctrlKey || e.metaKey) {
            // Add or remove cell from multi-selection
            if (selectedCells.includes(cell)) {
                cell.classList.remove('selected-cell');
                selectedCells = selectedCells.filter((c) => c !== cell);
            } else {
                cell.classList.add('selected-cell');
                selectedCells.push(cell);
            }
        } else {
            // Single selection (clear previous selection)
            clearSelection();
            cell.classList.add('selected-cell');
            selectedCells = [cell];
        }
        console.log("Selected Cells: ", selectedCells.map((c) => c.id)); // Debug log
    });

    cell.addEventListener('focus', cellFocus);
    cell.addEventListener('focusout', cellFocusOut);
    cell.addEventListener('input', cellInput);
}

function clearSelection() {
    selectedCells.forEach((cell) => cell.classList.remove('selected-cell'));
    selectedCells = [];
}


// Dependency management
function updateDependencies(cellId, formula) {
    for (let dep in dependencies) {
        dependencies[dep] = dependencies[dep].filter(id => id !== cellId);
    }

    const refs = formula.match(/[A-Z]+[0-9]+/g) || [];
    refs.forEach(ref => {
        if (!dependencies[ref]) dependencies[ref] = [];
        dependencies[ref].push(cellId);
    });
}

function recalculate(cellId) {
    const formula = activeSheetObject[cellId].content;

    // Check if the formula starts with "="
    if (!formula.startsWith('=')) {
        return; // Not a formula, do nothing
    }

    const refs = formula.match(/[A-Z]+[0-9]+/g) || [];
    let calculatedFormula = formula.slice(1); // Remove '=' for evaluation

    // Replace cell references with their values or default to 0
    refs.forEach(ref => {
        const value = parseFloat(activeSheetObject[ref]?.content) || 0; // Default to 0 if undefined or non-numeric
        calculatedFormula = calculatedFormula.replace(ref, value);
    });

    try {
        // Evaluate the formula
        const result = eval(calculatedFormula);
        activeSheetObject[cellId].content = result;
        document.getElementById(cellId).innerText = result;
    } catch (error) {
        console.error(`Error evaluating formula for ${cellId}:`, error);
        activeSheetObject[cellId].content = "ERROR";
        document.getElementById(cellId).innerText = "ERROR";
    }

    // Recalculate dependent cells
    if (dependencies[cellId]) {
        dependencies[cellId].forEach(recalculate);
    }
}



formula.addEventListener('input', (event) => {
    const formulaValue = event.target.value;
    activeSheetObject[activeCell.id].content = formulaValue;
    updateDependencies(activeCell.id, formulaValue);

    if (!formulaValue.startsWith('=')) {
        activeCell.innerText = formulaValue;
    } else {
        recalculate(activeCell.id);
    }
});

// Add row functionality
document.querySelector('.add-row').addEventListener('click', () => {
    const grid = document.querySelector('.grid');
    // Count only rows (excluding grid header)
    const rowCount = grid.querySelectorAll('.row').length + 1;

    const newRow = document.createElement('div');
    newRow.className = 'row';

    // Add row header
    const rowHeader = document.createElement('div');
    rowHeader.className = 'grid-cell';
    rowHeader.innerText = rowCount;
    newRow.append(rowHeader);

    // Add cells to the row
    for (let j = 65; j <= 90; j++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell cell-focus';
        cell.id = String.fromCharCode(j) + rowCount;
        cell.contentEditable = true;

        attachCellListeners(cell); // Attach event listeners
        newRow.append(cell);
    }

    grid.append(newRow);
    console.log(`Row ${rowCount} added.`);
});


// Add column functionality

document.querySelector('.add-column').addEventListener('click', () => {
    const gridHeader = document.querySelector('.grid-header');
    const currentColumnCount = gridHeader.childElementCount;

    // Generate the next column name
    const newColumnName = getColumnName(currentColumnCount + 1);

    // Add new column header
    const newHeader = document.createElement('div');
    newHeader.className = 'grid-header-col';
    newHeader.innerText = newColumnName;
    gridHeader.append(newHeader);

    // Add new cells to each row
    document.querySelectorAll('.row').forEach((row, index) => {
        const newCell = document.createElement('div');
        newCell.className = 'grid-cell cell-focus';
        newCell.id = `${newColumnName}${index + 1}`;
        newCell.contentEditable = true;

        attachCellListeners(newCell); // Attach event listeners
        row.append(newCell);
    });

    console.log(`Column ${newColumnName} added.`);
});

// Helper function to calculate column names
function getColumnName(index) {
    let columnName = '';
    while (index > 0) {
        const remainder = (index - 1) % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        index = Math.floor((index - 1) / 26);
    }
    return columnName;
}

for (let i = 1; i <= 100; i++) {
    console.log(`${i}: ${getColumnName(i)}`);
}

// Ensure attachCellListeners is defined
// (This function is already defined earlier in the code)
// Variables for tracking resizing
let isResizing = false;
let startWidth, startHeight, startX, startY, resizingRow, resizingColumn;

// Attach resizing listeners
// Attach resizing listeners
function attachResizeListeners() {
    document.querySelectorAll('.grid-header-col').forEach(header => {
        const resizer = document.createElement('div');
        resizer.className = 'col-resizer';
        header.appendChild(resizer);

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            resizingColumn = header;
            startWidth = header.offsetWidth;
        });
    });

    document.querySelectorAll('.row > .grid-cell:first-child').forEach(rowHeader => {
        const resizer = document.createElement('div');
        resizer.className = 'row-resizer';
        rowHeader.appendChild(resizer);

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            resizingRow = rowHeader.parentElement;
            startHeight = rowHeader.parentElement.offsetHeight;
        });
    });
}

// Event listeners for resizing
window.addEventListener('mousemove', (e) => {
    if (isResizing) {
        if (resizingColumn) {
            const newWidth = Math.max(startWidth + (e.clientX - startX), 30); // Minimum column width
            const columnIndex = Array.from(resizingColumn.parentElement.children).indexOf(resizingColumn);
            // Apply new width to all cells in the column
            document.querySelectorAll(`.row > .grid-cell:nth-child(${columnIndex + 1})`).forEach(cell => {
                cell.style.width = `${newWidth}px`;
            });
            resizingColumn.style.width = `${newWidth}px`;
        } else if (resizingRow) {
            const newHeight = Math.max(startHeight + (e.clientY - startY), 20); // Minimum row height
            resizingRow.style.height = `${newHeight}px`;
        }
    }
});

window.addEventListener('mouseup', () => {
    isResizing = false;
    resizingColumn = null;
    resizingRow = null;
});

const style = document.createElement('style');
style.innerHTML = `
    .col-resizer {
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        cursor: ew-resize;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .row-resizer {
        height: 5px;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        cursor: ns-resize;
        background-color: rgba(0, 0, 0, 0.1);
    }
    .grid-header-col {
        position: relative; /* Necessary for resizers to align correctly */
    }
    .row > .grid-cell:first-child {
        position: relative; /* Allow resizing of the first column */
    }
`;
document.head.appendChild(style);

// Drag-and-Drop Functionality
let draggedCell = null;
function attachDragListeners() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.draggable = true;

        cell.addEventListener('dragstart', (e) => {
            draggedCell = e.target;
            e.dataTransfer.setData('text/plain', draggedCell.innerText);
        });

        cell.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetCell = e.target;

            if (targetCell.classList.contains('grid-cell')) {
                const temp = targetCell.innerText;
                targetCell.innerText = draggedCell.innerText;
                draggedCell.innerText = temp;
            }
        });
    });
}

// Attach both resizing and dragging listeners after grid is loaded
function initializeGridInteractions() {
    attachResizeListeners();
    attachDragListeners();
}

// Save spreadsheet data to a file
function saveSpreadsheet() {
    const data = JSON.stringify(activeSheetObject); // Convert active sheet object to JSON
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spreadsheet.json';
    link.click();
    console.log("Spreadsheet saved.");
}

// Load spreadsheet data from a file
function loadSpreadsheet(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        activeSheetObject = data;
        renderLoadedSpreadsheet(); // Populate grid with loaded data
    };
    reader.readAsText(file);
}

// Render loaded data into the grid
function renderLoadedSpreadsheet() {
    for (const cellId in activeSheetObject) {
        const cellData = activeSheetObject[cellId];
        const cell = document.getElementById(cellId);

        if (cell) {
            cell.innerText = cellData.content;
            cell.style.fontFamily = cellData.fontFamily_data;
            cell.style.fontSize = `${cellData.fontSize_data}px`;
            cell.style.fontWeight = cellData.isBold ? 'bold' : 'normal';
            cell.style.fontStyle = cellData.isItalic ? 'italic' : 'normal';
            cell.style.textDecoration = cellData.isUnderlined ? 'underline' : 'none';
            cell.style.color = cellData.color;
            cell.style.backgroundColor = cellData.backgroundColor;
        }
    }
}

// Add event listeners for save/load buttons
downloadBtn.addEventListener('click', saveSpreadsheet);
openBtn.addEventListener('change', loadSpreadsheet);

document.querySelector('.open').addEventListener('click', () => {
    document.getElementById('file-upload').click();
});

document.getElementById('file-upload').addEventListener('change', loadSpreadsheet);

function generateChart() {
    const selectedData = getSelectedData(); // Extract selected cells
    if (!selectedData.length) {
        return;
    }

    const chartData = selectedData.map(cell => ({
        label: cell.id,
        value: parseFloat(cell.innerText) || 0
    }));

    renderChart(chartData);
}

function getSelectedData() {
    return selectedCells
        .filter(cell => !isNaN(parseFloat(cell.innerText))) // Filter only numeric values
        .map(cell => ({
            id: cell.id,
            value: parseFloat(cell.innerText) // Convert to number
        }));
}

function renderChart(data) {
    const chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        console.log("Chart container is missing!");
        return;
    }
    chartContainer.innerHTML = '<canvas id="chartCanvas"></canvas>';

    const ctx = document.getElementById('chartCanvas').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.id),
            datasets: [{
                label: 'Data Values',
                data: data.map(d => d.value),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Add a button to trigger chart generation
const chartBtn = document.createElement('button');
if (chartBtn) {
    chartBtn.addEventListener('click', generateChart);
    console.log("Generate Chart button initialized.");
} else {
    console.log("Generate Chart button not found in DOM.");
}
chartBtn.innerText = "Generate Chart";
chartBtn.className = "generate-chart-btn";
chartBtn.addEventListener('click', generateChart);

document.querySelector('.header').append(chartBtn);

console.log("Starting to create the grid...");
createGrid(100, 26); 
// Call this function after the grid is rendered
initializeGridInteractions();

function saveAllSheets() {
    const allSheetsData = sheetsArray.map(sheet => sheet.data);
    const blob = new Blob([JSON.stringify(allSheetsData)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'spreadsheet_sheets.json';
    link.click();
    console.log("All sheets saved.");
}

function loadAllSheets(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const allSheetsData = JSON.parse(e.target.result);
        sheetsArray = allSheetsData.map(data => ({ data }));
        console.log("All sheets loaded:", sheetsArray);

        // Render the first sheet by default
        activeSheetIndex = 0;
        activeSheetObject = sheetsArray[0].data;
        renderLoadedSpreadsheet();
    };
    reader.readAsText(file);
}

function renderLoadedSpreadsheet() {
    for (const cellId in activeSheetObject) {
        const cellData = activeSheetObject[cellId];
        const cell = document.getElementById(cellId);

        if (cell) {
            cell.innerText = cellData.content || '';
            cell.style.fontFamily = cellData.fontFamily_data;
            cell.style.fontSize = `${cellData.fontSize_data}px`;
            cell.style.color = cellData.color;
            cell.style.backgroundColor = cellData.backgroundColor;
        }
    }
    console.log("Sheet rendered.");
}

function validateCellInput(cell) {
    const value = cell.innerText;

    // Example validation: Ensure numeric values for specific columns
    if (cell.id.startsWith('A') && isNaN(value)) {
        alert(`Invalid input in cell ${cell.id}. Please enter a number.`);
        cell.innerText = '';
    }

    // Add other validation rules as needed
}
cell.addEventListener('input', () => {
    validateCellInput(cell);
});

