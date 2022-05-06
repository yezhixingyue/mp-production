import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

const store = createPinia();
store.use(piniaPluginPersist); // 数据持久化

export default store;
