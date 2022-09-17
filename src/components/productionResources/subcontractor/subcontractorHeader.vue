<template>
  <header>
    <MpButton type="primary" @click="onClick">+添加外协工厂</MpButton>
    <SearchInputComp
      :word='props.condition.KeyWords'
      :changePropsFunc="props.setKeywords"
      :requestFunc='props.getList'
      :searchWatchKey="props.list"
      @reset='props.clearCondition'
      >
    </SearchInputComp>
  </header>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { SubcontractorListCondition } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorListCondition';

const props = defineProps<{
  condition: SubcontractorListCondition,
  setKeywords(words: string): void,
  clearCondition(): void,
  getList(): void,
  list: unknown[],
}>();

const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
</style>
