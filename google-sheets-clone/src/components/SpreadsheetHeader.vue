<template>
  <div class="nav-bar">
    <div class="nav-content">
      <div class="nav-menu">File</div>
      <div class="nav-menu nav-active">Home</div>
      <div class="nav-menu">Insert</div>
      <div class="nav-menu">Layout</div>
      <div class="nav-menu">Help</div>
    </div>

    <div class="cell-styles">
      <span class="material-icons" @click="copyContent" title="Copy">content_copy</span>
      <span class="material-icons" @click="cutContent" title="Cut">content_cut</span>
      <span class="material-icons" @click="pasteContent" title="Paste">content_paste</span>

      <select class="font-family" v-model="fontFamily" @change="applyFontStyle">
        <option value="monospace">MonoSpace</option>
        <option value="sans-serif">Sans-serif</option>
        <option value="fantasy">Fantasy</option>
        <option value="cursive">Cursive</option>
      </select>

      <select class="font-size" v-model="fontSize" @change="applyFontStyle">
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
      </select>

      <span class="material-icons" @click="toggleBold">format_bold</span>
      <span class="material-icons" @click="toggleItalic">format_italic</span>
      <span class="material-icons" @click="toggleUnderline">format_underlined</span>
      <span class="material-icons">format_align_left</span>
      <span class="material-icons">format_align_center</span>
      <span class="material-icons">format_align_right</span>
      <span class="material-icons">format_align_justify</span>
    </div>

    <div class="active-cell-data">
      <b class="address-bar">{{ activeCell }}</b>
      <input
        type="text"
        class="formula-bar"
        v-model="formula"
        @keydown.enter="applyFormula"
        placeholder="Enter formula"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeCell: "Null", // Tracks the currently selected cell
      formula: "", // Tracks the formula input
      fontFamily: "monospace",
      fontSize: "14",
    };
  },
  methods: {
    copyContent() {
      console.log("Copy action triggered");
      // Implement logic for copying content
    },
    cutContent() {
      console.log("Cut action triggered");
      // Implement logic for cutting content
    },
    pasteContent() {
      console.log("Paste action triggered");
      // Implement logic for pasting content
    },
    applyFormula() {
      console.log(`Formula applied: ${this.formula}`);
      // Implement logic for applying the formula to the selected cell
    },
    applyFontStyle() {
      console.log(`Font Style: ${this.fontFamily}, Size: ${this.fontSize}`);
      // Implement logic for applying font style to the selected cell
    },
    toggleBold() {
      console.log("Bold toggled");
      // Implement logic for toggling bold on the selected cell
    },
    toggleItalic() {
      console.log("Italic toggled");
      // Implement logic for toggling italic on the selected cell
    },
    toggleUnderline() {
      console.log("Underline toggled");
      // Implement logic for toggling underline on the selected cell
    },
  },
};
</script>

<style scoped>
/* Styling for Header */
.nav-bar {
  background-color: #f4f4f4;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.nav-menu {
  display: inline-block;
  margin-right: 15px;
  cursor: pointer;
  font-weight: bold;
}

.nav-menu.nav-active {
  color: white;
  background-color: green;
  border-radius: 5px;
  padding: 5px 10px;
}

.cell-styles {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fafafa;
}

.cell-styles span {
  cursor: pointer;
  margin-right: 10px;
}

.formula-bar {
  width: calc(100% - 100px);
  padding: 5px;
  margin-left: 10px;
}

.active-cell-data {
  padding: 10px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
}

.address-bar {
  font-weight: bold;
}
</style>
