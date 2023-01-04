<template>
  <header>
    <EpCascaderByLevel2
      title="设备组"
      showLine
      :fiexdWidth="220"
      :First="condition.ClassID"
      :Second="condition.GroupID"
      :type-list="[['ClassID', ''], ['GroupID', '']]"
      :list="EquipmentClassAndGroupLevelList"
      @getList="() => getList()"
      @setCondition="(e) => condition.setConditon(e)"
    />
  </header>
</template>

<script setup lang='ts'>
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { Condition } from '../js/Condition';

defineProps<{
  condition: Condition
  EquipmentClassAndGroupLevelList: IListItemType[]
  getList:() => void
}>();

</script>

<style scoped lang='scss'>
</style>
