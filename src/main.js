import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive from 'naive-ui'
import {createDiscreteApi} from 'naive-ui'

import {router} from './common/router'
import { createPinia } from 'pinia'
import axios from 'axios'
import {AdminStore} from "./stores/AdminStore"

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])



const app = createApp(App)
app.provide("axios", axios) // provide 依赖注入
app.provide("message", message)
app.provide("notification", notification)
app.provide("dialog", dialog)
app.provide("server_url", axios.defaults.baseURL)


app.use(naive)
app.use(createPinia())
app.use(router)


const adminStore = AdminStore()

axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token
  return config
})
app.mount('#app')
