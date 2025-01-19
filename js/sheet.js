let sheetsArray = [];
let activeSheetIndex = -1;
let activeSheetObject = {};

document.addEventListener('DOMContentLoaded', () => {
    // Ensure initialCellState is defined
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

    const newSheetBtn = document.querySelector('.new-sheet');

    if (newSheetBtn) {
        newSheetBtn.addEventListener('click', () => {
            sheetsArray.push(createNewSheet());
            activeSheetIndex = sheetsArray.length - 1;
            activeSheetObject = sheetsArray[activeSheetIndex];
            renderLoadedSpreadsheet();
        });
    } else {
        console.error('.new-sheet button not found');
    }

    const addRowBtn = document.querySelector('.add-row');
    const addColumnBtn = document.querySelector('.add-column');
    const downloadBtn = document.querySelector('.download');
    const openBtn = document.querySelector('.open');

    if (addRowBtn) {
        addRowBtn.addEventListener('click', () => {
            console.log('Row added');
            // Add row functionality
        });
    } else {
        console.error('.add-row button not found');
    }

    if (addColumnBtn) {
        addColumnBtn.addEventListener('click', () => {
            console.log('Column added');
            // Add column functionality
        });
    } else {
        console.error('.add-column button not found');
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log('Downloading...');
            // Save functionality
        });
    } else {
        console.error('.download button not found');
    }

    if (openBtn) {
        openBtn.addEventListener('change', (e) => {
            console.log('File opened:', e.target.files);
            // Load functionality
        });
    } else {
        console.error('.open button not found');
    }
});

function createNewSheet() {
    const newSheet = {};
    for (let i = 1; i <= 100; i++) {
        for (let j = 65; j <= 90; j++) {
            const cellId = String.fromCharCode(j) + i;
            newSheet[cellId] = { 
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
        }
    }
    return newSheet;
}

function renderLoadedSpreadsheet() {
    for (const cellId in activeSheetObject) {
        const cellData = activeSheetObject[cellId];
        const cell = document.getElementById(cellId);

        if (cell) {
            cell.innerText = cellData.content || '';
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