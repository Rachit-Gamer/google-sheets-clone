/**
 * Sheet Management and Rendering
 */

let sheetsArray = [];
let activeSheetIndex = -1;
let activeSheetObject = null;

/**
 * Create a new sheet
 */
function createNewSheet() {
    const newSheet = {};

    // Initialize cells for the sheet
    for (let row = 1; row <= 100; row++) {
        for (let col = 65; col <= 90; col++) {
            const cellId = String.fromCharCode(col) + row;
            newSheet[cellId] = { ...initialCellState };
        }
    }

    // Add to sheets array and set as active sheet
    sheetsArray.push(newSheet);
    activeSheetIndex = sheetsArray.length - 1;
    activeSheetObject = newSheet;

    // Add new sheet button in footer
    const sheetMenu = document.createElement('div');
    sheetMenu.className = 'sheet-menu';
    sheetMenu.id = `sheet-${sheetsArray.length}`;
    sheetMenu.innerText = `Sheet ${sheetsArray.length}`;
    sheetMenu.addEventListener('click', () => switchSheet(activeSheetIndex));
    document.querySelector('.footer').appendChild(sheetMenu);

    renderSheet();
}

/**
 * Switch to an existing sheet
 * @param {number} index - The index of the sheet to switch to
 */
function switchSheet(index) {
    if (index === activeSheetIndex) return;

    // Update active sheet
    activeSheetIndex = index;
    activeSheetObject = sheetsArray[index];

    // Update sheet menu styles
    document.querySelectorAll('.sheet-menu').forEach(menu => {
        menu.classList.remove('active-sheet');
    });
    document.getElementById(`sheet-${index + 1}`).classList.add('active-sheet');

    renderSheet();
}

/**
 * Render the active sheet
 */
function renderSheet() {
    // Reset all cells to reflect the active sheet state
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
 * Add event listener to "new sheet" button
 */
document.querySelector('.new-sheet').addEventListener('click', createNewSheet);

/**
 * Utility: Reset all active functionality
 */
function resetFunctionality() {
    activeCell = null;
    document.querySelector('.address-bar').innerText = 'Null';
    fontFamilyBtn.value = initialCellState.fontFamily_data;
    fontSizeBtn.value = initialCellState.fontSize_data;
    boldBtn.style.backgroundColor = '';
    italicBtn.style.backgroundColor = '';
    underlineBtn.style.backgroundColor = '';
    colorBtn.value = initialCellState.color;
    bgColorBtn.value = initialCellState.backgroundColor;
    formula.value = '';
}

/**
 * Initialize the first sheet on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    createNewSheet();
});
