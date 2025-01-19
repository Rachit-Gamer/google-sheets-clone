/**
 * Formula Parsing and Evaluation
 */

// Dependency graph for tracking cell dependencies
const dependencyGraph = {}; // { cellId: [dependentCellIds] }

// Evaluate formulas entered into cells
function evaluateFormula(input) {
    if (!input.startsWith('=')) return input; // Not a formula, return as-is

    const formula = input.slice(1).trim(); // Remove '=' and any leading/trailing spaces

    // Recognize and handle specific functions
    if (formula.startsWith('upperCell')) {
        const match = formula.match(/upperCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            upperCell(match[1]);
            return document.getElementById(match[1]).innerText; // Return updated cell value
        }
    }

    if (formula.startsWith('lowerCell')) {
        const match = formula.match(/lowerCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            lowerCell(match[1]);
            return document.getElementById(match[1]).innerText; // Return updated cell value
        }
    }

    if (formula.startsWith('trimCell')) {
        const match = formula.match(/trimCell\(['"]?(.*?)['"]?\)/);
        if (match && match[1]) {
            trimCell(match[1]);
            return document.getElementById(match[1]).innerText; // Return updated cell value
        }
    }

    // Add more custom function handlers here...

    return 'Invalid Formula';
}


// Extract cell IDs from a range (e.g., A1:B5)
function extractCells(startCell, endCell, currentCell = null) {
    const startRef = parseCellReference(startCell, currentCell);
    const endRef = parseCellReference(endCell, currentCell);

    const startCol = startRef.charCodeAt(0);
    const endCol = endRef.charCodeAt(0);
    const startRow = parseInt(startRef.slice(1));
    const endRow = parseInt(endRef.slice(1));

    const cells = [];
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            cells.push(String.fromCharCode(col) + row);
        }
    }
    return cells;
}

// Parse relative/absolute cell references
function parseCellReference(cellReference, currentCell) {
    if (!currentCell) return cellReference; // No relative reference needed

    const currentRow = parseInt(currentCell.slice(1));
    const currentCol = currentCell.charCodeAt(0);

    const absoluteCol = cellReference.startsWith('$');
    const absoluteRow = cellReference.includes('$', cellReference.indexOf('$') + 1);

    const col = absoluteCol ? cellReference.replace('$', '').charCodeAt(0) : currentCol;
    const row = absoluteRow ? parseInt(cellReference.replace(/[^0-9]/g, '')) : currentRow;

    return String.fromCharCode(col) + row;
}

/**
 * Dependency Management
 */

// Update dependencies when a formula is entered
function updateDependencies(cellId, formula) {
    const dependencies = (formula.match(/[A-Z]+\d+/g) || []);
    if (!dependencyGraph[cellId]) dependencyGraph[cellId] = [];

    // Remove old dependencies
    for (const key in dependencyGraph) {
        dependencyGraph[key] = dependencyGraph[key].filter(dep => dep !== cellId);
    }

    // Add new dependencies
    dependencies.forEach(dep => {
        if (!dependencyGraph[dep]) dependencyGraph[dep] = [];
        if (!dependencyGraph[dep].includes(cellId)) {
            if (hasCircularDependency(cellId, dep)) {
                alert("Circular Reference Detected!");
                throw new Error(`Circular dependency detected between ${cellId} and ${dep}`);
            }
            dependencyGraph[dep].push(cellId);
        }
    });
}

// Check for circular dependencies
function hasCircularDependency(startCell, targetCell) {
    if (!dependencyGraph[targetCell]) return false;
    if (dependencyGraph[targetCell].includes(startCell)) return true;

    return dependencyGraph[targetCell].some(dep => hasCircularDependency(startCell, dep));
}

// Recalculate dependent cells when a value changes
function updateDependentCells(cellId) {
    if (!dependencyGraph[cellId]) return;

    dependencyGraph[cellId].forEach(dep => {
        const formula = activeSheetObject[dep]?.content || '';
        if (formula.startsWith('=')) {
            const result = evaluateFormula(formula, dep);
            document.getElementById(dep).innerText = result;
            activeSheetObject[dep].content = result;
        }

        // Recursively update dependent cells
        updateDependentCells(dep);
    });
}

/**
 * Formula Input Event Handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure formula is defined
    let formula = document.querySelector('.formula-bar');

    if (formula) {
        formula.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                if (activeCell) {
                    const result = evaluateFormula(formula.value); // Process the formula
                    activeCell.innerText = result; // Update the cell with the result
                    activeSheetObject[activeCell.id].content = result; // Sync the data model
                }
                event.preventDefault(); // Prevent default Enter behavior
            }
        });
    }
});
