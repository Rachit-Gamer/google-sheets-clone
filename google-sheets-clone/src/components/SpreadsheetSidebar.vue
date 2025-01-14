<template>
  <div class="sidebar">
    <button class="add-sheet-btn" @click="addNewSheet">+ Add New Sheet</button>
    <div class="sheet-list">
      <div
        v-for="(sheet, index) in sheets"
        :key="index"
        class="sheet-item"
        :class="{ active: activeSheetIndex === index }"
        @click="switchSheet(index)"
      >
        Sheet {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["sheets", "activeSheetIndex"]),
  },
  methods: {
    ...mapActions(["addSheet", "switchSheet"]),
    addNewSheet() {
      this.addSheet(); // Add a new sheet via Vuex
    },
    switchSheet(index) {
      this.switchSheet(index); // Switch to the selected sheet
    },
  },
};
</script>

<style scoped>
/* Sidebar styling */
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 10px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
}

.add-sheet-btn {
  padding: 10px;
  background-color: #36a2eb;
  color: white;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.sheet-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sheet-item {
  padding: 8px;
  background-color: white;
  border: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
}

.sheet-item.active {
  background-color: #36a2eb;
  color: white;
  font-weight: bold;
}
</style>
