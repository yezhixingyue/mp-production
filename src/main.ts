import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './assets/css/element-variarbles.scss';
import print from 'vue3-print-nb';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import api from './api';
import './api/mock';
import App from './App.vue';
import { getGoBackFun, router } from './router';
import format from './assets/js/filters/dateFilters';
import store from './store';
import './assets/css/index.scss';
import './assets/css/el-table-reset.scss';
import MpButton from './components/common/MpButton.vue';
import MpInputNumber from './components/common/MpInputNumber.vue';
import MpTip from './components/common/MpTip.vue';
import MpEmpty from './components/common/ElementPlusContainners/MpEmpty.vue';
import MpTableColumn from './components/common/ElementPlusContainners/MpTableColumn.vue';

const app = createApp(App);

Object.keys(ElementPlusIconsVue).forEach(key => {
  const component = ElementPlusIconsVue[key];
  app.component(key, component);
});

app.component('MpButton', MpButton);
app.component('MpInputNumber', MpInputNumber);
app.component('MpTip', MpTip);
app.component('MpEmpty', MpEmpty);
app.component('MpTableColumn', MpTableColumn);

app.use(ElementPlus);
app.use(print);
app.use(store).use(router).mount('#app');
app.config.globalProperties.api = api;
app.config.globalProperties.$goback = getGoBackFun;
app.config.globalProperties.$format = format;
