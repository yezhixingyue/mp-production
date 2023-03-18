<template>
  <div class="mp-production-client-view-wrap">
    <!-- 初始为空时的状态显示 -->
    <InitEmptyComp @set-equipment="onEquipmentSetupClick" v-if="!ManageClientPageData.loading && ManageClientPageData.TerminalEquipmentList.length === 0" />

    <!-- 设备展示内容 -->
    <EquipmentPageContent
      v-if="ManageClientPageData.TerminalEquipmentList.length > 0"
      @setEquipment="onEquipmentSetupClick"
     />

    <!-- 设置机器弹窗 -->
    <SetEquipmentDialog v-model:visible="setEquipmentVisible" />

    <!-- 回到顶部 -->
    <el-backtop target=".mp-production-client-view-wrap" :visibility-height="100" class="client-to-top" />
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { ManageClientPageData } from '@/api/client/clientStore';
import { ManageClientClass } from './assets/js/ManageClientClass';
import InitEmptyComp from './Comps/InitEmptyComp.vue';
import SetEquipmentDialog from './Comps/SetEquipmentDialog.vue';
import EquipmentPageContent from './Comps/EquipmentPageContent/EquipmentPageContent.vue';

/** 页面数据 */
ManageClientPageData.value = new ManageClientClass();

/** 设置机器相关 */
const setEquipmentVisible = ref(false);

const onEquipmentSetupClick = () => {
  setEquipmentVisible.value = true;
};

onMounted(() => {
  ManageClientPageData.value.getTerminalEquipmentList();
});
</script>
<style lang='scss' scoped>
.mp-production-client-view-wrap {
  height: 100%;
  background-color: #fff;
  overflow: auto;
  overflow: overlay;
}

@media screen and (min-width: 1400px) {
  .client-to-top {
    right: calc(50% - 675px) !important;
  }
}

.client-to-top {
  width: 50px;
  height: 50px;
  :deep(.el-icon) {
    font-size: 26px !important;
  }
}
</style>
