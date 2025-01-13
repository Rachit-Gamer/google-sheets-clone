/**
 * Chart Rendering with Chart.js
 */

// Create a chart
function createChart(data, labels, type = 'bar') {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.style.position = 'relative';
    chartContainer.style.margin = '20px auto';
    chartContainer.style.width = '80%';
    chartContainer.style.height = '400px';

    const canvas = document.createElement('canvas');
    chartContainer.appendChild(canvas);

    document.body.appendChild(chartContainer);

    new Chart(canvas, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: 'Spreadsheet Data',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate chart from selected cells
function generateChart(chartType = 'bar') {
    const selectedCells = document.querySelectorAll('.cell-focus');
    const data = [];
    const labels = [];

    if (selectedCells.length === 0) {
        alert('Please select cells to visualize data.');
        return;
    }

    selectedCells.forEach(cell => {
        const content = parseFloat(activeSheetObject[cell.id]?.content || '0');
        data.push(isNaN(content) ? 0 : content); // Handle non-numeric values gracefully
        labels.push(cell.id);
    });

    createChart(data, labels, chartType);
}

// Function to add chart options in the UI
function addChartOptions() {
    const chartOptionsContainer = document.createElement('div');
    chartOptionsContainer.className = 'chart-options';
    chartOptionsContainer.style.margin = '20px';
    chartOptionsContainer.style.display = 'flex';
    chartOptionsContainer.style.gap = '10px';

    const chartTypes = ['bar', 'line', 'pie', 'doughnut'];
    chartTypes.forEach(type => {
        const button = document.createElement('button');
        button.innerText = `Create ${type} chart`;
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => generateChart(type));
        chartOptionsContainer.appendChild(button);
    });

    document.body.insertBefore(chartOptionsContainer, document.querySelector('.grid'));
}

// Add chart options when the page loads
document.addEventListener('DOMContentLoaded', addChartOptions);
