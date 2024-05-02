import { createApp } from "vue";
import { AxiosStatic } from "axios";
import { MessageApi, NotificationApi, DialogApi } from "naive-ui";

import "./style.css";
import App from "./App.vue";
import naive from "naive-ui";
import { createDiscreteApi } from "naive-ui";

import { router } from "./common/router";
import { createPinia } from "pinia";
import axios, { InternalAxiosRequestConfig } from "axios";
import { AdminStore } from "./stores/AdminStore";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);

const app = createApp(App);
app.provide("axios", axios as AxiosStatic);
app.provide("message", message as MessageApi);
app.provide("notification", notification as NotificationApi);
app.provide("dialog", dialog as DialogApi);
app.provide("server_url", axios.defaults.baseURL as string);

app.use(naive);
app.use(createPinia());
app.use(router);

const adminStore = AdminStore();

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.headers) {
    config.headers.token = adminStore.token;
  }
  return config;
});
app.mount("#app");
