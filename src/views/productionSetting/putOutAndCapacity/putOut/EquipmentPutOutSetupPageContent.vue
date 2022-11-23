<template>
  <section class="put-out-setup" v-if="rightPanelData">
    <ConstraintSetupPageComp
    leftWidth="800px"
    :PropertyList="props.PropertyList"
    :condition="props.curConditionRow" @submit="submit" showPriority>
      <template #header>
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      </template>
      <template #default>
        <div class="right-class">
          <p class="title">则申放为：</p>
          <p class="conent">
            <el-input v-model.number="rightPanelData.Value" maxlength="9"></el-input>
            <el-select v-model="rightPanelData.Type" class="m-2" placeholder="Select">
              <el-option label="张" :value="0"/>
              <el-option label="%" :value="1"/>
            </el-select>
          </p>
        </div>
      </template>
    </ConstraintSetupPageComp>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { ElInput, ElSelect, ElOption } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentListType } from '../js/types';
import { PutOutConditionItemClass } from '../js/PutOutConditionItemClass';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curConditionRow: null | TransformConstraintTableItemType<PutOutConditionItemClass>,
  PropertyList: PropertyListItemType[]
  curLineEquipment: null | EquipmentListType
}>();

const emit = defineEmits(['save']);

const rightPanelData = ref<null | Partial<PutOutConditionItemClass>>(null);

const submit = (e: PutOutConditionItemClass) => {
  if (!rightPanelData.value?.Value && rightPanelData.value?.Value !== 0) {
    MpMessage.error({ title: '保存失败', msg: '申放数值未设置' });
    return;
  }
  if (!/^\d+$/.test(`${rightPanelData.value.Value}`)) {
    MpMessage.error({ title: '保存失败', msg: '申放数值设置不正确，请检查' });
    return;
  }
  if (rightPanelData.value.Type === 1 && rightPanelData.value.Value > 100) {
    MpMessage.error({ title: '保存失败', msg: '百分比时，申放数值不能超过100' });
    return;
  }
  const temp = { ...e, ...rightPanelData.value };
  emit('save', temp);
};

onMounted(() => {
  rightPanelData.value = {
    LineEquipmentID: props.curLineEquipment?.LineEquipmentID || '',
    Value: props.curConditionRow?.Value || '',
    Type: props.curConditionRow?.Type || 0,
  };
});
</script>

<style scoped lang='scss'>
.put-out-setup {
  :deep(.constraint-setup-page-comp-wrap) > header{
    padding-top: 20px;
    .el-breadcrumb{
      margin-bottom: 0px;
    }
  }
  .right-class{
    width: 200px;
    margin-left: 100px;
    margin-top: 50px;
    .conent{
      display: flex;
      margin-left: 10px;
      margin-top: 20px;
      >.el-input{
        width: 120px;
      }
      >.el-select{
        margin-left: 10px;
        width: 63px;
      }
    }
  }
  background-color: #fff;
  height: 100%;
}
</style>
