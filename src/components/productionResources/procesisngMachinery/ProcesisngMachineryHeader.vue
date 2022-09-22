<template>
  <header>
    <mp-button type="primary" @click="onClick">+添加加工设备</mp-button>
    <EpCascaderByLevel2
      title="设备组"
      showLine
      :fiexdWidth="180"
      :First="props.localEquipmentListClassData.condition.ClassID"
      :Second="props.localEquipmentListClassData.condition.GroupID"
      :type-list="[['ClassID', ''], ['GroupID', '']]"
      :list="props.localEquipmentListClassData.EquipmentClassAndGroupLevelList"
      @getList="(e) => props.localEquipmentListClassData.getList(e)"
      @setCondition="(e) => props.localEquipmentListClassData.condition.setConditon(e)"
    />
    <span class="title">状态：</span>
    <el-radio-group v-model="radio">
      <el-radio :label="''">不限</el-radio>
      <el-radio :label="true">正常</el-radio>
      <el-radio :label="false">已停用</el-radio>
    </el-radio-group>
  </header>
</template>

<script setup lang='ts'>
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import { EquipmentListClass } from '@/views/productionResources/procesisngMachinery/TypeClass/EquipmentListClass';
import { computed } from 'vue';

const props = defineProps<{
  localEquipmentListClassData: Required<EquipmentListClass>,
}>();

const emit = defineEmits(['add']);

const radio = computed({
  get() {
    return props.localEquipmentListClassData.condition.IsUseable;
  },
  set(val) {
    props.localEquipmentListClassData.condition.setConditon([['IsUseable', ''], val]);
    props.localEquipmentListClassData.getList();
  },
});

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
</style>
