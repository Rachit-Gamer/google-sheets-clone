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
let activeSheetObject = false;
let activeCell = false;
let dependencies = {}; // Tracks dependencies between cells

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
    const fragment = document.createDocumentFragment();

    for (let i = 1; i <= rows; i++) {
        const newRow = document.createElement('div');
        newRow.className = 'row';

        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-cell';
        rowHeader.innerText = i;
        rowHeader.id = `row-${i}`;
        newRow.append(rowHeader);

        for (let j = 65; j < 65 + columns; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell cell-focus';
            cell.id = `${String.fromCharCode(j)}${i}`;
            cell.contentEditable = true;

            attachCellListeners(cell);
            newRow.append(cell);
        }

        fragment.append(newRow);
    }

    gridContainer.append(fragment);
}

function attachCellListeners(cell) {
    cell.addEventListener('click', (e) => e.stopPropagation());
    cell.addEventListener('focus', cellFocus);
    cell.addEventListener('focusout', cellFocusOut);
    cell.addEventListener('input', cellInput);

    // Prevent Enter key default behavior
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent line break
            formula.blur(); // Ensure the formula input is blurred
            recalculate(cell.id); // Trigger formula evaluation
        }
    });
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
function attachCellListeners(cell) {
    cell.addEventListener('click', (e) => e.stopPropagation());
    cell.addEventListener('focus', cellFocus);
    cell.addEventListener('focusout', cellFocusOut);
    cell.addEventListener('input', cellInput);
}


