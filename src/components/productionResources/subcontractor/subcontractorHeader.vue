<template>
  <header>
    <div>
      <MpButton type="primary" @click="onClick" v-if="localPermission?.Setup">+添加外协工厂</MpButton>
    </div>
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
import { IUser } from '@/store/modules/user/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { SubcontractorListCondition } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorListCondition';

const props = defineProps<{
  condition: SubcontractorListCondition,
  setKeywords(words: string): void,
  clearCondition(): void,
  getList(): void,
  list: ISubcontractorFactoryListItemType[],
  localPermission?: IUser['PermissionList']['PermissionManageExternalFactory']['Obj']
}>();

const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
</style>
