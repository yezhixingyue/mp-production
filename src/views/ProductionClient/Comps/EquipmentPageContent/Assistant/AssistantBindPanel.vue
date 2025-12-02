<template>
  <section class="assistant-bind-panel">
    <p class="err" v-if="!curInstance.NeedBindAssistantList" v-show="!curInstance.isAssistantDataLoading">
      <el-icon class="is-pink"><WarningFilled /></el-icon>
      <span>助手绑定数据获取异常，请刷新重试！</span>
    </p>

    <BindForm :curInstance="curInstance" v-else @submited="e => curInstance.handleAssistantBind(e)" />
  </section>
</template>

<script setup lang='ts'>
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import BindForm from './BindForm.vue';

defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
}>();
</script>

<style scoped lang='scss'>
.assistant-bind-panel {
  .err {
    font-size: 16px;
    text-align: center;
    color: #989898;
    margin-top: 20px;

    i {
      font-size: 28px;
      margin-right: 5px;
      vertical-align: -8px;
      opacity: 0.8;
    }
  }
}
</style>
