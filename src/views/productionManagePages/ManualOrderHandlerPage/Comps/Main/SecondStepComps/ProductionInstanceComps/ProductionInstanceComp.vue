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
            <el-input maxlength="9" v-model.number="itemData.Length"></el-input>
            <i>x</i>
            <el-input maxlength="9" v-model.number="itemData.Width"></el-input>
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
      <li class="remove-row" v-if="itemData._MaterialSource?.NeedSource === false">
        <RemoveMenu class="remove" @click="onSemiFinisiedRemoveClick" title="删除此半成品" />
      </li>
    </ul>
    <div class="right">
      <!-- 工序列表 -->
      <table class="work-table">
        <thead>
          <tr>
            <template v-if="itemData._originLineData">
              <span class="title">代加工工序:</span>
              <mp-button link type="primary" @click="workingVisible = true">添加工序</mp-button>
              <span v-if="itemData.WorkingList.length === 0" class="empty is-pink">
                <el-icon><WarningFilled /></el-icon>暂无工序, 请添加工序
              </span>
            </template>
            <!-- <span v-else class="empty is-gray">
              <el-icon><Warning /></el-icon>请先选择生产线
            </span> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="work in itemData.WorkingList" :key="work.ID">
            <td class="w-title" :title="work.Name">{{ work.Name }}</td>
            <td class="w-content" :title="getWorkingContent(work).replaceAll('；', '\r\n')">{{ getWorkingContent(work) }}</td>
            <td class="w-operator">
              <RemoveMenu class="remove" @click="onWorkRemoveClick(work)" />
            </td>
          </tr>
          <tr v-if="itemData.WorkingList.length > 0" class="extra">
            <mp-button link type="primary" @click="assistVisible = true">辅助信息</mp-button>
          </tr>
        </tbody>
      </table>
      <!-- 拼版文件列表 -->
      <table v-if="itemData.WorkingList.length > 0">
        <thead>
          <tr>
            <span class="title">拼版文件:</span>
            <el-checkbox :model-value="!itemData.AllowUnionMekeup" @change="e => itemData.AllowUnionMekeup = !e">禁止印刷版合拼</el-checkbox>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in _MakeupFileList" :key="it.Plate">
            <td class="w-title" :title="it._PlateTemplate?.Name">{{ it._PlateTemplate?.Name }}</td>
            <td class="w-content file" :title="it._File?.name || ''">
              <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File?.name || '' }}</i>
              <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </td>
            <td class="w-operator">
              <MpFileSelectButton link :accept="'.pdf'" @change="(file) => it._File = file" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 辅助文件列表 -->
      <table v-if="itemData.WorkingList.length > 0 && _AssistFileList.length > 0">
        <thead>
          <tr>
            <span class="title">辅助文件:</span>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in _AssistFileList" :key="it._NoteInfo?.ID">
            <td class="w-title" :title="it._NoteInfo?.Name">{{ it._NoteInfo?.Name }}</td>
            <td class="w-content file" :title="it._File?.name || ''">
              <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File?.name || '' }}</i>
              <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </td>
            <td class="w-operator">
              <MpFileSelectButton link :accept="''" @change="(file) => it._File = file" />
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 专色文件列表 -->
      <table v-if="itemData.WorkingList.length > 0">
        <thead>
          <tr>
            <span class="title">专色文件:</span>
            <mp-button link type="primary" @click="setSpecialColorVisible">添加专色</mp-button>
            <span v-if="_SpecialColorFileList.length === 0" class="empty is-gray">
              <el-icon><WarningFilled /></el-icon>暂无专色文件，如有需要请添加
            </span>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in _SpecialColorFileList" :key="it._SpecialColorInfo?.ID">
            <td class="w-title" :title="it._SpecialColorInfo?.Name">{{ it._SpecialColorInfo?.Name }}</td>
            <td class="w-content file" :title="it._File?.name || ''">
              <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File?.name || '' }}</i>
              <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </td>
            <td class="w-operator">
              <MpFileSelectButton link :accept="'.pdf'" @change="(file) => it._File = file" />
              <RemoveMenu class="remove" @click="onColorRemoveClick(it)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 物料选择弹窗 -->
    <InstanceMaterialSelectDialog
      v-model:visible="materialVisible"
      v-model="itemData.Material"
      :FactoryMaterialClassList="ManualOrderHandlerPageData?.FactoryMaterialClassList || []" :MaterialList="itemData._MaterialList" :loading="loading"
      @getClassList="getClassList" @change="getMaterialList"
    />
    <!-- 添加工序 -->
    <WorkingSelectDialog
      v-model:visible="workingVisible"
      v-model="itemData.WorkingList"
      :workingList="itemData._originLineData?.Detail.WorkingProcedures || []"
      @change="handleWorkingSelect"
    />
    <!-- 设置辅助信息弹窗 -->
    <AssistInfoSetupDialog v-model="itemData.AssistList" v-model:visible="assistVisible" />
    <!-- 设置专色文件弹窗 -->
    <SpecialColorSelectDialog
      v-model:visible="specialColorVisible"
      :FileList="itemData.FileList"
      :SpecialColorList="ManualOrderHandlerPageData?.SpecialColorList || []"
      @submit="onSpecialColorSubmit"
    />
    <!-- 设置生产线弹窗 -->
    <LineSelectDialog v-model:visible="selectVisible" @submit="onLineSelect" isLineInstanceUse :curInstanceLineID="itemData._originLineData?.ID" />
  </div>
</template>

<script setup lang='ts'>
import api from '@/api';
import { computed, ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { ILineDetailWorkingProcedure, IProductionLineDetail } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import {
  IConvertOrderFile, IPrintColor, IProductionInstanceOriginData, ProductLineSimpleType,
} from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { PrintColorEnumList, PlaceOrderMaterialSourceEnumList } from '../../../../js/EnumList';
import { PrintSideEnum, PlaceOrderMaterialSourceEnum } from '../../../../js/enums';
import { PlaceOrderProductionInstance } from '../../../../js/PlaceOrderProductionInstance';
import InstanceMaterialSelectDialog from './InstanceMaterialSelectDialog.vue';
import WorkingSelectDialog from './WorkingSelectDialog.vue';
import AssistInfoSetupDialog from './AssistInfoSetupDialog.vue';
import SpecialColorSelectDialog from './SpecialColorSelectDialog.vue';
import MpFileSelectButton from '../../../../../../../components/common/General/MpFileSelectButton.vue';
import LineSelectDialog from '../LineSelectDialog.vue';
import { ManualOrderHandlerPageData } from '../../../../js';

const props = defineProps<{
  modelValue: PlaceOrderProductionInstance
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

/** 拼版文件列表 */
const _MakeupFileList = computed(() => itemData.value.FileList.filter(it => it._PlateTemplate));

/** 辅助文件列表 */
const _AssistFileList = computed(() => itemData.value.FileList.filter(it => it._NoteInfo));

/** 专色文件列表 */
const _SpecialColorFileList = computed(() => itemData.value.FileList.filter(it => it.SpecialColorList));

/* 选择工序相关
----------------------------------- */
const workingVisible = ref(false);

const handleWorkingSelect = () => {
  itemData.value.generateInstanceDataByWorkingList();
};

const getWorkingContent = (work: ILineDetailWorkingProcedure) => work.NoteInfos
  .filter(it => it.Type === AssistInfoTypeEnum.text)
  .map(it => itemData.value.AssistList.find(_it => _it.ID === it.ID))
  .filter(it => it && it.Content)
  .map(it => `${it?._Name}：${it?.Content}`)
  .join('；');

const onWorkRemoveClick = (work: ILineDetailWorkingProcedure) => {
  MpMessage.warn({
    title: '确定删除该工序吗',
    msg: `工序名称: [ ${work.Name} ]`,
    onOk: () => {
      itemData.value.WorkingList = itemData.value.WorkingList.filter(it => it.ID !== work.ID);
      handleWorkingSelect();
    },
  });
};

/* 设置辅助信息相关
----------------------------------- */
const assistVisible = ref(false);

/* 设置专色文件相关
----------------------------------- */
const specialColorVisible = ref(false);

const setSpecialColorVisible = async () => {
  if (ManualOrderHandlerPageData.value) {
    await ManualOrderHandlerPageData.value.getSpecialColorList();
    specialColorVisible.value = true;
  }
};

const onSpecialColorSubmit = (list: IPrintColor[]) => {
  itemData.value.handleSpecialColorChange(list);
};

const onColorRemoveClick = (color: IConvertOrderFile) => {
  MpMessage.warn({
    title: '确定删除该专色吗',
    msg: `专色名称: [ ${color._SpecialColorInfo?.Name} ]`,
    onOk: () => {
      const list = itemData.value.FileList.map(it => it._SpecialColorInfo).filter(it => it && it.ID !== color._SpecialColorInfo?.ID) as IPrintColor[];
      onSpecialColorSubmit(list);
    },
  });
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
            content: '长';
            position: absolute;
            top: -18px;
            line-height: 16px;
            left: 0;
            color: #888;
          }
          &:last-of-type::before {
            content: '宽';
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
        margin-top: -6px;
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
  > .right {
    width: 925px;
    padding-left: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    > table {
      margin-top: 18px;
      width: 855px;
      border-collapse: collapse;
      > thead > tr {
        display: flex;
        align-items: center;
        padding-bottom: 4px;
        .title {
          font-weight: 700;
          flex: none;
          margin-right: 10px;
          font-size: 14px;
        }

        :deep(.el-checkbox__label) {
          font-size: 14px;
        }
        .empty {
          display: flex;
          align-items: center;
          position: relative;
          top: 1px;
          i {
            font-size: 14px;
            margin-right: 5px;
            margin-left: 25px;
          }
        }
      }
      > tbody {
        > tr {
          height: 40px;
          border: 1px solid #E5E5E5;
          transition: background-color 0.1s ease-in-out;
          &:nth-of-type(even) {
            background-color: #f5f5f5;
          }
          &:hover {
            background-color: lighten($color: #26bcf9, $amount: 40);
          }
          &.extra {
            border: none;
            background-color:rgba(0, 0, 0, 0);
            height: 20px;
            position: relative;
            > button {
              position: absolute;
              right: 2px;
              top: 6px;
              font-size: 13px;
            }
          }
          > td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box;
            padding: 0 10px;
            &.w-title {
              padding-left: 50px;
              width: 196px;
              max-width: 196px;
            }
            &.w-content {
              width: 420px;
              max-width: 420px;
              padding-right: 20px;
              &.file {
                > em {
                  width: 72px;
                }
                > i {
                  max-width: calc(100% - 72px);
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  display: inline-block;
                  vertical-align: top;
                }
              }
            }
            &.w-operator {
              // width: 239px;
              padding-left: 10px;
              .remove {
                margin-left: 70px;
              }
              :deep(.select-file-button-dom) {
                font-size: 12px;
              }
            }
          }
        }
      }
      &.work-table > tbody > tr > td {
        &.w-content {
          width: 475px;
          max-width: 475px;
        }
      }
    }
  }
}
</style>
