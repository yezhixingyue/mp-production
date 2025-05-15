<template>
    <!-- 出库确认 -->
    <DialogContainerComp
    title="出库确认"
    :visible='outVerify'
    :primaryClick="outPrimaryClick"
    :closeClick="() => closeClick()"
    :primaryText="'打印并出库'"
    :closeBtnText="'取消出库'"
    :width="700"
    top="5vh"
    class="out-verify-dialog"
    >
    <template #default>
      <div id="print">
        <div style="padding:0 20px;">
          <div class="material-info" style="padding:0 20px;display: flex;display: flex;">
            <div style="width:150px; margin-top: 70px;">
              <div style="display: flex;width:120px;height:120px">
                <img style="width:120px;height:120px" :src="OutCodeSrc" alt="">
              </div>
              <span>出库编号:{{ OutCode }}</span>
            </div>
            <div class="material"
            style="line-height: 32px;font-size:16px;font-weight: 600; flex: 1;">
              <p style="margin-top:10px; line-height: 1.3em;">
                生产线：{{StoresRequisitionInfo?.ProductionLine}}
              </p>
              <p style="margin-top:10px; line-height: 1.3em;">
                大版ID：{{StoresRequisitionInfo?.PlateCode}}
              </p>
              <p style="display: flex;">
                <span style="min-width:70px;color:#7A8B9C; text-align: right;">SKU：</span>
                <span style="color:#7a8b9c;">{{Code}}</span>
              </p>
              <p style="display: flex;line-height: 1.3em;"><span style="min-width:70px;color:#7A8B9C; text-align: right;">物料：</span>
                <span style="color:#7a8b9c;">
                  {{AttributeDescribe}}
                </span>
              </p>
              <p style="display: flex;">
                <span style="width:70px;color:#7A8B9C; text-align: right;"></span>
                <span style="">{{SizeDescribe}}</span>
              </p>
              <div style="margin:5px 0">
                <p style="font-size: 14px;line-height: 16px;">出库位置：</p>
                <ul :style="`border: 1px solid #A6B6C6;border-radius: 8px;padding:0 3%;color:#566176`">
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
                </ul>
              </div>
              <p style="margin-top:10px; line-height: 1.3em;">
                出库数量：{{AllOutNumber}}
                  {{StockUnit}}
                  （{{OutUnitNum}} {{outUnitName}}）
              </p>
              <p style="margin-top:10px; line-height: 1.3em;">
                <span style="min-width:70px; text-align: right;">领料人：</span>
                <span style="">
                  {{ReceiptorName}}
                </span>
              </p>
              <p style="margin-top:10px; line-height: 1.3em;">
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
              <p style="font-size: 14px;text-align: right;margin-top: 10px; font-weight: 400;">
                <span>开单人：{{ operatorName }}</span>
                <span style="margin-left: 10px;">
                  开单时间：{{ OperatorTime }}
                </span>
              </p>
            </div>
          </div>
          <div style="border-bottom: 1px dashed #A6B6C6;height:18px;margin:20px 0;font-size: 12px;margin-top: 10px;">
            单据以上部分交接后即可回收
          </div>
          <div class="storehouse-stock" style="display: flex;padding:0 20px">
            <div v-if="StoresRequisitionInfo" style="width:120px; margin-top: 70px; margin-right: 30px;">
              <div>
                <img style="width:120px;height:120px" :src="MaterialRequisitionCodeSrc" alt="">
              </div>
              <span>领料编号:{{ StoresRequisitionInfo.Code }}</span>
            </div>
            <div style="display: flex;flex-direction: column;flex:1">

              <div style="line-height: 32px;font-size:16px;font-weight: 600;">
                <p style="margin-top:10px; line-height: 1.3em;">
                  生产线：{{StoresRequisitionInfo?.ProductionLine}}
                </p>
                <p style="margin-top:10px; line-height: 1.3em;">
                  大版ID：{{StoresRequisitionInfo?.PlateCode}}
                </p>
                <p style="display: flex;">
                  <span style="min-width:70px;color:#7A8B9C; text-align: right;">SKU：</span>
                  <span style="color:#7a8b9c;">{{Code}}</span>
                </p>
                <p style="display: flex;line-height: 1.3em;"><span style="min-width:70px;color:#7A8B9C; text-align: right;">物料：</span>
                  <span style="color:#7a8b9c;">
                    {{AttributeDescribe}}
                  </span>
                </p>
                <p style="display: flex;">
                  <span style="width:70px;color:#7A8B9C; text-align: right;"></span>
                  <span style="">{{SizeDescribe}}</span>
                </p>
                <p style="margin-top:10px; line-height: 1.3em;">
                  出库数量：{{AllOutNumber}}
                    {{StockUnit}}
                    （{{OutUnitNum}} {{outUnitName}}）
                </p>
                <p style="margin-top:10px; line-height: 1.3em;">
                  <span style="min-width:70px; text-align: right;">开数：</span>
                  <span style="">
                    {{ReceiptorName}}
                  </span>
                </p>
                <p style="margin-top:10px; line-height: 1.3em;">
                  <span style="min-width:70px; text-align: right;">开料数量：</span>
                  <span style="">
                    {{ReceiptorName}}
                  </span>
                </p>
                <p style="margin-top:10px; line-height: 1.3em;">
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
import { useRouter } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useStoresRequisition } from '@/store/modules/storesRequisition';
// import type { IMaterial, IList } from '@/store/modules/materialWarehouse/StoresRequisitionTypes';
import { useUserStore } from '@/store/modules/user';

interface Props {
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
  OutUnitNum:string
  outUnitName:string
  MaterialRequisitionCodeSrc:string
  ReceiptorName:string
  operatorName:string
  operatorTime:string
  StoresRequisitionInfo:{
    PlateCode:string
    Code:string
    ProductionLine:string
    ReceiveEquipment:{
      ClassName:string
      GroupName:string
      Name:string
    }
    SplitEquipment:{
      ClassName:string
      GroupName:string
      Name:string
    }
  }|null,
  StorehouseStockInfo: any
}
const props = withDefaults(defineProps<Props>(), {
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
  OutUnitNum: '',
  outUnitName: '',
  MaterialRequisitionCodeSrc: '',
  StoresRequisitionInfoCode: '',
  ReceiptorName: '',
  operatorName: '',
  operatorTime: '',
  StoresRequisitionInfo: null,
  StorehouseStockInfo: [],
});
const print = ref({
  id: 'print',
  preview: false,
});
const printBtn:Ref = ref(null);
const OperatorTime = computed(() => {
  const temp = new Date(props.operatorTime);
  const str = `${temp.getFullYear()}年${temp.getMonth() + 1}月${temp.getDate()}日 ${temp.getHours()}:${temp.getMinutes()}`;
  return str;
});
const outPrimaryClick = () => {
  const back = () => {
    printBtn.value.ref.click();
  };
  props.primaryClick(back);
};
</script>
<style lang='scss'>
</style>
