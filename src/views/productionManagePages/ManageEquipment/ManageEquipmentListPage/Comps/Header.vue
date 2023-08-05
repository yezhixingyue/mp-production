<template>
  <header class="header">
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
    <SearchInputComp
      :word='condition.KeyWords'
      title="关键词搜索"
      placeholder="请输入搜索关键词"
      resetWords="清空所有筛选条件"
      :changePropsFunc="(keywords: string) => condition.setConditon([['KeyWords', ''], keywords])"
      :requestFunc="() => getList()"
      :searchWatchKey="list"
      @reset='() => clearCondition()'
     />
  </header>
</template>

<script setup lang='ts'>
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { IListItemType } from '@/components/common/EpCascader/EpCascaderWrap/types';
import { Condition } from '../js/Condition';
import { IManageEquipmentInfo } from '../js/types';

defineProps<{
  condition: Condition
  EquipmentClassAndGroupLevelList: IListItemType[]
  getList:() => void
  clearCondition: () => void
  list: IManageEquipmentInfo[]
}>();

</script>

<style scoped lang='scss'>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px !important;
}
</style>
