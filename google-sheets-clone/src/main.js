import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import "./styles.css"; // Import global CSS

createApp(App).use(store).mount("#app");
