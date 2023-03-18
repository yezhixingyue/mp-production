<template>
  <section class="containner">
    <!-- 头部区域展示内容 -->
    <ContentHeader v-model:visible="stopVisible" @set-equipment="() => { emit('setEquipment'); }" />

    <!-- 当前任务组件 -->
    <template v-for="it in ManageClientPageData.InstanceList" :key="it.Equipment.ID">
      <CurTaskPanel v-show="curActiveInstance && curActiveInstance.Equipment.ID === it.Equipment.ID" :curInstance="it" />
    </template>

    <!-- 登录组件 -->
    <LoginComp v-if="curActiveInstance && !curActiveInstance.loginData.token" />

    <!-- 设置机器报停弹窗 -->
    <SetEquipmentStopDialog v-model:visible="stopVisible" />

    <!-- 悬浮球，显示当前未送达数量 -->
    <FloatingBall />
  </section>
</template>

<script setup lang='ts'>
import { ManageClientPageData } from '@/api/client/clientStore';
import { computed, ref } from 'vue';
import ContentHeader from './ContentHeader.vue';
import CurTaskPanel from './CurTaskPanel/CurTaskPanel.vue';
import LoginComp from './LoginComp.vue';
import SetEquipmentStopDialog from './SetEquipmentStopDialog.vue';
import FloatingBall from './FloatingBall/FloatingBall.vue';

const emit = defineEmits(['setEquipment']);

/** 设备报停 */
const stopVisible = ref(false);

/** 当前处于显示状态的设备实例 */
const curActiveInstance = computed(() => ManageClientPageData.value.curActiveInstance);

</script>

<style scoped lang='scss'>
.containner {
  width: 1260px;
  margin: 0 auto;
  position: relative;
}
</style>

<style lang='scss'>
.logout-msg-box {
  display: inline-block;
  text-align: left;
  margin: 0 auto;
  span {
    display: block;
  }
}
</style>
