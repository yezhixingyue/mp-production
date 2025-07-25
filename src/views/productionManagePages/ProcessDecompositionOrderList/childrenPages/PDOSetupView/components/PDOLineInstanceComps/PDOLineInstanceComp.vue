<template>
  <div class="line-instance-comp-wrap" v-if="instanceItem">
    <ul class="left">
      <!-- 半成品信息 -->
      <li v-if="instanceItem._isInCombine && instanceItem.SemiFinished">
        <h3 class="ft-16">半成品:{{ curInsPoi.insName }}</h3>
      </li>
      <!-- 半成品生产线信息 -->
      <li v-if="instanceItem._isInCombine">
        <h4 class="ft-14 mr-15">生产线:{{ instanceItem._lineData?.Name || '未设置' }}</h4>
        <mp-button link type="primary" style="padding: 0;top:0" @click="selectVisible = true">选择生产线</mp-button>
      </li>
      <template v-if="instanceItem._lineData">
        <!-- 半成品数量和单位 -->
        <li class="number-unit" v-if="instanceItem._isInCombine">
          <span class="title">数量:</span>
          <el-input maxlength="8" v-model.number="instanceItem.Number"></el-input>
          <span class="title">单位:</span>
          <el-input maxlength="10" v-model.trim="instanceItem.Unit"></el-input>
        </li>
        <!-- 尺寸 -->
        <li class="size">
          <span class="title">尺寸:</span>
          <div class="content">
            <el-input maxlength="6" v-model.number="instanceItem.Width"></el-input>
            <i>x</i>
            <el-input maxlength="6" v-model.number="instanceItem.Height"></el-input>
            <template v-if="instanceItem._needThickness">
              <i>x</i>
              <el-input maxlength="6" v-model.number="instanceItem.Thickness"></el-input>
            </template>
            <em>mm</em>
            <!-- +/- -->
            <div class="btn" @click="instanceItem._needThickness=!instanceItem._needThickness" :class="instanceItem._needThickness ? 'red' : 'blue'">
              <i>{{ instanceItem._needThickness ? '-' : '+' }}</i>
            </div>
          </div>
        </li>
        <!-- 印色 -->
        <li class="color">
          <span class="title">印色:</span>
          <div class="content">
            <el-checkbox v-model="isColorCheckAll" :indeterminate="isColorCheckIndeterminate">全选</el-checkbox>
            <el-checkbox-group v-model="instanceItem.ColorList">
              <el-checkbox v-for="it in PrintColorEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <!-- 印面 -->
        <li>
          <span class="title">印面:</span>
          <div class="content">
            <el-radio-group v-model="instanceItem.PrintSide">
              <el-radio :label="PrintSideEnum.double">双面</el-radio>
              <el-radio :label="PrintSideEnum.single">单面</el-radio>
            </el-radio-group>
          </div>
        </li>
        <!-- 使用物料 -->
        <li>
          <span class="title">使用物料:</span>
          <div class="content">
            <mp-button link type="primary" class="ft-12" @click="materialState.visible = true" style="margin-left: -3px;">选择物料</mp-button>
            <p class="m-name">{{instanceItem.Attribute.Material.Name}}</p>
          </div>
        </li>
      </template>
      <li class="remove-add-row" v-if="instanceItem._isInCombine">
        <RemoveMenu class="remove" v-if="canRemove" @click="onSemiFinisiedRemoveClick" title="删除此半成品" />
        <AddMenu class="add" @click="onSemiFinisiedAddClick" title="添加此半成品" />
      </li>
    </ul>
    <RightSetupPanelComp v-model="instanceItem" :WorkingProcedures="instanceItem._lineData?.Detail.WorkingProcedures || []"
     @folding-click="onFoldingClick" />

    <!-- 物料选择弹窗 -->
    <InstanceMaterialSelectDialog
      v-model:visible="materialState.visible"
      v-model="instanceItem.Material"
      :Attribute="instanceItem.Attribute"
      :FactoryMaterialClassList="materialState.FactoryMaterialClassList" :MaterialList="instanceItem._MaterialList" :loading="materialState.loading"
      :getClassList="getFactoryMaterialClassList" :getMaterialList="getMaterialList"
    />

    <!-- 设置生产线弹窗 -->
    <LineSelectDialog v-model:visible="selectVisible" @change="onLineSelect" :lineType="LineTypeEnum.normal" :lineID="instanceItem._lineData?.ID || ''" />

    <!-- 折手参数设置弹窗 -->
    <FoldingSetupDialog v-model:visible="foldVisible" :instanceItem="instanceItem" @submit="onFoldingSubmit" />
  </div>
</template>

<script setup lang='ts'>
import api from '@/api';
import { computed, ref } from 'vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import AddMenu from '@/components/common/menus/AddMenu.vue';
import { IProductionInstanceOriginData, ProductLineSimpleType } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { PrintColorEnumList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/EnumList';
import { PrintSideEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import InstanceMaterialSelectDialog from './InstanceMaterialSelectDialog.vue';
import LineSelectDialog from '../LineSelectDialog.vue';
import RightSetupPanelComp from './RightSetupPanelComp.vue';
import FoldingSetupDialog from './FoldingSetupDialog.vue';
import { PDOLineInstanceType } from '../../model/Instance';
import { useColorCheckAll } from './hooks/useColorCheckAll';
import { useMaterialSelect } from './hooks/useMaterialSelect';
import { useSemiFinisiedAddRemove } from './hooks/useSemiFinisiedAddRemove';
import { TPDOCraftResolveForm } from '../../model/ruleForm';

const props = defineProps<{
  modelValue: PDOLineInstanceType
  ruleForm: TPDOCraftResolveForm
  index: number
}>();

const instanceItem = computed(() => props.modelValue);

const { isColorCheckAll, isColorCheckIndeterminate } = useColorCheckAll(instanceItem);
const { materialState, getMaterialList, getFactoryMaterialClassList } = useMaterialSelect(instanceItem);
const { curInsPoi, canRemove, onSemiFinisiedAddClick, onSemiFinisiedRemoveClick } = useSemiFinisiedAddRemove(instanceItem, props);

const selectVisible = ref(false);

const onLineSelect = async (item: ProductLineSimpleType) => {
  selectVisible.value = false;
  if (item.ID === instanceItem.value._lineData?.ID) return;

  const resp = await api.productionManageApis.getProductionLineDetail(item.ID).catch(() => null);
  if (!resp || !resp.data) return;

  const _lineData: IProductionInstanceOriginData = {
    ...item,
    Detail: resp.data.Data,
  };

  props.ruleForm.resetInstanceLineData(_lineData, props.index);
};

const foldVisible = ref(false);
const onFoldingClick = () => { // 折手设置
  foldVisible.value = true;
};
const onFoldingSubmit = (params: object) => {
  instanceItem.value.handleFoldingSubmit(params);
  foldVisible.value = false;
};

</script>

<style scoped lang='scss'>
.line-instance-comp-wrap {
  display: flex;
  border-top: 1px solid #d4d4d4;
  text-align: left;
  min-height: 128px;
  min-width: 1400px;
  > .left {
    width: 400px;
    flex: none;
    border-right: 1px solid #d4d4d4;
    box-sizing: border-box;
    padding-left: 40px;
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
        line-height: 28px;
        padding-top: 1px;
        .el-input {
          width: 50px;
        }
      }

      &.size {
        padding-top: 20px;
        :deep(.el-input) {
          width: 50px;
          position: relative;
          &::before {
            // content: '宽';
            position: absolute;
            top: -18px;
            line-height: 16px;
            left: 0;
            color: #888;
          }
          &:nth-of-type(1)::before {
            content: '宽';
          }
          &:nth-of-type(2)::before {
            content: '高';
          }
          &:nth-of-type(3)::before {
            content: '厚';
          }
        }
        .content {
          i, em {
            margin: 0 10px;
            color: #888;
          }

          :deep(.el-input) {
            .el-input__wrapper {
              padding: 0 4px;

              input {
                text-align: center;
                font-size: 12px;
              }
            }
          }

          .btn {
            display: inline-block;
            width: 16px;
            height: 16px;
            vertical-align: middle;
            font-size: 16px;
            font-weight: 700;
            line-height: 16px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;

            &.blue {
              background-color: #26bcf9;
            }
            &.red {
              background-color: #ff3769;
            }

            i {
              color: #fff;
              margin: 0;
              position: relative;
              top: -1px;
            }
          }
        }
      }

      &.color {
        margin-top: 8px;
        .content {
          display: flex;
          align-items: center;
          > .el-checkbox {
            margin-right: 30px;
          }
          > .el-checkbox-group {
            display: flex;
            flex-wrap: wrap;
            > .el-checkbox {
              margin-right: 16px;
            }
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

      :deep(.el-input), .el-input {
        line-height: 28px;
        --el-input-height: 28px;
        .el-input__wrapper {
          padding: 0 4px;

          input {
            text-align: center;
            font-size: 12px;
          }
        }
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

      &.remove-add-row {
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
