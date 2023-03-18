<template>
  <ul class="plate-redo-setup-list">
    <template v-for="it in ruleForm.RedoInfo.PlateList" :key="it.ID">
      <!-- 重做大版列表 -->
      <PlateRedoSetupItem :item="it" :PlateList="ruleForm.RedoInfo.PlateList" />
    </template>
  </ul>
</template>

<script lang="ts" setup>
import { HandleExceptionRuleForm } from '../../../js/HandleExceptionRuleForm';
import PlateRedoSetupItem from './PlateRedoSetupItem/PlateRedoSetupItem.vue';

defineProps<{
  ruleForm: HandleExceptionRuleForm
}>();

</script>
<style lang='scss' scoped>
.plate-redo-setup-list {
  > li {
    & + li {
      margin-top: 16px;
    }
  }
}
</style>
