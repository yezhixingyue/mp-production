<template>
  <div class="user-defined-box">
    <div class="print-info">
      <div class="order-info"  v-if="GetOrderInfo">
        <p>订单数量： <span>{{GetOrderInfo.Number}}{{GetOrderInfo.Unit}}/款 {{GetOrderInfo.KindCount}}款</span>
          （共{{GetOrderInfo.Number*GetOrderInfo.KindCount}}{{GetOrderInfo.Unit}}）</p>
        <p>客户需求： <span v-if="GetOrderInfo.Requests && GetOrderInfo.Requests.length">{{GetOrderInfo.Requests.join('、')}}</span>
          <span class="button" @click="ChangeLabelStore.downloadFiles(GetOrderInfo.Files)" v-if="GetOrderInfo.Files && GetOrderInfo.Files.length" >
            <i class="iconfont icon-xiazaidabaoxiangqing"></i>打包明细
          </span>
        </p>
        <div class="print-type"><span>实际打包：</span>
          <div class="right">
            <p>自定义打包</p>
            <template v-if="!printIsOver">
              <p>剩余
                <span>{{ getNoPrintNum() }}</span>
                {{GetOrderInfo.Unit}}未打包</p>
            </template>
          </div>
        </div>
        <p class="over" v-if="printIsOver">已全部打印完毕！</p>
        <div class="print-input" v-else>
          <span>当前包内产品<br/>数量：</span>
          <div class="right">
            <el-input v-model="PrintPrintData.Number"></el-input>
            {{GetOrderInfo.Unit}}
          </div>
        </div>
      </div>
      <div class="print-list">
        <p>已打印{{GetOrderInfo?.PrintInfo?.Packages.length}}个标签</p>
        <el-table fit :data="GetOrderInfo?.PrintInfo?.Packages||[]" stripe border style="width: 100%; height: 350px;">
          <el-table-column min-width="166px" prop="ID" show-overflow-tooltip label="包裹号"></el-table-column>
          <el-table-column min-width="117px" prop="Number" show-overflow-tooltip label="内含数量"></el-table-column>
          <el-table-column min-width="127px" prop="PublicKey" show-overflow-tooltip label="操作">
            <template #default="scope:any">
              <mp-button type="info" link @click="RevocationPackage(scope.row.ID, scope.row.ServerID, scope.row.Number)">
                <i class="iconfont icon-chexiao"></i>撤销
              </mp-button>
            </template>
          </el-table-column>
          <template #empty>
            <div>
              <span>暂无数据</span>
            </div>
          </template>
        </el-table>
      </div>
    </div>
    <div class="btns">
      <span class="submit" @click="ChangeLabelStore.getPrintExpressPrint()" v-if="!printIsOver">打印标签</span>
      <span class="close-button" @click="closeDialog()">关闭</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import api from '@/api';

const emit = defineEmits(['closeDialog']);
const ChangeLabelStore = useChangeLabelStore();
const { PrintExpressList, PrintPrintData, GetOrderInfo, printIsOver } = storeToRefs(ChangeLabelStore);

const closeDialog = () => {
  emit('closeDialog');
};
const RevocationPackage = async (packageID, ServerID, Number) => {
  const resp = await api.changeLabelPageApis.getPackageRevocation(packageID, ServerID).catch(() => null);
  if (resp?.data?.isSuccess) {
    if (GetOrderInfo.value && GetOrderInfo.value?.PrintInfo) {
      GetOrderInfo.value.PrintInfo.Packages = GetOrderInfo?.value.PrintInfo?.Packages.filter(it => it.ID !== packageID);
      GetOrderInfo.value.PrintInfo.PrintNumber -= Number;
      PrintExpressList.value.forEach((it, index) => {
        if (it.ID === GetOrderInfo.value?.ID && PrintExpressList.value && PrintExpressList.value[index].PrintInfo && GetOrderInfo.value.PrintInfo) {
          PrintExpressList.value[index].PrintInfo.Packages = [...GetOrderInfo.value.PrintInfo.Packages];
          PrintExpressList.value[index].PrintInfo.PrintNumber = GetOrderInfo.value.PrintInfo.PrintNumber;
        }
      });
    }
  }
};
const getNoPrintNum = () => (GetOrderInfo.value?.KindCount || 1) * (GetOrderInfo.value?.Number || 1) - (GetOrderInfo.value?.PrintInfo?.PrintNumber || 0);
onMounted(() => {
  PrintPrintData.value.Type = 3;
});
</script>
<style lang="scss">
.user-defined-box{
  .print-info{
    display: flex;
    height: 425px;
    color: #888888;
    font-size: 22px;
    .order-info{
      width: 467px;
      padding-top: 15px;
      padding-right: 0;
      padding-left: 30px;
      >p{
        padding-left: 0;
        line-height: 30px;
        &+p{
          margin-top: 20px;
        }
        >span{
          font-size: 24px;
          &.button{
            color: #3988FF;
            cursor: pointer;
            font-size: 20px;
            margin-left: 20px;
            >i{
              margin-right: 10px;
            }
          }
        }
        &.over{
          margin-top: 70px;
          color: #52C41A;
          font-size: 41px;
          font-size: 700;
          >i{
            margin-right: 10px;
          }
        }
      }
      >div{
        margin-top: 20px;
        line-height: 45px;
        &.print-type{
          display: flex;
          >.right{
            color: #444;
            font-size: 35px;
            font-weight: 700;
            >p{
              >span{
                color: #3988FF;
              }
            }
          }
        }
        &.print-input{
          display: flex;
          margin-top: 30px;
          >span{
            width: 6em;
            text-align: right;
            line-height: 30px;
          }
          .right{
            line-height: 60px;
            .el-input{
              width: 200px;
              height: 60px;
              margin: 0 10px;
              font-size: 24px;
            }
          }
        }
      }
    }
    .print-list{
      box-sizing: border-box;
      padding-left: 48px;
      width: 493px;
      position: relative;
      >p{
        font-size: 20px;
        color: #444;
        line-height: 25px;
        display: flex;
        align-items: center;
        padding-top: 15px;
        padding-bottom: 20px;
        >img{
          width: 20px;
          height: 23px;
          margin-right: 10px;
        }
      }
      &::before{
        content: '';
        display: inline-block;
        height: 425px;
        width: 0;
        border-left: 1px dashed #C9D4FB;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  .btns{
    margin-top: 43px;
    padding-bottom: 65px;
    display: flex;
    justify-content: center;
    >span{
      display: inline-block;
      height: 60px;
      line-height: 60px;
      font-size: 30px;
      text-align: center;
      color: #3988FF;
      +span{
        margin-left: 346px;
      }
    }
    .submit{
      width: 240px;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
      background-color: #3988FF;
      &:hover{
        background-color: #79bbff;
      }
    }
  }
}
</style>
