/**
 * Data Validation for Spreadsheet
 */

// Validate numeric input for cells
function validateNumericInput(cellId) {
    const content = activeSheetObject[cellId]?.content || '';
    if (isNaN(content)) {
        alert(`Invalid numeric value in cell ${cellId}.`);
        document.getElementById(cellId).style.border = '2px solid red';
        return false;
    }
    document.getElementById(cellId).style.border = ''; // Reset border
    return true;
}

// Validate date input for cells
function validateDateInput(cellId) {
    const content = activeSheetObject[cellId]?.content || '';
    const isValidDate = !isNaN(Date.parse(content));
    if (!isValidDate) {
        alert(`Invalid date value in cell ${cellId}. Use a valid date format (e.g., YYYY-MM-DD).`);
        document.getElementById(cellId).style.border = '2px solid red';
        return false;
    }
    document.getElementById(cellId).style.border = ''; // Reset border
    return true;
}

// Generic validator
function validateCellInput(cellId, type = 'text') {
    switch (type.toLowerCase()) {
        case 'number':
            return validateNumericInput(cellId);
        case 'date':
            return validateDateInput(cellId);
        default:
            return true; // Text doesn't need validation
    }
}

// Add validation rules to specific cells
function applyValidationRules() {
    // Define validation rules (Example: Cell A1 must be a number, A2 must be a date)
    const validationRules = {
        'A1': 'number',
        'A2': 'date'
    };

    // Apply validation on cell input
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.addEventListener('input', () => {
            const cellId = cell.id;
            const validationType = validationRules[cellId];
            if (validationType) {
                validateCellInput(cellId, validationType);
            }
        });
    });
}

// Highlight invalid entries
function highlightInvalidCells() {
    Object.keys(activeSheetObject).forEach(cellId => {
        const content = activeSheetObject[cellId]?.content || '';
        const cell = document.getElementById(cellId);

        // Check for empty cells
        if (!content.trim()) {
            cell.style.border = '2px solid orange';
        } else {
            cell.style.border = ''; // Reset border
        }
    });
}

// Call validation setup when the page loads
document.addEventListener('DOMContentLoaded', applyValidationRules);
