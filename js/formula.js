/**
 * Formula Parsing and Evaluation
 */

// Dependency graph for tracking cell dependencies
const dependencyGraph = {}; // { cellId: [dependentCellIds] }

// Evaluate formulas entered into cells
function evaluateFormula(formula, currentCell = null) {
    if (!formula.startsWith('=')) return formula; // Not a formula

    try {
        // Remove '=' and extract function name and range
        const cleanedFormula = formula.slice(1);

        // Replace ranges or cell references with their evaluated values
        const parsedFormula = cleanedFormula.replace(/([A-Z]+\d+:[A-Z]+\d+|[A-Z]+\d+)/g, (match) => {
            const cells = match.includes(':') ? extractCells(...match.split(':'), currentCell) : [match];
            const values = cells.map(cellId => Number(activeSheetObject[cellId]?.content || 0));
            return values.length === 1 ? values[0] : `[${values.join(',')}]`;
        });

        // Evaluate the formula using JavaScript
        return eval(parsedFormula);
    } catch (error) {
        console.error(`Error evaluating formula "${formula}":`, error);
        return "Error";
    }
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

// Handle formula input in the formula bar
formula.addEventListener('input', (event) => {
    if (activeCell) {
        const formulaInput = event.target.value;
        activeSheetObject[activeCell.id].content = formulaInput;

        if (formulaInput.startsWith('=')) {
            // Update dependencies and evaluate formula
            updateDependencies(activeCell.id, formulaInput);
            const result = evaluateFormula(formulaInput, activeCell.id);
            activeCell.innerText = result;
        } else {
            // Direct content assignment for non-formula input
            activeCell.innerText = formulaInput;
        }

        // Update dependent cells
        updateDependentCells(activeCell.id);
    }
});
