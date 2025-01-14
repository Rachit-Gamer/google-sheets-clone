<template>
  <div class="grid">
    <!-- Grid Header -->
    <div class="grid-header">
      <div class="grid-header-cell">SL. NO.</div>
      <div v-for="col in columns" :key="col" class="grid-header-cell">{{ col }}</div>
    </div>

    <!-- Grid Rows -->
    <div v-for="row in rows" :key="row" class="grid-row">
      <div class="grid-cell row-number">{{ row }}</div>
      <div
        v-for="col in columns"
        :key="col + row"
        class="grid-cell"
        contenteditable="true"
        @input="updateCellContent(col + row, $event)"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rows: Array.from({ length: 10 }, (_, i) => i + 1), // 10 rows
      columns: Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)), // A-J columns
    };
  },
  methods: {
    updateCellContent(cellId, event) {
      const content = event.target.innerText;
      console.log(`Updated ${cellId}: ${content}`);
    },
  },
};
</script>

<style scoped>
/* Grid container */
.grid {
  display: grid;
  grid-template-columns: auto repeat(10, 1fr); /* 1 fixed column + 10 data columns */
  gap: 1px;
  background-color: #ddd;
  padding: 10px;
}

/* Header cells */
.grid-header {
  display: contents;
}

.grid-header-cell {
  background-color: #f3f3f3;
  text-align: center;
  font-weight: bold;
  border: 1px solid #ccc;
  padding: 8px;
}

/* Data rows and cells */
.grid-row {
  display: contents;
}

.grid-cell {
  background-color: white;
  text-align: left;
  border: 1px solid #ccc;
  padding: 8px;
}

.row-number {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center;
}
</style>
