<template>
  <section class="capacity-setup" v-if="rightPanelData">
    <ConstraintSetupPageComp
    leftWidth="800px"
    :PropertyList="props.PropertyList"
    :condition="props.curConditionRow" @submit="submit" showPriority>
      <template #header>
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      </template>
      <template #default>
        <div class="right-class">
          <p class="title mp-common-title-wrap black">
            <span>{{options.title}}：</span>
          </p>
          <p class="conent">
            <span v-if="options.rowTitle">
              {{options.rowTitle}}
            </span>
            <el-input :class="{marginleft: !!options.rowTitle}" v-model.number="rightPanelData.Value" maxlength="9"></el-input>
            <span>{{options.unit}}</span>
          </p>
          <p class="conent" v-if="rightPanelData.Type === CapacityTypeEnum.capacity">
            计算数量：
            <span class="calculate">{{rightPanelData.Property ? getName(rightPanelData.Property) : ''}}</span>
            <mp-button link type="primary" class="ml-8" @click="() => visible = true">选择计算数量</mp-button>
          </p>
          <p class="conent is-gray" v-else>
            说明：作业次数是通过转换器转换而来
          </p>
        </div>
      </template>
    </ConstraintSetupPageComp>
    <Dialog v-model:visible="visible" :propertyList="props.rightPropertyList" @select="onPropSelect" />
  </section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import Dialog from '@/components/common/ConstraintsComps/ConditionPropSelectDialog/ConditionPropSelectDialog.vue';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { Property, PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { ElInput } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentListType } from '../js/types';
import { CapacityConditionItemClass } from '../js/CapacityConditionItemClass';
import { CapacityTypeEnum } from './enum';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  curConditionRow: null | TransformConstraintTableItemType<CapacityConditionItemClass>,
  PropertyList: PropertyListItemType[]
  rightPropertyList: PropertyListItemType[]
  curLineEquipment: null | EquipmentListType
  curCapacityType: CapacityTypeEnum
}>();

const emit = defineEmits(['save']);

const rightPanelData = ref<null | Partial<CapacityConditionItemClass>>(null);

const options = computed(() => {
  const temp = {
    title: '',
    rowTitle: '',
    unit: '',
    simpleTitle: '',
  };
  switch (props.curCapacityType) {
    case CapacityTypeEnum.preparation:
      temp.title = '则准备时间为';
      temp.unit = '分钟准备';
      temp.rowTitle = '每次作业需要';
      temp.simpleTitle = '准备时间';
      break;
    case CapacityTypeEnum.capacity:
      temp.title = '则产能设为';
      temp.unit = '/每小时';
      temp.rowTitle = '';
      temp.simpleTitle = '产能';
      break;
    case CapacityTypeEnum.dry:
      temp.title = '则干燥时间为';
      temp.unit = '分钟时间干燥';
      temp.rowTitle = '下次作业前需要';
      temp.simpleTitle = '干燥时间';
      break;
    default:
      break;
  }

  return temp;
});

const getName = (it: PropertyListItemType) => Property.getPropertyName(it);

const visible = ref(false);

const onPropSelect = (e) => {
  console.log('onPropSelect', e);
  if (rightPanelData.value) rightPanelData.value.Property = e;
};

const submit = (e: CapacityConditionItemClass) => {
  if (!rightPanelData.value?.Value && rightPanelData.value?.Value !== 0) {
    MpMessage.error({ title: '保存失败', msg: `${options.value.simpleTitle}未设置` });
    return;
  }
  if (!/^\d+$/.test(`${rightPanelData.value.Value}`)) {
    MpMessage.error({ title: '保存失败', msg: `${options.value.simpleTitle}设置不正确，请检查` });
    return;
  }
  if (props.curCapacityType === CapacityTypeEnum.capacity && !rightPanelData.value.Property) {
    MpMessage.error({ title: '保存失败', msg: '请设置计算数量' });
    return;
  }
  const temp = { ...e, ...rightPanelData.value };
  emit('save', temp);
};

onMounted(() => {
  rightPanelData.value = {
    LineEquipmentID: props.curLineEquipment?.LineEquipmentID || '',
    Value: props.curConditionRow?.Value || '',
    Type: props.curConditionRow?.Type || props.curCapacityType,
    Property: props.curConditionRow?.Property || null,
  };
});
</script>

<style scoped lang='scss'>
.capacity-setup {
  :deep(.constraint-setup-page-comp-wrap) > header{
    padding-top: 20px;
    .el-breadcrumb{
      margin-bottom: 0px;
    }
  }
  .right-class{
    min-width: 320px;
    margin-left: 100px;
    margin-top: 50px;
    .conent{
      display: flex;
      margin-left: 10px;
      line-height: 30px;
      margin-top: 20px;
      color: #444;
      font-size: 12px;
      >.el-input{
        width: 120px;
        margin: 0 10px;
      }
      >.el-select{
        margin-left: 10px;
        width: 63px;
      }
      &.is-gray {
        color: #888;
      }
      .mp-button {
        font-size: 12px;
      }
      .calculate {
        font-weight: 700;
      }
    }
  }
  background-color: #fff;
  height: 100%;
}
</style>
