import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import api from './api';
import App from './App.vue';
import routerData from './router';
import store from './store';
import './assets/css/index.scss';
import './assets/css/el-table-reset.scss';

const app = createApp(App);
app.use(ElementPlus);
app.use(store).use(routerData.router).mount('#app');
app.config.globalProperties.api = api;
app.config.globalProperties.$goback = routerData.getGoBackFun;
