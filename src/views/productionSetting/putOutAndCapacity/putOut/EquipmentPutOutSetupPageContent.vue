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
            <el-input v-model.trim="rightPanelData.Value" maxlength="9"></el-input>
            <el-select v-model="rightPanelData.Type" class="m-2" placeholder="Select">
              <el-option label="张" :value="PutOutTypeEnum.number"/>
              <el-option label="%" :value="PutOutTypeEnum.percent"/>
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
import { PutOutTypeEnum } from '../js/enum';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curConditionRow: null | TransformConstraintTableItemType<PutOutConditionItemClass>,
  PropertyList: PropertyListItemType[]
  curLineEquipment: null | EquipmentListType
}>();

const emit = defineEmits(['save']);

const rightPanelData = ref<null | Partial<PutOutConditionItemClass>>(null);

const submit = (e: PutOutConditionItemClass) => {
  const { Value, Type } = rightPanelData.value || {};
  if (!Value && Value !== 0) {
    MpMessage.error({ title: '保存失败', msg: '申放数值未设置' });
    return;
  }
  if (Type !== PutOutTypeEnum.percent && !/^\d+$/.test(`${Value}`)) {
    MpMessage.error({ title: '保存失败', msg: '非百分比时申放数值必须为0或正整数类型' });
    return;
  }
  if (Type === PutOutTypeEnum.percent) {
    if (!/^\d{1,3}(\.\d{0,2})?$/.test(`${Value}`)) {
      MpMessage.error({ title: '保存失败', msg: '申放数值设置不正确，必须为数值类型，百分比时范围必须在[0,100]之间，最多两位小数' });
      return;
    }
    if (+Value > 100) {
      MpMessage.error({ title: '保存失败', msg: '百分比时，申放数值不能超过100' });
      return;
    }
  }
  const temp = { ...e, ...rightPanelData.value, Value: Number(Value) };
  emit('save', temp);
};

onMounted(() => {
  rightPanelData.value = {
    LineEquipmentID: props.curLineEquipment?.LineEquipmentID || '',
    Value: props.curConditionRow?.Value || props.curConditionRow?.Value === 0 ? props.curConditionRow?.Value : '',
    Type: props.curConditionRow?.Type || PutOutTypeEnum.number,
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
