import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routers/routes";
import store from "./stores/auth";

const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
