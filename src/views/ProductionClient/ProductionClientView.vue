<template>
  <div class="mp-production-client-view-wrap">
    <!-- 初始为空时的状态显示 -->
    <InitEmptyComp @set-equipment="onEquipmentSetupClick" v-if="!ManageClientPageData.loading && ManageClientPageData.TerminalEquipmentList.length === 0" />
    <!-- 设备展示列表 -->
    <EquipmentListComp
      v-if="ManageClientPageData.TerminalEquipmentList.length > 0"
      @setEquipment="onEquipmentSetupClick"
     />
    <!-- 设置机器弹窗 -->
    <SetEquipmentDialog v-model:visible="setEquipmentVisible" />
  </div>
</template>

<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import { ManageClientPageData } from '@/api/client/clientStore';
import { ManageClientClass } from './assets/js/ManageClientClass';
import InitEmptyComp from './Comps/InitEmptyComp.vue';
import SetEquipmentDialog from './Comps/SetEquipmentDialog.vue';
import EquipmentListComp from './Comps/EquipmentListComp/EquipmentListComp.vue';

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
}
</style>
