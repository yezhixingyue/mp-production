<template>
  <div class="change-label-page">
    <div style="min-width: 1900px;">
      <Header :tabValue="tabValue" @changeTabValue="changeTabValue"/>
      <ScanInputComp @submit="submit" :submitText="tabValue === 1 ? '确定' : '搜索'"/>
      <main>
        <ThreeOrderComp @seePackageList="seePackageList" v-if="tabValue === 1"/>
        <OrderListComp @seePackageList="seePackageList" v-else/>
      </main>
      <PrintDialog @closeDialog="closeDialog"/>
      <PackageListDialog :GetOrderInfo="GetOrderInfo" v-model:visible="visible"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import Header from '@/components/ChangeLabelPage/header.vue';
import ScanInputComp from '@/components/ChangeLabelPage/scanInputComp.vue';
import ThreeOrderComp from '@/components/ChangeLabelPage/threeOrderComp.vue';
import OrderListComp from '@/components/ChangeLabelPage/orderListComp.vue';
import PrintDialog from '@/components/ChangeLabelPage/printDialog/index.vue';
import PackageListDialog from '@/components/ChangeLabelPage/packageListDialog.vue';
import { IGetOrderInfo } from '@/views/ChangeLabelPage/types';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';

let oInp: HTMLElement | null = document.querySelector('.scan-input-comp > .el-input input');

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const ChangeLabelStore = useChangeLabelStore();
const tabValue = ref(1);
const visible = ref(false);
const GetOrderInfo = ref<IGetOrderInfo|null>(null);
const changeTabValue = (val) => {
  tabValue.value = val;
  if (val === 1) { // 打包扫描（获取最近三个订单）
    ChangeLabelStore.getPrintListOptions.PageSize = 3;
    ChangeLabelStore.getPrintExpressList();
  } else { // 包裹列表 获取列表
    ChangeLabelStore.getPrintListOptions.PageSize = 20;
    ChangeLabelStore.getPrintExpressList();
  }
};
const PermissionPrintExpress = computed(() => user.value?.PermissionList.PermissionPrintExpress);
const submit = () => {
  if (!PermissionPrintExpress.value?.Obj.Print) return; // 没有打印权限则不查询
  // const FormatValue = getFormatValue();
  // if (FormatValue.length !== 13) {
  //   MpMessage.error('扫描失败', '包裹号错误');
  // } else
  if (tabValue.value === 1) { // 扫描
    ChangeLabelStore.getPrintExpressGetOrderInfo();
  } else { // 查询
    ChangeLabelStore.getPrintListOptions.KeyWords = ChangeLabelStore.scanInputValue.trim();
    // ChangeLabelStore.getPrintListOptions.KeyWords = FormatValue;
    ChangeLabelStore.getPrintExpressList();
  }
};
const seePackageList = (item: IGetOrderInfo) => {
  GetOrderInfo.value = item;
  visible.value = true;
};
const closeDialog = () => {
  if (!oInp) oInp = document.querySelector('.scan-input-comp > .el-input input');
  if (oInp) {
    oInp.focus();
  }
};
onMounted(() => {
  changeTabValue(1);
});
</script>
<style lang="scss">
.RevocationOrderMessageBox{
  width: 900px;
  max-width: 900px;
  padding: 0;
  margin-top: calc(50vh - 245px);
  .el-message-box__header{
    padding: 0;
  }
  .el-message-box__content{
    padding: 77px 50px 0 50px;
    .title{
      display: flex;
      justify-content: center;
      align-items: center;
      >i{
        font-size: 98px;
        line-height: 98px;
        color: #F9344F;
        margin-right: 15px;
      }
      p{
        font-size: 38px;
        font-weight: 700;
        line-height: 49px;
        &.order{
          font-size: 35px;
          font-weight: 400;
          line-height: 45px;
          margin-top: 4px;
        }
      }
    }
    .content{
      margin-top: 59px;
      background-color: #FFF1F3;
      border-radius: 4px;
      padding: 10px 30px;
      color: #FF0000;
      display: flex;
      font-size: 20px;
      >span{
        white-space: nowrap;
      }
      >div{
        >p{
          &::before{
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #FF0000;
            border-radius: 100%;
            margin: 0 8px;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  .el-message-box__btns{
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    padding: 30px;
    margin-top: 6px;
    .el-button{
      width: 220px;
      height: 60px;
      margin-left: 70px;
      font-size: 30px;
      border-color: #3988FF;
      color: #3988FF;
      &.el-button--primary{
        background-color: #3988FF;
        border-color: #3988FF;
        color: #fff;
        &:hover{
          background-color: #5c9cfc !important;
          border-color: #5c9cfc !important;
        }
      }
      &+.el-button{
        margin: 0;
      }
    }
  }
}
  .change-label-common-dialog{
    .el-dialog__header{
      height: 50px;
      padding-left: 30px;
      padding-top: 10px;
      padding-bottom: 10px;
      >p{
        line-height: 30px;
        font-size: 24px;
        font-weight: 700;
        color: #444;
        padding-left: 0;
        border: none;
      }
      &::after{
        width: calc(100% - 60px);
        left: 30px;
      }
    }
    .el-dialog__footer{
      .el-button{
        width: 220px;
        height: 60px;
        font-size: 30px;
      }
    }
  }
  .change-label-page{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #EEF5FC;
    z-index: 201;
    box-sizing: border-box;
    overflow-y: auto;
    >div{
      >main{
        height: calc(100vh - 80px - 130px);
        overflow-y: auto;
      }
    }
  }
</style>
