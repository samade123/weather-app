import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import Vue3TouchEvents from "vue3-touch-events";
import { vsSwitch } from "vuesax3";

import Vue3Lottie from 'vue3-lottie'
createApp(App)
  .use(router)
  .use(Vue3TouchEvents)
  .use(vsSwitch)
  .use(Vue3Lottie)
  .mount("#app");
