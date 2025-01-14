<template>
  <div class="chart-container">
    <canvas id="chartCanvas"></canvas>
    <button @click="generateChart" class="generate-chart-btn">Generate Chart</button>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["selectedCells"]),
  },
  data() {
    return {
      chart: null,
    };
  },
  methods: {
    generateChart() {
      const labels = this.selectedCells.map((cell) => cell.id); // Cell IDs as labels
      const data = this.selectedCells.map((cell) => cell.value); // Cell values as data

      if (!labels.length || !data.length) {
        alert("Please select cells with numeric values to generate a chart!");
        return;
      }

      const ctx = document.getElementById("chartCanvas").getContext("2d");
      if (this.chart) this.chart.destroy(); // Clear the previous chart

      this.chart = new Chart(ctx, {
        type: "bar", // Change to 'line', 'pie', etc., if needed
        data: {
          labels,
          datasets: [
            {
              label: "Selected Cell Data",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
/* Chart container styling */
.chart-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #fafafa;
  text-align: center;
}

.generate-chart-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #36a2eb;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
