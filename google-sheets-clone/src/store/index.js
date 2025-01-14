import { createStore } from "vuex";

export default createStore({
  state: {
    sheets: [{}],
    activeSheetIndex: 0,
    gridData: {}, // Cell data
    rows: Array.from({ length: 100 }, (_, i) => i + 1), // 100 rows
    columns: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // A-Z columns
  },
  mutations: {
    ADD_SHEET(state) {
      state.sheets.push({}); // Add a new sheet
      state.activeSheetIndex = state.sheets.length - 1; // Switch to the new sheet
    },
    SWITCH_SHEET(state, index) {
      state.activeSheetIndex = index; // Set the active sheet index
      state.gridData = state.sheets[index] || {}; // Load the selected sheet's data
    },
    UPDATE_CELL(state, { cellId, content }) {
      if (!state.gridData[cellId]) {
        state.gridData[cellId] = {}; // Initialize cell data if not present
      }
      state.gridData[cellId].content = content; // Update cell content
    },
    SELECT_CELL(state, cellId) {
      if (!state.selectedCells.includes(cellId)) {
        state.selectedCells.push(cellId); // Add cell to the selection
      }
    },
    CLEAR_SELECTED_CELLS(state) {
      state.selectedCells = []; // Clear all selected cells
    },
  },
  actions: {
    addSheet({ commit }) {
      commit("ADD_SHEET");
    },
    switchSheet({ commit }, index) {
      commit("SWITCH_SHEET", index);
    },
    updateCell({ commit }, payload) {
      commit("UPDATE_CELL", payload);
    },
    selectCell({ commit }, cellId) {
      commit("SELECT_CELL", cellId);
    },
    clearSelectedCells({ commit }) {
      commit("CLEAR_SELECTED_CELLS");
    },
  },
  getters: {
    activeSheet(state) {
      return state.sheets[state.activeSheetIndex]; // Returns the active sheet
    },
    gridData(state) {
      return state.gridData; // Returns the current sheet's grid data
    },
    selectedCells(state) {
      return state.selectedCells.map((cellId) => ({
        id: cellId,
        value: parseFloat(state.gridData[cellId]?.content || 0), // Extract numeric values
      }));
    },
  },
});
