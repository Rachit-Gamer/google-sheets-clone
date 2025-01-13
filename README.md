# Google Sheets Clone

A feature-rich web-based spreadsheet application inspired by Google Sheets. This application provides a clean, interactive interface and supports advanced spreadsheet functionalities like formulas, formatting, data validation, and more.

---

## **Features**

### **Main Features**
- 🖋️ **Spreadsheet Interface**:
  - Dynamic grid creation with rows and columns.
  - Supports multiple sheets with seamless navigation.

- 📐 **Cell Formatting**:
  - Font family, size, bold, italic, underline.
  - Text alignment (left, center, right).
  - Text and background color customization.

- 🔢 **Mathematical Functions**:
  - Functions like `SUM`, `AVERAGE`, `COUNT`, `MAX`, and `MIN`.
  - Supports both individual cells and ranges (e.g., `A1:A10`).

- ✂️ **Clipboard Operations**:
  - Copy, cut, and paste functionality.

- 📂 **Import/Export**:
  - Save spreadsheet data as JSON.
  - Load spreadsheet data from JSON files.

- ⚙️ **Data Validation**:
  - Validates numeric, text, and date inputs.
  - Highlights invalid or empty cells.

### **Bonus Features**
- 📊 **Data Visualization**:
  - Integrates with Chart.js to create bar, line, and pie charts based on selected data.

- 🔗 **Advanced Formula Handling**:
  - Supports relative and absolute references (e.g., `A$1`, `$A1`, `$A$1`).
  - Handles nested formulas like `=SUM(A1:A10)*AVERAGE(B1:B5)`.

- 🔄 **Automatic Updates**:
  - Dynamically recalculates dependent cells when referenced cells change.
  - Prevents circular dependencies.

- ➕ **Dynamic Rows and Columns**:
  - Add and delete rows/columns dynamically.

---

## **Getting Started**

### **1. Prerequisites**
Ensure you have the following:
- A modern web browser (Chrome, Firefox, Edge, etc.).
- Basic knowledge of HTML, CSS, and JavaScript (optional for customization).

### **2. Installation**
1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-repo/google-sheets-clone.git

