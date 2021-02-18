import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/main.css'
// eslint-disable-next-line
// @ts-ignore
import VueApexCharts from "vue3-apexcharts";

createApp(App).use(router).use(ElementPlus).use(VueApexCharts).mount('#app')
