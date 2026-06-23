<template>
  <DialogContainerComp
    title="打包设定"
    :visible='visible'
    :width="1050"
    top="10vh"
    :closeClick="CloseClick"
    :closed="Closed"
    :appendToBody="true"
    class="change-label-common-dialog pack-setting-dialog"
    >
    <template #default>
      <div>
        <div class="order-info-box"  v-if="GetOrderInfo">
          <ul>
            <li class="orderid"><span>订单号：</span><span class="id">{{GetOrderInfo.OrderCode}}</span><span class="product">（名片之家销售ERP）</span></li>
            <li class="right">销售端产品名称：{{GetOrderInfo.FirstLevel}}-{{GetOrderInfo.SecondLevel}}</li>
            <li>物料：{{GetOrderInfo.Materials.join('、')}}</li>
            <li class="right">尺寸：{{GetOrderInfo.Size}}</li>
            <li>内容：{{GetOrderInfo.Content}}</li>
          </ul>
          <template v-if="GetOrderInfo && GetOrderInfo.PrintInfo && GetOrderInfo.PrintInfo.Type !== 3 || !GetOrderInfo.PrintInfo">
            <p :class="{bigleft: !!GetOrderInfo?.PrintInfo}">订单数量：<span>{{GetOrderInfo.Number}}{{GetOrderInfo.Unit}}/款 {{GetOrderInfo.KindCount}}款</span>
              （共{{GetOrderInfo.Number*GetOrderInfo.KindCount}}{{GetOrderInfo.Unit}}）</p>
            <p :class="{bigleft: !!GetOrderInfo?.PrintInfo}">
              客户需求：<span v-if="GetOrderInfo.Requests && GetOrderInfo.Requests.length">{{GetOrderInfo.Requests.join('、')}}</span>
              <span class="button" @click="ChangeLabelStore.downloadFiles(GetOrderInfo.Files)" v-if="GetOrderInfo.Files && GetOrderInfo.Files.length">
                <i class="iconfont icon-xiazaidabaoxiangqing"></i> 打包明细
              </span>
            </p>
          </template>
          <p :class="{bigleft: !!GetOrderInfo?.PrintInfo}" class="way-packaging" v-if="!GetOrderInfo.PrintInfo">
            打包方式：
            <el-button @click="changeType(0)">
              <i class="iconfont icon-quanbudachengyibao" style="font-size: 24px;"></i> 全部打成一包
            </el-button>
            <el-button @click="changeType(1)">
              <i class="iconfont icon-ankuanshudabao" style="font-size: 24px;"></i> 按款数打包 <span>（共{{ GetOrderInfo.KindCount }}包）</span>
            </el-button>
          </p>
        </div>
        <div class="dashed-line" v-if="GetOrderInfo && GetOrderInfo.PrintInfo && GetOrderInfo.PrintInfo.Type !== 3 || !GetOrderInfo?.PrintInfo"></div>
        <!-- 未打印订单 -->
        <NoPrintDia v-if="GetOrderInfo && !GetOrderInfo?.PrintInfo" ref="NoPrintDiaRef" @closeDialog="CloseClick"></NoPrintDia>
        <!-- 自定义打印的订单 -->
        <UserDefinedDia v-else-if="GetOrderInfo && GetOrderInfo.PrintInfo && GetOrderInfo.PrintInfo.Type === 3" @closeDialog="CloseClick"></UserDefinedDia>
        <!-- 订单总数量 小于等于已打印数量 非自定义打包（全部打印） -->
        <PrintOverDia v-else-if="GetOrderInfo && GetOrderInfo.PrintInfo && orderAllNumber <= GetOrderInfo.PrintInfo.PrintNumber"></PrintOverDia>
        <!-- 打印未完成 非自定义打包 -->
        <ContinuePrintDia v-else @closeDialog="CloseClick"></ContinuePrintDia>
      </div>
    </template>
  </DialogContainerComp>
</template>
<script lang="ts" setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import NoPrintDia from './noPrintDia.vue';
import PrintOverDia from './printOverDia.vue';
import UserDefinedDia from './userDefinedDia.vue';
import ContinuePrintDia from './continuePrintDia.vue';

const emit = defineEmits(['closeDialog']);
const NoPrintDiaRef = ref<InstanceType<typeof NoPrintDia>>();
const ChangeLabelStore = useChangeLabelStore();
const { printDialogVisible, PrintPrintData, GetOrderInfo, orderAllNumber } = storeToRefs(ChangeLabelStore);

const CloseClick = () => {
  printDialogVisible.value = false;
};
const visible = computed({
  get() {
    return printDialogVisible.value;
  },
  set(val) {
    if (!val) {
      CloseClick();
    }
  },
});
const Closed = () => {
  PrintPrintData.value = {
    OrderID: '',
    Type: 0,
    PrintCount: 0,
    Number: 0,
    OperatorID: '',
  };
  GetOrderInfo.value = null;
  emit('closeDialog');
};

const changeType = (type) => {
  NoPrintDiaRef.value?.changeType(type);
};

</script>
<style lang="scss">
.pack-setting-dialog{
  .el-dialog__body{
    padding: 0 30px;
  }
  .el-dialog__footer{
    display: none;
  }
  .order-info-box{
    padding: 0 30px;
    color: #888888;
    >ul{
      display: flex;
      flex-wrap: wrap;
      margin-top: 28px;
      >li{
        width: 100%;
        width: 467px;
        white-space: nowrap; // （禁止换行）
        overflow: hidden; // （隐藏溢出内容）
        text-overflow: ellipsis; // （显示省略号）
        font-size: 16px;
        line-height: 20px;
        padding-top: 10px;
        box-sizing: border-box;
        &.orderid{
          font-size: 24px;
          .id{
            font-size: 30px;
            color: #3988FF;
          }
          .product{
            font-size: 14px;
          }
        }
        &.right{
          width: 462px;
          padding-left: 50px;
        }
      }
    }
    >p{
      padding-left: 110px;
      margin-top: 21px;
      font-size: 22px;
      &.bigleft{
        padding-left: 210px;
      }
      >span{
        color: #444;
        line-height: 30px;
      }
      .button{
        color: #3988FF;
        cursor: pointer;
        font-size: 20px;
        margin-left: 20px;
        >i{
          margin-right: 10px;
        }
      }
      &.way-packaging{
        line-height: 75px;
        >.el-button{
          height: 75px;
          min-width: 260px;
          border: 2px solid #3988FF;
          color: #3988FF;
          font-size: 26px;
          font-weight: 700;
          i{
            width: 0px;
            opacity: 0;
            transition: all .2s;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          &:hover{
            i{
              width: 1em;
              opacity: 1;
              display: inline;
            }
          }
          &+.el-button{
            margin-left: 60px;
          }
          >span>span{
            font-size: 18px;
            opacity: .5;
          }
        }
      }
    }
    margin-bottom: 21px;
  }
  .dashed-line{
    height: 0;
    border-bottom: 1px dashed #C9D4FB;
  }
}
</style>
