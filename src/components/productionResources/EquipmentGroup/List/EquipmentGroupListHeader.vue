<template>
  <header class="header">
    <div class="left">
      <mp-button type="primary" @click="onClick">+添加设备组</mp-button>
      <div>
        <span class="title bold mr-10">设备分类：</span>
        <el-select v-model="ClassIDFilter"  class="mp-select">
          <el-option v-for="item in [{ ID: '', Name: '不限' }, ...EquipmentGroupData.EquipmentClassList]" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
    </div>
    <SearchInputComp
        :word='EquipmentGroupData.condition.KeyWords'
        title="关键词搜索"
        placeholder="请输入搜索关键词"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => setConditon([['KeyWords', ''], keywords])"
        :requestFunc='() => getList(1)'
        :searchWatchKey="EquipmentGroupData.DataList"
        @reset='clearCondition'
      />
  </header>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { computed } from 'vue';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>,
  getList:(Page: number) => void,
}>();

const emit = defineEmits(['add']);

const setConditon = (e) => props.EquipmentGroupData.setConditon(e);
const clearCondition = () => props.EquipmentGroupData.clearCondition();

const ClassIDFilter = computed({
  get() {
    return props.EquipmentGroupData.condition.ClassID;
  },
  set(val) {
    setConditon([['ClassID', ''], val]);
    props.getList(1);
  },
});

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;

    button {
      margin-right: 25px;
    }
  }
}
</style>
