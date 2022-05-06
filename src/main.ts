import { createApp } from 'vue';
import api from './api';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/index.scss';

const app = createApp(App);
app.use(store).use(router).mount('#app');
app.config.globalProperties.api = api;
