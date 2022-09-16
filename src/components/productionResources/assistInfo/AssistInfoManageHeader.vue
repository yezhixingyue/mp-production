<script setup lang='ts'>
import { computed } from 'vue';
// import { getListByEnums, localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { localEnumValueIDType, getListByEnums } from '@/assets/js/utils/getListByEnums';

const props = defineProps<{
  modelValue: localEnumValueIDType
}>();

const emit = defineEmits(['update:modelValue', 'change', 'add']);

const radioMenus = getListByEnums(AssistInfoTypeEnums, { withNoLimit: true });

const radioValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('change');
  },
});

const onClick = () => {
  emit('add', null);
};

</script>

<template>
  <header>
    <el-button type="primary" @click="onClick">+添加辅助信息</el-button>
    <span class="bold ft-14 mr-13">筛选：</span>
    <el-radio-group v-model="radioValue">
      <el-radio class="ft-12" v-for="it in radioMenus" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
  </header>
</template>

<style scoped lang='scss'>
// deep
</style>
