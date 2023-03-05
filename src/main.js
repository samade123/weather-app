import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Vue3TouchEvents from "vue3-touch-events";
import { vsSwitch } from 'vuesax3'

// import Vue plugin
import VueSvgInlinePlugin from "vue-svg-inline-plugin";

// import polyfills for IE if you want to support it
import "vue-svg-inline-plugin/src/polyfills";


import "vuesax3/dist/vuesax.css";
createApp(App).use(router).use(Vue3TouchEvents).use(vsSwitch).use(VueSvgInlinePlugin).mount('#app')


