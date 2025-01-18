// functionalities.js

function setFont(target) {
    if (activeCell) {
        let fontInput = target.value;
        activeSheetObject[activeCell.id].fontFamily_data = fontInput;
        activeCell.style.fontFamily = fontInput;
        activeCell.focus();
    }
}

function setSize(target) {
    if (activeCell) {
        let sizeInput = target.value;
        activeSheetObject[activeCell.id].fontSize_data = sizeInput;
        activeCell.style.fontSize = sizeInput + 'px';
        activeCell.focus();
    }
}

// Mathematical Functions
function applyFunction(range, operation) {
    let values = range.map(cellId => {
        const cell = document.getElementById(cellId);
        const value = cell ? parseFloat(cell.innerText) : null;
        return !isNaN(value) ? value : null;  
    }).filter(value => value !== null);

    if (values.length === 0) return null;

    switch (operation) {
        case "SUM":
            return values.reduce((a, b) => a + b, 0);
        case "AVERAGE":
            return values.reduce((a, b) => a + b, 0) / values.length;
        case "MAX":
            return Math.max(...values);
        case "MIN":
            return Math.min(...values);
        case "COUNT":
            return values.length;
        default:
            return null;
    }
}

// Data Quality Functions
function upperCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.innerText = cell.innerText.toUpperCase(); // Convert content to uppercase
        activeSheetObject[cellId].content = cell.innerText; // Update the data model
    }
}

function lowerCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.innerText = cell.innerText.toLowerCase(); // Convert content to lowercase
        activeSheetObject[cellId].content = cell.innerText; // Update the data model
    }
}

function trimCell(cellId) {
    const cell = document.getElementById(cellId);
    if (cell) {
        cell.innerText = cell.innerText.trim(); // Trim leading/trailing spaces
        activeSheetObject[cellId].content = cell.innerText; // Update the data model
    }
}


function removeDuplicates(range) {
    let uniqueRows = new Set();
    range.forEach(cellId => {
        let rowIndex = cellId.match(/\d+/)[0];
        if (!uniqueRows.has(rowIndex)) {
            uniqueRows.add(rowIndex);
        } else {
            let row = document.querySelectorAll(`[id$='${rowIndex}']`);
            row.forEach(cell => cell.innerText = '');
        }
    });
}

function findAndReplace(range, findText, replaceText) {
    range.forEach(cellId => {
        const cell = document.getElementById(cellId);
        if (cell && cell.innerText.includes(findText)) {
            cell.innerText = cell.innerText.replace(new RegExp(findText, "g"), replaceText);
            activeSheetObject[cellId].content = cell.innerText;
        }
    });
}

// Formula Evaluation
function evaluateFormula(input) {
    if (!input.startsWith('=')) return input; // Not a formula, return as-is

    const formula = input.slice(1).trim(); // Remove '=' and any spaces

    // Recognize and handle specific functions
    if (formula.startsWith('upperCell')) {
        const match = formula.match(/upperCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            upperCell(match[1]); // Execute the function
            return document.getElementById(match[1]).innerText; // Return the updated cell content
        }
    }

    if (formula.startsWith('lowerCell')) {
        const match = formula.match(/lowerCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            lowerCell(match[1]);
            return document.getElementById(match[1]).innerText;
        }
    }

    if (formula.startsWith('trimCell')) {
        const match = formula.match(/trimCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            trimCell(match[1]);
            return document.getElementById(match[1]).innerText;
        }
    }

    return 'Invalid Formula'; // Default if no valid formula matches
}


function parseRange(rangeStr) {
    const [start, end] = rangeStr.split(':');
    const [startCol, startRow] = [start[0], parseInt(start.slice(1))];
    const [endCol, endRow] = [end[0], parseInt(end.slice(1))];

    const range = [];
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
            range.push(String.fromCharCode(col) + row);
        }
    }
    return range;
}

// Update Formula Bar Logic
formula.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (activeCell) {
            const result = evaluateFormula(formula.value);
            if (result.startsWith('chart(')) {
                const match = result.match(/chart\((.*?)\)/);
                if (match && match[1]) {
                    const [type, rangeStr] = match[1].split(',');
                    const range = parseRange(rangeStr.trim());
                    generateChart(type.trim(), range);
                }
            }
            activeCell.innerText = result;
            activeSheetObject[activeCell.id].content = result;

            activeSheetObject[activeCell.id].formula = formula.value;

            activeCell.focus();
        }
        event.preventDefault();
    }
});

// Sync Formula Bar on Cell Focus
function cellFocus(event) {
    activeCell = event.target;
    formula.value = activeSheetObject[activeCell.id]?.formula || activeSheetObject[activeCell.id]?.content || '';
    addressBar.innerHTML = activeCell.id;
}

document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.addEventListener('focus', cellFocus);
});

// Clipboard Operations
boldBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleBold();
});

function toggleBold() {
    if (activeCell) {
        if (!activeSheetObject[activeCell.id].isBold) {
            activeCell.style.fontWeight = '600';
        } else {
            activeCell.style.fontWeight = '400';
        }
        activeSheetObject[activeCell.id].isBold = !activeSheetObject[activeCell.id].isBold;
        activeCell.focus();
    }
}

italicBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleItalic();
});

function toggleItalic() {
    if (activeCell) {
        if (!activeSheetObject[activeCell.id].isItalic) {
            activeCell.style.fontStyle = 'italic';
        } else {
            activeCell.style.fontStyle = 'normal';
        }
        activeSheetObject[activeCell.id].isItalic = !activeSheetObject[activeCell.id].isItalic;
        activeCell.focus();
    }
}

underlineBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleUnderline();
});

function toggleUnderline() {
    if (activeCell) {
        if (!activeSheetObject[activeCell.id].isUnderlined) {
            activeCell.style.textDecoration = 'underline';
        } else {
            activeCell.style.textDecoration = 'none';
        }
        activeSheetObject[activeCell.id].isUnderlined = !activeSheetObject[activeCell.id].isUnderlined;
        activeCell.focus();
    }
}

document.querySelectorAll('.color-prop').forEach(e => {
    e.addEventListener('click', (event) => event.stopPropagation());
});

function textColor(target) {
    if (activeCell) {
        let colorInput = target.value;
        activeSheetObject[activeCell.id].color = colorInput;
        activeCell.style.color = colorInput;
        activeCell.focus();
    }
}

function backgroundColor(target) {
    if (activeCell) {
        let colorInput = target.value;
        activeSheetObject[activeCell.id].backgroundColor = colorInput;
        activeCell.style.backgroundColor = colorInput;
        activeCell.focus();
    }
}

document.querySelectorAll('.alignment').forEach(e => {
    e.addEventListener('click', (event) => {
        event.stopPropagation();
        let align = e.className.split(' ')[0];
        alignment(align);
    });
});

function alignment(align) {
    if (activeCell) {
        activeCell.style.textAlign = align;
        activeSheetObject[activeCell.id].textAlign = align;
        activeCell.focus();
    }
}
