import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Vue3TouchEvents from "vue3-touch-events";
import { vsSwitch } from 'vuesax3'


import "vuesax3/dist/vuesax.css";
createApp(App).use(router).use(Vue3TouchEvents).use(vsSwitch).mount('#app')


