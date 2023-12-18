import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from '@/routes.js';
import App from './App.vue'
import store from "@/store/store.js";

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);

app.use(store);
app.use(router);
app.mount('#app');
