<template>
  <header class="header">
    <!-- 稍后提为一个独立共享组件 -->
    <OrderIntro :rowOrder="rowOrder" class="intro" />

    <div class="right">
      <ul>
        <li class="type">
          <span class="title">生产线类型:</span>
          <el-radio-group :model-value="ruleForm.Type" @change="onTypeChange">
            <el-radio :label="LineTypeEnum.normal">单一生产线</el-radio>
            <el-radio :label="LineTypeEnum.combine">组合生产线</el-radio>
          </el-radio-group>
        </li>

        <li class="line">
          <span class="name">{{ ruleForm.Line?.Name || '' }}</span>
          <mp-button type="primary" class="ft-15" link @click="visible = true">选择生产线</mp-button>
        </li>
      </ul>
    </div>

    <LineSelectDialog v-model:visible="visible" :lineType="ruleForm.Type" :lineID="ruleForm.Line?.ID || ''" @change="onLineChange" />

    <!-- <div class="br"></div> -->
  </header>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import OrderIntro from '../../../components/OrderIntro.vue';
import { IPDOrderItem } from '../../../types/types';
import { TPDOCraftResolveForm } from '../model/ruleForm';
import LineSelectDialog from './LineSelectDialog.vue';

const props = defineProps<{
  rowOrder: IPDOrderItem
  ruleForm: TPDOCraftResolveForm
}>();

const emit = defineEmits(['typeChange']);

const visible = ref(false);

const onTypeChange = (val: LineTypeEnum) => {
  emit('typeChange', val);
};

const onLineChange = (line: TPDOCraftResolveForm['Line']) => {
  props.ruleForm.onLineChange(line);
};
</script>

<style scoped lang='scss'>
.header {
  display: flex;
  align-items: center;
  padding: 15px 10px;

  .intro {
    flex: none;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 100px;
    padding-right: 10px;

    > :deep(li) {
      flex: none;
      width: 280px;
    }
  }

  .right {
    flex: 1;
    overflow: hidden;
    display: flex;
    padding-left: 90px;

    >ul {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;

      >.type {
        font-weight: 700;

        .title {
          vertical-align: 2px;
          margin-right: 10px;
        }

        :deep(.el-radio__label) {
          font-size: 13px;
        }
      }

      >.line {
        margin-top: 10px;
        display: flex;
        align-items: center;
        height: 24px;

        .name {
          margin-right: 15px;
          font-size: 16px;
          font-weight: 700;
          color: #000;
        }
      }
    }
  }
}
</style>
