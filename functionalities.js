/**
 * Formatting Functions
 */

// Set font family
function setFont(target) {
    if (activeCell) {
        const fontInput = target.value;
        activeSheetObject[activeCell.id].fontFamily_data = fontInput;
        activeCell.style.fontFamily = fontInput;
        activeCell.focus();
    }
}

// Set font size
function setSize(target) {
    if (activeCell) {
        const sizeInput = target.value;
        activeSheetObject[activeCell.id].fontSize_data = sizeInput;
        activeCell.style.fontSize = sizeInput + 'px';
        activeCell.focus();
    }
}

// Toggle bold
function toggleBold() {
    if (activeCell) {
        const isBold = !activeSheetObject[activeCell.id].isBold;
        activeSheetObject[activeCell.id].isBold = isBold;
        activeCell.style.fontWeight = isBold ? 'bold' : 'normal';
        activeCell.focus();
    }
}

// Toggle italic
function toggleItalic() {
    if (activeCell) {
        const isItalic = !activeSheetObject[activeCell.id].isItalic;
        activeSheetObject[activeCell.id].isItalic = isItalic;
        activeCell.style.fontStyle = isItalic ? 'italic' : 'normal';
        activeCell.focus();
    }
}

// Toggle underline
function toggleUnderline() {
    if (activeCell) {
        const isUnderlined = !activeSheetObject[activeCell.id].isUnderlined;
        activeSheetObject[activeCell.id].isUnderlined = isUnderlined;
        activeCell.style.textDecoration = isUnderlined ? 'underline' : 'none';
        activeCell.focus();
    }
}

// Set text color
function setTextColor(target) {
    if (activeCell) {
        const colorInput = target.value;
        activeSheetObject[activeCell.id].color = colorInput;
        activeCell.style.color = colorInput;
        activeCell.focus();
    }
}

// Set background color
function setBackgroundColor(target) {
    if (activeCell) {
        const colorInput = target.value;
        activeSheetObject[activeCell.id].backgroundColor = colorInput;
        activeCell.style.backgroundColor = colorInput;
        activeCell.focus();
    }
}

/**
 * Import/Export Functions
 */

// Export sheet data to JSON
function exportToJSON() {
    const jsonData = JSON.stringify(sheetsArray);
    const file = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'SheetData.json';
    link.click();
}

// Import sheet data from JSON
function importFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();

    input.addEventListener('change', () => {
        const fileReader = new FileReader();
        const file = input.files[0];

        fileReader.readAsText(file);
        fileReader.onload = () => {
            const importedData = JSON.parse(fileReader.result);
            importedData.forEach(sheetData => {
                document.querySelector('.new-sheet').click();
                sheetsArray[activeSheetIndex] = sheetData;
                activeSheetObject = sheetData;
                changeSheet();
            });
        };
    });
}

/**
 * Clipboard Operations
 */

// Copy cell content
function copyCell() {
    if (activeCell) {
        navigator.clipboard.writeText(activeCell.innerText).then(() => {
            console.log('Copied to clipboard');
        });
    }
}

// Cut cell content
function cutCell() {
    if (activeCell) {
        navigator.clipboard.writeText(activeCell.innerText).then(() => {
            activeCell.innerText = '';
            activeSheetObject[activeCell.id].content = '';
            console.log('Cut to clipboard');
        });
    }
}

// Paste content into cell
function pasteCell() {
    if (activeCell) {
        navigator.clipboard.readText().then(text => {
            activeCell.innerText = text;
            activeSheetObject[activeCell.id].content = text;
        });
    }
}

/**
 * Alignment Functions
 */

// Align cell content
function alignContent(alignment) {
    if (activeCell) {
        activeSheetObject[activeCell.id].textAlign = alignment;
        activeCell.style.textAlign = alignment;
        activeCell.focus();
    }
}

/**
 * Utility Functions
 */

// Reset functionality (clear styles and selection)
function resetFunctionality() {
    activeCell = null;
    document.querySelector('.address-bar').innerText = 'Null';
}

/**
 * Event Listeners for Buttons and Inputs
 */

document.querySelector('.bold').addEventListener('click', toggleBold);
document.querySelector('.italic').addEventListener('click', toggleItalic);
document.querySelector('.underline').addEventListener('click', toggleUnderline);
document.querySelector('.copy').addEventListener('click', copyCell);
document.querySelector('.cut').addEventListener('click', cutCell);
document.querySelector('.paste').addEventListener('click', pasteCell);
document.querySelector('.download').addEventListener('click', exportToJSON);
document.querySelector('.open').addEventListener('click', importFromJSON);

// Alignment buttons
document.querySelectorAll('.alignment').forEach(button => {
    button.addEventListener('click', event => {
        alignContent(event.target.className.split(' ')[0]);
    });
});
