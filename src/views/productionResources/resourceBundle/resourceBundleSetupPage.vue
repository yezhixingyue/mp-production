<template>
  <section class="resource-bundle-setup-page-wrap">
    <header>
      <MpBreadcrumb :list="BreadcrumbList" />
      <p class="mp-common-title-wrap black">添加资源包</p>
    </header>
    <main>
      <resourceBundleSetupForm :curEditItem="curEditItem" ref="mainRef" />
    </main>
    <footer>
      <MpButton type="primary" class="gradient" @click="submit">保存</MpButton>
      <MpButton class="blue" @click="goback">返回</MpButton>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import resourceBundleSetupForm from '@/components/productionResources/resourceBundle/Setup/resourceBundleSetupForm.vue';
import MpButton from '@/components/common/MpButton.vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';
import { ResourceBundleClass } from './TypeClass/ResourceBundle';

const route = useRoute();
const store = useResourceStore();
const { resourceBundleList } = storeToRefs(store);

const BreadcrumbList = [
  { to: { path: '/resourceBundleManage' }, name: '物料资源包' },
  { name: '添加资源包' },
];

const curEditItem = ref<null|ResourceBundleClass>(null);
const inited = ref(false);

const mainRef = ref<InstanceType<typeof resourceBundleSetupForm>>();

if (route.params.id !== 'null') {
  const t = resourceBundleList.value.find(it => it.ID === route.params.id);
  if (t) {
    curEditItem.value = t;
  }
}

const goback = () => {
  getGoBackFun();
};

const submit = async () => {
  if (mainRef.value?.getFormData && inited.value) {
    const formData = await mainRef.value?.getFormData() as ResourceBundleClass | null;
    if (!formData) return;
    const isEdit = !!curEditItem.value;
    const resp = await api.getMaterialGroupSave(formData).catch(() => null);
    if (resp?.data?.isSuccess) {
      const title = isEdit ? '编辑成功' : '添加成功';
      const callback = () => {
        const temp: ResourceBundleClass = {
          ...formData,
          ID: resp.data.Data,
        };
        store.handleResourceBundleItemChange({ item: temp, isEdit, isRemove: false });
        goback();
      };
      MpMessage.success({ title, onOk: callback, onCancel: callback });
    }
  }
};

onMounted(() => {
  inited.value = true;
});

</script>

<script lang='ts'>
export default {
  name: 'resourceBundleSetupPage',
};
</script>

<style scoped lang='scss'>
.resource-bundle-setup-page-wrap {
  background-color: #fff;
  padding: 14px 20px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    flex: none;
    > p {
      margin-top: 36px;
      margin-left: 20px;
    }
    padding-bottom: 30px;
  }
  > main {
    flex: 1;
    overflow: hidden;
  }
  > footer {
    flex: none;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 25px;
    > .el-button {
      width: 120px;
      border-radius: 3px;
      height: 35px;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
