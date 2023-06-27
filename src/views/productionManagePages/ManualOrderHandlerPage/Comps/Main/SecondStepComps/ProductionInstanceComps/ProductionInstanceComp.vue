<template>
  <div class="line-instance-comp-wrap" v-if="itemData">
    <ul class="left">
      <!-- 半成品信息 -->
      <li v-if="itemData._isBelongToCombineLine">
        <h3 class="ft-16">半成品:{{ itemData.SemiFinished.Name }}</h3>
      </li>
      <!-- 半成品生产线信息 -->
      <li v-if="itemData._isBelongToCombineLine">
        <h4 class="ft-14 mr-15">生产线:{{ itemData._originLineData?.Name || '未设置' }}</h4>
        <mp-button link type="primary" style="padding: 0;top:0" @click="selectVisible = true">选择生产线</mp-button>
      </li>
      <template v-if="itemData._originLineData">
        <!-- 半成品数量和单位 -->
        <li class="number-unit" v-if="itemData._isBelongToCombineLine">
          <span class="title">数量:</span>
          <el-input maxlength="8" v-model.number="itemData.Number"></el-input>
          <span class="title">单位:</span>
          <el-input maxlength="10" v-model.trim="itemData.Unit"></el-input>
        </li>
        <!-- 尺寸 -->
        <li class="size">
          <span class="title">尺寸:</span>
          <div class="content">
            <el-input maxlength="9" v-model.number="itemData.Width"></el-input>
            <i>x</i>
            <el-input maxlength="9" v-model.number="itemData.Height"></el-input>
            <em>mm</em>
          </div>
        </li>
        <!-- 印色 -->
        <li>
          <span class="title">印色:</span>
          <div class="content">
            <el-checkbox-group v-model="itemData.ColorList">
              <el-checkbox v-for="it in PrintColorEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <!-- 印面 -->
        <li>
          <span class="title">印面:</span>
          <div class="content">
            <el-radio-group v-model="itemData.PrintSide">
              <el-radio :label="PrintSideEnum.double">双面</el-radio>
              <el-radio :label="PrintSideEnum.single">单面</el-radio>
            </el-radio-group>
          </div>
        </li>
        <!-- 使用物料 -->
        <li>
          <span class="title">使用物料:</span>
          <div class="content">
            <mp-button link type="primary" class="ft-12" @click="materialVisible = true">选择物料</mp-button>
            <p class="m-name">{{itemData._MaterialName}}</p>
          </div>
        </li>
        <!-- 物料来源 -->
        <li>
          <span class="title">物料来源:</span>
          <div class="content">
            <el-radio-group v-model="itemData.MaterialSource">
              <el-radio v-for="it in PlaceOrderMaterialSourceEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
            </el-radio-group>
          </div>
        </li>
        <!-- 物料尺寸 -->
        <li class="size" v-if="itemData.MaterialSource!==''&&itemData.MaterialSource!==PlaceOrderMaterialSourceEnum.warehouse">
          <span class="title">物料尺寸:</span>
          <div class="content">
            <el-input maxlength="9" v-model.number="itemData.MaterialWidth"></el-input>
            <i>x</i>
            <el-input maxlength="9" v-model.number="itemData.MaterialHeight"></el-input>
            <em>mm</em>
          </div>
        </li>
        <!-- 取料地址 -->
        <li class="address" v-show="(itemData.MaterialSource === PlaceOrderMaterialSourceEnum.homePickup)">
          <p>取货地址:</p>
          <el-input type="textarea" :rows="3" maxlength="60" v-model.trim="itemData.Address.AddressDetail"></el-input>
          <p>
            <span>联系人:</span>
            <el-input maxlength="10" v-model.trim="itemData.Address.Consignee"></el-input>
          </p>
          <p>
            <span>手机号:</span>
            <el-input maxlength="11" v-model.trim="itemData.Address.Mobile"></el-input>
          </p>
        </li>
      </template>
      <li class="remove-row" v-if="itemData._MaterialSource?.NeedResource === false">
        <RemoveMenu class="remove" @click="onSemiFinisiedRemoveClick" title="删除此半成品" />
      </li>
    </ul>
    <RightSetupPanelComp v-model="itemData" :index="index" :WorkingProcedures="itemData._originLineData?.Detail.WorkingProcedures || []"
     @folding-click="onFoldingClick" />
    <!-- 物料选择弹窗 -->
    <InstanceMaterialSelectDialog
      v-model:visible="materialVisible"
      v-model="itemData.Material"
      :FactoryMaterialClassList="ManualOrderHandlerPageData?.FactoryMaterialClassList || []" :MaterialList="itemData._MaterialList" :loading="loading"
      @getClassList="getClassList" @change="getMaterialList"
    />
    <!-- 设置生产线弹窗 -->
    <LineSelectDialog v-model:visible="selectVisible" @submit="onLineSelect" isLineInstanceUse :curInstanceLineID="itemData._originLineData?.ID" />
    <!-- 折手参数设置弹窗 -->
    <FoldingSetupDialog v-model:visible="foldVisible" :instanceData="itemData" @submit="onFoldingSubmit" />
  </div>
</template>

<script setup lang='ts'>
import api from '@/api';
import { computed, ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { IProductionLineDetail } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { IProductionInstanceOriginData, ProductLineSimpleType } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { PrintColorEnumList, PlaceOrderMaterialSourceEnumList } from '../../../../js/EnumList';
import { PrintSideEnum, PlaceOrderMaterialSourceEnum } from '../../../../js/enums';
import { PlaceOrderProductionInstance } from '../../../../js/PlaceOrderProductionInstance';
import InstanceMaterialSelectDialog from './InstanceMaterialSelectDialog.vue';
import LineSelectDialog from '../LineSelectDialog.vue';
import RightSetupPanelComp from './RightSetupPanelComp.vue';
import FoldingSetupDialog from './FoldingSetupDialog.vue';
import { ManualOrderHandlerPageData } from '../../../../js';

const props = defineProps<{
  modelValue: PlaceOrderProductionInstance
  index: number
}>();

const itemData = computed(() => props.modelValue);

const selectVisible = ref(false);

const onLineSelect = async (item: ProductLineSimpleType) => {
  selectVisible.value = false;
  if (item.ID === itemData.value._originLineData?.ID) return;
  const resp = await api.ManualOrderHandlerApis.getProductionLineDetail(item.ID).catch(() => null);
  if (!resp) return;
  const Detail: IProductionLineDetail = resp.data.Data;
  const _originData: IProductionInstanceOriginData = {
    ...item,
    Detail,
  };
  ManualOrderHandlerPageData.value?.CreateOrderInfo.setCombineSingleLineInstance(itemData.value, _originData);
};

const materialVisible = ref(false);

const getClassList = () => {
  if (ManualOrderHandlerPageData.value) ManualOrderHandlerPageData.value.getFactoryMaterialClassList();
};

const loading = ref(false);

const getMaterialList = async (TypeID: string) => {
  loading.value = true;
  await itemData.value.getMaterialList(TypeID);
  loading.value = false;
};

const onSemiFinisiedRemoveClick = () => {
  MpMessage.warn({
    title: '确定删除该半成品吗 ?',
    msg: `半成品名称：[ ${itemData.value.SemiFinished.Name} ]`,
    onOk: () => {
      setTimeout(() => {
        ManualOrderHandlerPageData.value?.CreateOrderInfo.removeCombineSingleLineInstance(itemData.value);
      }, 50);
    },
  });
};

const foldVisible = ref(false);
const onFoldingClick = () => { // 折手设置
  foldVisible.value = true;
};
const onFoldingSubmit = (params: object) => {
  itemData.value.handleFoldingSubmit(params);
  foldVisible.value = false;
};

</script>

<style scoped lang='scss'>
.line-instance-comp-wrap {
  display: flex;
  border-top: 1px solid #d4d4d4;
  text-align: left;
  min-height: 128px;
  > .left {
    width: 353px;
    flex: none;
    border-right: 1px solid #d4d4d4;
    box-sizing: border-box;
    padding-left: 50px;
    padding-top: 20px;
    padding-bottom: 14px;
    > li {
      display: flex;
      line-height: 30px;
      font-size: 12px;
      margin-bottom: 6px;
      .title {
        font-weight: 700;
        width: 52px;
        text-align: right;
        flex: none;
        margin-right: 10px;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        // font-family: SimHei;
      }
      h3, h4 {
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      }

      &.number-unit {
        .el-input {
          width: 60px;
        }
      }

      &.size {
        padding-top: 20px;
        .el-input {
          width: 60px;
          position: relative;
          &::before {
            content: '宽';
            position: absolute;
            top: -18px;
            line-height: 16px;
            left: 0;
            color: #888;
          }
          &:last-of-type::before {
            content: '高';
          }
        }
        .content {
          i, em {
            margin: 0 10px;
            color: #888;
          }
        }
      }

      .mp-button {
        position: relative;
        top: -1px;
        margin-left: -2px;
      }

      :deep(.el-radio) {
        margin-right: 40px;
      }

      :deep(.el-radio__label) {
        position: relative;
        top: 1px;
      }

      .m-name {
        line-height: 14px;
        padding-bottom: 4px;
      }

      &.address {
        flex-direction: column;
        margin-top: 0px;
        :deep(.el-textarea) {
          font-size: 12px;
          width: 282px;
        }
        :deep(.el-input) {
          width: 140px;
        }
        > p:not(:first-of-type) {
          margin-top: 9px;
          padding-left: 47px;
          > span {
            margin-right: 10px;
          }
        }
      }

      &.remove-row {
        justify-content: flex-end;
        line-height: 18px;
        padding-top: 12px;
        padding-right: 11px;
        // .remove {
        //   :deep(> span) {
        //     color: #ff3769;
        //   }
        // }
      }
    }
  }
}
</style>
