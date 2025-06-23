<template>
    <!-- 出库确认 -->
    <DialogContainerComp
    :title="isMaterialRequisition ? '查看领料单' : '出库确认'"
    :visible='outVerify'
    :primaryClick="outPrimaryClick"
    :closeClick="() => closeClick()"
    :primaryText="isMaterialRequisition ? '打印' : '打印并出库'"
    :closeBtnText="isMaterialRequisition ? '取消' : '取消出库'"
    :width="700"
    :open="open"
    :top="StoresRequisitionInfo ? '5vh' : ''"
    class="material-requisition-dialog"
    >
    <template #default>
      <div id="print">
        <div style="padding:0 20px;">
          <div class="material-info" style="padding:0 20px;display: flex;display: flex;">
            <div style="width:120px; margin-top: 70px;padding-right: 30px; text-align: center;">
              <div style="display: flex;width:120px;height:120px">
                <img style="width:120px;height:120px" :src="StockOutRequisition ? StockOutRequisition.OutCodeSrc : OutCodeSrc" alt="">
              </div>
              <span>{{ StockOutRequisition ? StockOutRequisition.OutCode : OutCode }}</span>
            </div>
            <div class="material"
            style="line-height: 32px;font-size:16px;font-weight: 600; flex: 1;">
              <p style="margin-top:20px;" v-if="!StoresRequisitionInfo"></p>
              <p style="margin-top:10px; line-height: 1.3em;" v-if="StoresRequisitionInfo">
                生产线：{{StoresRequisitionInfo?.ProductionLine}}
              </p>
              <p style="margin-top:7px; line-height: 1.3em;" v-if="StoresRequisitionInfo">
                大版ID：{{StoresRequisitionInfo?.PlateCode}}
              </p>
              <p style="display: flex;">
                <span style="min-width:70px;color:#7A8B9C; text-align: right;">SKU：</span>
                <span style="color:#7a8b9c;">{{StockOutRequisition ? StockOutRequisition.SKU : Code}}</span>
              </p>
              <p style="display: flex;line-height: 1.3em;"><span style="min-width:70px;color:#7A8B9C; text-align: right;">物料：</span>
                <span style="color:#7a8b9c;">
                  {{StockOutRequisition ? StockOutRequisition.AttributeDescribe : AttributeDescribe}}
                </span>
              </p>
              <p style="display: flex;">
                <span style="width:70px;color:#7A8B9C; text-align: right;"></span>
                <span style="">{{StockOutRequisition ? StockOutRequisition.SizeDescribe : SizeDescribe}}</span>
              </p>
              <div style="margin:5px 0">
                <p style="font-size: 14px;line-height: 16px;">出库位置：</p>
                <ul :style="`border: 1px solid #A6B6C6;border-radius: 7px;padding:0 3%;color:#566176`">
                  <template v-if="StockOutRequisition">
                    <li v-for="(GoodsPosition, index) in StockOutRequisition.GoodsPositionStockInfos" :key="index"
                      style="line-height: 20px;border-bottom:1px solid #F2F6FC;display: flex;justify-content: space-between;align-items: center;
                      min-height: 45px;">
                      <span style="width:30%;text-align:center;">{{GoodsPosition.StorehouseName}}</span>
                      <span style="width:33.33%;text-align:center;margin: 0 3.33%;">{{GoodsPosition.UpperDimension}} {{GoodsPosition.PositionName}}</span>
                      <span style="width:30%;text-align:center;">{{GoodsPosition.OutInNumber}}{{StockOutRequisition.StockUnit}}</span>
                    </li>
                  </template>
                  <template v-else>
                    <template v-for="Storehouse in StorehouseStockInfo" :key="Storehouse.StorehouseID">
                      <template v-for="GoodsPosition in Storehouse.GoodsPositionStockInfos" :key="GoodsPosition.PositionID">
                        <li v-if="GoodsPosition.checked && GoodsPosition.inputValue"
                          style="line-height: 20px;border-bottom:1px solid #F2F6FC;display: flex;justify-content: space-between;align-items: center;
                          min-height: 45px;">
                          <span style="width:30%;text-align:center;">{{Storehouse.StorehouseName}}</span>
                          <span style="width:33.33%;text-align:center;margin: 0 3.33%;">{{GoodsPosition.UpperDimension}} {{GoodsPosition.PositionName}}</span>
                          <span style="width:30%;text-align:center;">{{GoodsPosition.inputValue}}{{StockUnit}}</span>
                        </li>
                      </template>
                    </template>
                  </template>
                </ul>
              </div>
              <p style="margin-top:7px; line-height: 1.3em;">
                {{ (StoresRequisitionInfo) ? '领料' : '出库'}}数量：{{StockOutRequisition ? StockOutRequisition.AllOutNumber : AllOutNumber}}
                  {{StockOutRequisition ? StockOutRequisition.StockUnit : StockUnit}}
                  <!-- <template v-if="!StockOutRequisition">
                    （{{OutUnitNum}} {{outUnitName}}）
                  </template> -->
              </p>
              <p style="margin-top:7px; line-height: 1.3em;">
                <span style="min-width:70px; text-align: right;">领料人：</span>
                <span style="">
                  {{StockOutRequisition ? StockOutRequisition.ReceiptorName : ReceiptorName}}
                </span>
              </p>
              <p style="margin-top:7px; line-height: 1.3em;" v-if="StoresRequisitionInfo">
                <span style="min-width:70px; text-align: right;">开料机台：</span>
                <span style="" v-if="StoresRequisitionInfo?.SplitEquipment">
                  {{StoresRequisitionInfo?.SplitEquipment.ClassName}}
                  {{StoresRequisitionInfo?.SplitEquipment.GroupName}}
                  {{StoresRequisitionInfo?.SplitEquipment.Name}}
                </span>
                <span style="" v-else>
                  无需开料
                </span>
              </p>
              <p style="font-size: 14px;text-align: right;margin-top: 7px; font-weight: 400;">
                <span>开单人：{{ StockOutRequisition ? StockOutRequisition.operatorName : operatorName }}</span>
                <span style="margin-left: 10px;">
                  开单时间：{{ OperatorTime }}
                </span>
              </p>
            </div>
          </div>
          <div v-if="StoresRequisitionInfo"
            style="border-bottom: 1px dashed #A6B6C6;height:18px;margin:10px 0;font-size: 12px;margin-top: 10px;">
            单据以上部分交接后即可回收
          </div>
          <div class="storehouse-stock" style="display: flex;padding:0 20px" v-if="StoresRequisitionInfo">
            <div style="width:120px; margin-top: 70px; margin-right: 30px; text-align: center;">
              <div>
                <img style="width:120px;height:120px"
                :src="StockOutRequisition ? StockOutRequisition.MaterialRequisitionCodeSrc : MaterialRequisitionCodeSrc" alt="">
              </div>
              <span>{{ StoresRequisitionInfo.Code }}</span>
            </div>
            <div style="display: flex;flex-direction: column;flex:1">

              <div style="line-height: 32px;font-size:16px;font-weight: 600;">
                <p style="margin-top:7px; line-height: 1.3em;">
                  生产线：{{StoresRequisitionInfo?.ProductionLine}}
                </p>
                <p style="margin-top:7px; line-height: 1.3em;">
                  大版ID：{{StoresRequisitionInfo?.PlateCode}}
                </p>
                <p style="display: flex;">
                  <span style="min-width:70px;color:#7A8B9C; text-align: right;">SKU：</span>
                  <span style="color:#7a8b9c;">{{StockOutRequisition ? StockOutRequisition.SKU : Code}}</span>
                </p>
                <p style="display: flex;line-height: 1.3em;"><span style="min-width:70px;color:#7A8B9C; text-align: right;">物料：</span>
                  <span style="color:#7a8b9c;">
                    {{StockOutRequisition ? StockOutRequisition.AttributeDescribe : AttributeDescribe}}
                  </span>
                </p>
                <p style="display: flex;">
                  <span style="width:70px;color:#7A8B9C; text-align: right;"></span>
                  <span style="">{{StockOutRequisition ? StockOutRequisition.SizeDescribe : SizeDescribe}}</span>
                </p>
                <p style="margin-top:7px; line-height: 1.3em; color: #ff2e17;">
                  物料来源：仓库领料
                </p>
                <p style="margin-top:7px; line-height: 1.3em;">
                  {{ (StoresRequisitionInfo) ? '领料' : '出库'}}数量：
                  {{StockOutRequisition ? StockOutRequisition.AllOutNumber : AllOutNumber}}
                    {{StockOutRequisition ? StockOutRequisition.StockUnit : StockUnit}}
                    <!-- <template v-if="!StockOutRequisition">
                      （{{OutUnitNum}} {{outUnitName}}）
                    </template> -->
                </p>
                <!-- <p style="margin-top:10px; line-height: 1.3em;">
                  出库数量：{{AllOutNumber}}
                    {{StockUnit}}
                    （{{OutUnitNum}} {{outUnitName}}）
                </p> -->
                <p style="margin-top:7px; line-height: 1.3em;">
                  <span style="min-width:70px; text-align: right;">开数：</span>
                  <span style="">
                    {{StoresRequisitionInfo?.Multiple}}
                  </span>
                </p>
                <p style="margin-top:7px; line-height: 1.3em;">
                  <span style="min-width:70px; text-align: right;">开料数量：</span>
                  <span style="">
                    {{StoresRequisitionInfo?.PrintNumber}} {{StockOutRequisition ? StockOutRequisition.StockUnit : StockUnit}}
                  </span>
                </p>
                <p style="margin-top:7px; line-height: 1.3em;color: #ff2e17;">
                  <span style="min-width:70px; text-align: right;">开料机台：</span>
                  <span style="" v-if="StoresRequisitionInfo?.SplitEquipment">
                    {{StoresRequisitionInfo?.SplitEquipment.ClassName}}
                    {{StoresRequisitionInfo?.SplitEquipment.GroupName}}
                    {{StoresRequisitionInfo?.SplitEquipment.Name}}
                  </span>
                  <span style="" v-else>
                    无需开料
                  </span>
                </p>
                <p style="margin-top:7px; line-height: 1.3em;">
                  <span style="min-width:70px; text-align: right;">交接机台：</span>
                  <span style="">
                    {{StoresRequisitionInfo?.ReceiveEquipment.ClassName}}
                    {{StoresRequisitionInfo?.ReceiveEquipment.GroupName}}
                    {{StoresRequisitionInfo?.ReceiveEquipment.Name}}
                  </span>
                </p>
                <!-- <p style="display: flex;" v-if="StoresRequisitionInfo">
                </p> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button v-print="print" v-show="false" ref="printBtn">打印</el-button>
    </template>
    </DialogContainerComp>
</template>

<script lang='ts' setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  computed, Ref, ref,
} from 'vue';
import type { IList } from '@/store/modules/materialWarehouse/StoresRequisitionTypes';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import api from '@/api';

interface GoodsPositionStockInfosType {
  StorehouseID: string,
  PositionName: string,
  PositionID: string,
  Number: number | string,
  checked: boolean,
  inputValue:string|number,
  UpperDimension: string
}
interface StorehouseStockInfoType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}
interface IGoodsPositionStockInfos {
OutInNumber:number
PositionName:string
StoreNumber:number
StorehouseName:string
UpperDimension:string
}
interface IStockOutRequisition {
  OutCode: string,
  SKU: string,
  AttributeDescribe:string
  SizeDescribe:string
  AllOutNumber:number
  StockUnit:string
  outUnitName:string
  ReceiptorName:string
  operatorName:string
  operatorTime:string
  GoodsPositionStockInfos:IGoodsPositionStockInfos[]
  OutCodeSrc:string
  MaterialRequisitionCodeSrc:string
}

interface Props {
  isMaterialRequisition:boolean
  OutCodeSrc:string
  outVerify:boolean
  primaryClick:(back:() => void) => void
  closeClick:() => void
  OutCode:string|number
  Code:string|number
  AttributeDescribe:string
  SizeDescribe:string
  AllOutNumber:number
  StockUnit:string
  OutUnitNum:number
  outUnitName:string
  MaterialRequisitionCodeSrc:string
  ReceiptorName:string
  operatorName:string
  operatorTime:string
  StoresRequisitionInfo:IList|null,
  StorehouseStockInfo: StorehouseStockInfoType[]
}
const props = withDefaults(defineProps<Props>(), {
  isMaterialRequisition: false,
  OutCodeSrc: '',
  outVerify: false,
  primaryClick: () => null,
  closeClick: () => null,
  OutCode: '',
  Code: '',
  AttributeDescribe: '',
  SizeDescribe: '',
  AllOutNumber: 0,
  StockUnit: '',
  OutUnitNum: 0,
  outUnitName: '',
  MaterialRequisitionCodeSrc: '',
  StoresRequisitionInfoCode: '',
  ReceiptorName: '',
  operatorName: '',
  operatorTime: '',
  StoresRequisitionInfo: null,
});
const print = ref({
  id: 'print',
  preview: false,
});
const printBtn:Ref = ref(null);
const StockOutRequisition = ref<IStockOutRequisition|null>(null);
const OperatorTime = computed(() => {
  const temp = new Date(StockOutRequisition.value ? StockOutRequisition.value.operatorTime : props.operatorTime);
  const Hours = temp.getHours();
  const Minutes = temp.getMinutes();
  const str = `${temp.getFullYear()}年${temp.getMonth() + 1}月${temp.getDate()}日
  ${Hours <= 9 ? `0${Hours}` : Hours}:${Minutes <= 9 ? `0${Minutes}` : Minutes}`;
  return str;
});
const outPrimaryClick = () => {
  const back = () => {
    printBtn.value.ref.click();
  };
  props.primaryClick(back);
};
const initData = (data) => {
  const AttributeDescribe = `${props.StoresRequisitionInfo?.Name}`;
  // const SizeDescribe =
  StockOutRequisition.value = {
    SKU: props.StoresRequisitionInfo?.SKU || '',
    AttributeDescribe,
    SizeDescribe: props.StoresRequisitionInfo?.SizeName || '',
    AllOutNumber: props.StoresRequisitionInfo?.Number || 0,
    StockUnit: props.StoresRequisitionInfo?.Unit || '',
    ReceiptorName: data.HandlerName,
    operatorName: data.OperaterName,
    operatorTime: data.OperateTime,
    outUnitName: data.OutUnit,
    OutCode: data.OutCode,
    GoodsPositionStockInfos: data.GoodsPositionStockInfos,
    OutCodeSrc: '',
    MaterialRequisitionCodeSrc: '',
  };
  getQRCodeSrc(StockOutRequisition.value.OutCode || '', 120).then(res => {
    if (StockOutRequisition.value) {
      StockOutRequisition.value.OutCodeSrc = res || '';
    }
  });
  getQRCodeSrc(props.StoresRequisitionInfo?.Code || '', 120).then(res => {
    if (StockOutRequisition.value) {
      StockOutRequisition.value.MaterialRequisitionCodeSrc = res || '';
    }
  });
};
const open = () => {
  if (props.isMaterialRequisition) {
    api.getStockOutRequisition(props.StoresRequisitionInfo?.ID).then(res => {
      if (res?.data?.Status === 1000) {
        initData(res.data.Data);
      }
    });
  }
};
</script>
<style lang='scss'>
.material-requisition-dialog{
  .el-dialog__body{
    padding: 0;
  }
}
</style>
