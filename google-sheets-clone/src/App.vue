<template>
  <div id="app">
    <!-- Header -->
    <SpreadsheetHeader />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Grid Component -->
      <SpreadsheetGrid />
    </div>
  </div>
</template>

<script>
import SpreadsheetHeader from "./components/SpreadsheetHeader.vue";
import SpreadsheetGrid from "./components/SpreadsheetGrid.vue";

export default {
  components: {
    SpreadsheetHeader,
    SpreadsheetGrid,
  },
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
