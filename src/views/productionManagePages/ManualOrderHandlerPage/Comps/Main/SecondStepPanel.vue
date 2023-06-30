<template>
  <div class="second-panel-wrap" v-if="ManualOrderHandlerPageData">
    <p class="p-attr">
      <span class="title">产品数量:</span>
      <el-input v-model.number="ManualOrderHandlerPageData.CreateOrderInfo.Attribute.ProductAmount" maxlength="8"></el-input>
      <span class="title">数量单位:</span>
      <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Attribute.Unit" maxlength="10"></el-input>
      <el-checkbox v-model="ManualOrderHandlerPageData.CreateOrderInfo.NeedPacked" label="需要打包" />
      <span class="title">印刷内容:</span>
      <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Content" class="print-content" maxlength="120"></el-input>
    </p>
    <p class="line-type">
      <span class="title">生产线类型:</span>
      <el-radio-group v-model="ManualOrderHandlerPageData.CreateOrderInfo._curLineType">
        <el-radio :label="LineTypeEnum.normal">单一生产线</el-radio>
        <el-radio :label="LineTypeEnum.combine">组合生产线</el-radio>
      </el-radio-group>
    </p>
    <div class="line-select">
      <h2 :class="{'is-gray': !curLineData.Line}">{{curLineData.Line ? curLineData.Line?.Name || '' : `请选择${
        ManualOrderHandlerPageData.CreateOrderInfo._curLineType === LineTypeEnum.combine ? '组合' : ''
      }生产线`}}</h2>
      <mp-button link type="primary" @click="(selectVisible = true)">选择{{
        ManualOrderHandlerPageData.CreateOrderInfo._curLineType === LineTypeEnum.combine ? '组合' : ''
      }}生产线</mp-button>
    </div>
    <!-- 单一生产线实例 -->
    <ProductionInstanceComp v-if="ManualOrderHandlerPageData.CreateOrderInfo._SingleInstanceList[0]"
      v-show="curLineData.Type===LineTypeEnum.normal" :index="0" v-model="ManualOrderHandlerPageData.CreateOrderInfo._SingleInstanceList[0]" />
    <!-- 组合生产线公共部分 -->
    <CombineLineCommonInfo v-show="curLineData.Type === LineTypeEnum.combine" />
    <!-- 组合生产线实例列表 -->
    <ProductionInstanceComp
      v-show="curLineData.Type===LineTypeEnum.combine"
      v-for="(item, i) in ManualOrderHandlerPageData.CreateOrderInfo._CombineInstanceList" :key="item._key"
      v-model="ManualOrderHandlerPageData.CreateOrderInfo._CombineInstanceList[i]" :index="i"
    />
    <p class="add-semiFinished" v-show="curLineData.Type === LineTypeEnum.combine
      && ManualOrderHandlerPageData.CreateOrderInfo._AllMaterialSources.length > ManualOrderHandlerPageData.CreateOrderInfo._CombineInstanceList.length">
      <mp-button link type="primary" @click="(semiFinishedVisible = true)">添加半成品</mp-button>
    </p>
    <SemiFinishedAddDialog
      v-model:visible="semiFinishedVisible"
      :AllMaterialSources="ManualOrderHandlerPageData.CreateOrderInfo._AllMaterialSources"
      :selectedIds="selectedMaterialSourceIds"
      @submit="onSemiFinishedSelect"
    />
    <!-- 设置生产线弹窗 -->
    <LineSelectDialog v-model:visible="selectVisible" @submit="onLineSelect" />
  </div>
</template>

<script setup lang='ts'>
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { computed, ref } from 'vue';
import { ManualOrderHandlerPageData } from '../../js';
import { PlaceOrderProductionInstance } from '../../js/PlaceOrderProductionInstance';
import { ProductLineSimpleType } from '../../js/types';
import LineSelectDialog from './SecondStepComps/LineSelectDialog.vue';
import ProductionInstanceComp from './SecondStepComps/ProductionInstanceComps/ProductionInstanceComp.vue';
import CombineLineCommonInfo from './SecondStepComps/CombineLineCommonInfo.vue';
import SemiFinishedAddDialog from './SecondStepComps/SemiFinishedAddDialog.vue';
import { ILineWorkingMaterialSources } from '../../js/ProductionLineDetailTypes';

const selectVisible = ref(false);

const onLineSelect = (e: ProductLineSimpleType) => {
  ManualOrderHandlerPageData.value?.setCurProdutionLine(e);
  selectVisible.value = false;
};

const curLineData = computed(() => {
  const temp: { Line: null | ProductLineSimpleType, InstanceList: Required<PlaceOrderProductionInstance>[], Type: LineTypeEnum } = {
    Line: null,
    InstanceList: [],
    Type: ManualOrderHandlerPageData.value?.CreateOrderInfo._curLineType || LineTypeEnum.normal,
  };
  if (!ManualOrderHandlerPageData.value) return temp;
  switch (ManualOrderHandlerPageData.value.CreateOrderInfo._curLineType) {
    case LineTypeEnum.normal:
      temp.Line = ManualOrderHandlerPageData.value.CreateOrderInfo._curSinigleLine;
      temp.InstanceList = ManualOrderHandlerPageData.value.CreateOrderInfo._SingleInstanceList;
      break;
    case LineTypeEnum.combine:
      temp.Line = ManualOrderHandlerPageData.value.CreateOrderInfo._curCombineLine;
      temp.InstanceList = ManualOrderHandlerPageData.value.CreateOrderInfo._CombineInstanceList;
      break;
    default:
      break;
  }
  return temp;
});

const semiFinishedVisible = ref(false);

const selectedMaterialSourceIds = computed(
  () => ManualOrderHandlerPageData.value?.CreateOrderInfo._CombineInstanceList.map(it => it.SemiFinished?.ID).filter(it => it) as string[] || [],
);

const onSemiFinishedSelect = (item: ILineWorkingMaterialSources) => {
  semiFinishedVisible.value = false;
  if (!ManualOrderHandlerPageData.value) return;
  ManualOrderHandlerPageData.value.CreateOrderInfo._CombineInstanceList.push(new PlaceOrderProductionInstance(true, null, item));
};

</script>

<style scoped lang='scss'>
.second-panel-wrap {
  font-size: 12px;
  text-align: center;
  .el-input {
    width: 140px;
  }
  .el-checkbox {
    vertical-align: top;
    margin-left: 15px;
    :deep(.el-checkbox__label) {
      font-size: 13px;
    }
  }
  .title {
    font-weight: 600;
    margin-right: 10px;
  }
  .print-content {
    width: 290px;
  }
}
.p-attr {
  line-height: 30px;
  .title {
    font-size: 14px;
    vertical-align: top;
    &:not(:first-of-type) {
      margin-left: 40px;
    }
  }
}

.line-type {
  line-height: 30px;
  margin-top: 12px;
  .title {
    line-height: 30px;
    vertical-align: top;
    font-size: 14px;
    position: relative;
    top: -1px;
  }
  .el-radio {
    margin-right: 50px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}

.line-select {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  // margin-right: 100px;
  height: 30px;
  padding-bottom: 4px;
  h2 {
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    // min-width: 10em;
    margin-right: 22px;
    text-align: right;
    color: #000;
    &.is-gray {
      color: #585858;
    }
  }
  button {
    position: relative;
    top: 2px;
    font-size: 13px;
  }
}

.add-semiFinished {
  text-align: right;
  padding-top: 5px;
  padding-right: 50px;
  padding-bottom: 20px;
}
</style>
