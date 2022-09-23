<template>
  <section class="resource-bundle-list-page-wrap">
    <Header @add="onItemSetupClick" />
    <Main :list="resourceBundleList" :MaterialTypeGroup="MaterialTypeGroup" @edit="onItemSetupClick" @remove="handleRemove" />
    <Footer :condition="resourceBundleCondition" :total="resourceBundleListNumber" :getList="store.getResourceBundleList" />
  </section>
</template>

<script setup lang='ts'> // 物料资源包
import Header from '@/components/productionResources/resourceBundle/List/resourceBundleListHeader.vue';
import Main from '@/components/productionResources/resourceBundle/List/resourceBundleListMain.vue';
import Footer from '@/components/productionResources/resourceBundle/List/resourceBundleListFooter.vue';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ResourceBundleClass } from './TypeClass/ResourceBundle';

const router = useRouter();
const store = useResourceStore();

const {
  resourceBundleCondition, resourceBundleList, resourceBundleListNumber, MaterialTypeGroup,
} = storeToRefs(store);

const onItemSetupClick = (it: null | ResourceBundleClass) => {
  const id = it ? it.ID : 'null';
  router.push({ name: 'resourceBundleSetup', params: { id } });
};

const handleRemove = async (it: ResourceBundleClass) => {
  const resp = await api.getMaterialGroupRemove(it.ID).catch(() => null);
  if (resp?.data?.isSuccess) {
    const cb = () => {
      store.handleResourceBundleItemChange({ item: it, isEdit: false, isRemove: true });
    };

    MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
  }
};

onMounted(() => {
  store.getResourceBundleList();
  store.getMaterialTypeGroup();
});

</script>

<script lang='ts'>
export default {
  name: 'resourceBundleManagePage',
};
</script>

<style scoped lang='scss'>
.resource-bundle-list-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 70px;
    margin-bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    height: 50px;
  }

  > header, > footer {
    flex: none;
    display: flex;
    align-items: center;
  }
  > header, > footer, > main {
    background-color: #fff;
  }
}
</style>
