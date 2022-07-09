import { createPinia } from 'pinia';
// import piniaPluginPersist from 'pinia-plugin-persist';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();
// store.use(piniaPluginPersist); // 数据持久化
store.use(piniaPluginPersistedstate); // 数据持久化 --- 更换插件

export default store;
