import { createApp } from 'vue'

import App from './App.vue'
const app = createApp(App)


import router from './router'
// import axios from './request/userApi.js'
import './assets/main.css'
app.use(router)

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

import { createPinia } from 'pinia'
app.use(createPinia())

// app.config.globalProperties.$axios = axios;
app.mount('#app')
