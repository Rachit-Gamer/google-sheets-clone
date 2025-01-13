/**
 * Spreadsheet Initialization
 */

// Initial state for each cell
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
let activeSheetObject = null;
let activeCell = null;

// DOM references for toolbar and formula bar
const fontFamilyBtn = document.querySelector('.font-family');
const fontSizeBtn = document.querySelector('.font-size');
const boldBtn = document.querySelector('.bold');
const italicBtn = document.querySelector('.italic');
const underlineBtn = document.querySelector('.underline');
const colorBtn = document.querySelector('#color');
const bgColorBtn = document.querySelector('#bgcolor');
const addressBar = document.querySelector('.address-bar');
const formula = document.querySelector('.formula-bar');

/**
 * Grid and Sheet Rendering
 */

// Initialize the grid and headers
function initializeGrid() {
    const gridHeader = document.querySelector('.grid-header');

    // Add column headers (A-Z)
    for (let col = 65; col <= 90; col++) {
        const columnHeader = document.createElement('div');
        columnHeader.className = 'grid-header-col';
        columnHeader.innerText = String.fromCharCode(col);
        gridHeader.appendChild(columnHeader);
    }

    const grid = document.querySelector('.grid');
    for (let row = 1; row <= 100; row++) {
        const newRow = document.createElement('div');
        newRow.className = 'row';

        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-cell';
        rowHeader.innerText = row;
        newRow.appendChild(rowHeader);

        for (let col = 65; col <= 90; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.id = String.fromCharCode(col) + row;
            cell.contentEditable = true;
            newRow.appendChild(cell);
        }

        grid.appendChild(newRow);
    }
}

document.addEventListener('DOMContentLoaded', initializeGrid);


// Cell focus event
function cellFocus(event) {
    const cellId = event.target.id;
    addressBar.innerText = cellId;
    activeCell = event.target;

    // Apply stored styles to the toolbar
    const cellState = activeSheetObject[cellId];
    fontFamilyBtn.value = cellState.fontFamily_data;
    fontSizeBtn.value = cellState.fontSize_data;
    boldBtn.style.backgroundColor = cellState.isBold ? '#c9c8c8' : '#ecf0f1';
    italicBtn.style.backgroundColor = cellState.isItalic ? '#c9c8c8' : '#ecf0f1';
    underlineBtn.style.backgroundColor = cellState.isUnderlined ? '#c9c8c8' : '#ecf0f1';
    colorBtn.value = cellState.color;
    bgColorBtn.value = cellState.backgroundColor;
    formula.value = cellState.content;
}

// Cell input event
function cellInput() {
    const cellId = activeCell.id;
    const content = activeCell.innerText;
    activeSheetObject[cellId].content = content;

    // Update dependent cells
    updateDependentCells(cellId);
}

// Cell focus out event
function cellFocusOut(event) {
    document.getElementById(event.target.id.slice(0, 1)).classList.remove('row-col-focus');
}

/**
 * Sheet Management
 */

// Create a new sheet
function createNewSheet() {
    const newSheet = {};
    for (let row = 1; row <= 100; row++) {
        for (let col = 65; col <= 90; col++) {
            const cellId = String.fromCharCode(col) + row;
            newSheet[cellId] = { ...initialCellState };
        }
    }

    sheetsArray.push(newSheet);
    activeSheetIndex = sheetsArray.length - 1;
    activeSheetObject = newSheet;

    // Add new sheet button in footer
    const sheetMenu = document.createElement('div');
    sheetMenu.className = 'sheet-menu';
    sheetMenu.innerText = `Sheet ${sheetsArray.length}`;
    sheetMenu.addEventListener('click', () => switchSheet(sheetsArray.length - 1));
    document.querySelector('.footer').appendChild(sheetMenu);

    renderSheet();
}

// Switch to an existing sheet
function switchSheet(index) {
    activeSheetIndex = index;
    activeSheetObject = sheetsArray[index];
    renderSheet();
}

// Render the active sheet
function renderSheet() {
    Object.keys(activeSheetObject).forEach(cellId => {
        const cell = document.getElementById(cellId);
        const cellState = activeSheetObject[cellId];
        cell.innerText = cellState.content;
        cell.style.fontFamily = cellState.fontFamily_data;
        cell.style.fontSize = `${cellState.fontSize_data}px`;
        cell.style.fontWeight = cellState.isBold ? 'bold' : 'normal';
        cell.style.fontStyle = cellState.isItalic ? 'italic' : 'normal';
        cell.style.textDecoration = cellState.isUnderlined ? 'underline' : 'none';
        cell.style.textAlign = cellState.textAlign;
        cell.style.color = cellState.color;
        cell.style.backgroundColor = cellState.backgroundColor;
    });
}

/**
 * Initialization
 */

// Initialize the first sheet and grid
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    createNewSheet();
});
