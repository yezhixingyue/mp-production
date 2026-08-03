<template>
  <div class="three-order-comp">
    <p class="first-few-title">
      <i></i>
      <span>
        <img src="@/assets/images/three-order.png" alt="" srcset="">
        上3个订单
      </span>
      <i></i>
    </p>
    <ul class="order-list">
      <li v-for="item in PrintExpressList" :key="item.ID">
        <p class="packageid">
          <span class="id">{{item.OrderCode}}</span>
          <span>名片之家销售ERP</span>
        </p>
        <ul class="order-info">
          <li>
            <div class="label">产品:</div>
            <div class="content" :title="`${item.FirstLevel}-${item.SecondLevel}`">{{item.FirstLevel}}-{{item.SecondLevel}}</div>
          </li>
          <li>
            <div class="label">物料:</div>
            <div class="content" :title="item.Materials.join('、')">{{item.Materials.join('、')}}</div>
          </li>
          <li>
            <div class="label">尺寸:</div>
            <div class="content" :title="item.Size">{{item.Size}}</div>
          </li>
          <li>
            <div class="label">数量:</div>
            <div class="content">{{item.Number}}{{item.Unit}} {{item.KindCount}}款
              <span class="is-gray">（共{{item.KindCount * item.Number}}{{item.Unit}}）</span>
            </div>
          </li>
          <li>
            <div class="label">客户需求:</div>
            <div class="content" :title="item.Requests.join('、')">{{item.Requests.join('、')}}</div>
          </li>
          <li>
            <div class="label">实际打包:</div>
            <div class="content">
              <template v-if="item.PrintInfo?.Type === 0">全部打成一包 (共{{ item.PrintInfo.Packages?.length }}包)</template>
              <template v-if="item.PrintInfo?.Type === 1">按款数打包 (共{{ item.PrintInfo.Packages?.length }}包)</template>
              <template v-if="item.PrintInfo?.Type === 2">均打包 (共{{ item.PrintInfo.Packages?.length }}包)</template>
              <template v-if="item.PrintInfo?.Type === 3">自定义打包 (共{{ item.PrintInfo.Packages?.length }}包)</template>
              <el-button link @click="seePackages(item)"><i class="iconfont icon-chakanbaoguoliebiao"></i> 查看包裹列表</el-button>
            </div>
          </li>
          <li>
            <div class="label">内容:</div>
            <div class="content lines" :title="item.Content">{{item.Content}}</div>
          </li>
        </ul>
        <p class="revocation">
          <el-button type="danger" link @click="RevocationOrder(item)">
            <i class="iconfont icon-chexiao"></i>
            撤销打包
          </el-button>
        </p>
      </li>
    </ul>
    <div class="print-again" v-if="PrintList.length">
      <el-button type="primary" color="#3988FF" @click="reprint">
        <i class="iconfont icon-zhongda"></i>
        重打最后一批标签（{{PrintList.length}}个）
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IGetOrderInfo } from '@/views/ChangeLabelPage/types';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['seePackageList']);
const ChangeLabelStore = useChangeLabelStore();
const { PrintExpressList, PrintList, _GetOrderInfo } = storeToRefs(ChangeLabelStore);
const RevocationOrder = (item: IGetOrderInfo) => {
  ChangeLabelStore.RevocationOrder(item);
};
const reprint = () => {
  ChangeLabelStore.packPrint(_GetOrderInfo.value as IGetOrderInfo, PrintList.value);
};
const seePackages = (item) => {
  emit('seePackageList', item);
};
</script>
<style lang="scss">
  .three-order-comp{
    // width: 100vw;
    // background-color: #fff;
    padding: 0 50px;
    box-sizing: border-box;
    .first-few-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 38px;
      padding-top: 30px;
      >i{
        flex: 1;
        display: inline-block;
        height: 1px;
        background-color: #D8D8D8;
      }
      span{
        font-size: 30px;
        font-weight: 700;
        margin: 0 15px;
        img{
          width: 42px;
          height: 36px;
        }
      }
    }
    .order-list{
      display: flex;
      // justify-content: space-between;
      width: 1805px;
      margin: 0 auto;
      margin-top: 30px;
      >li{
        width: 580px;
        min-width: 580px;
        height: 500px;
        font-size: 18px;
        background-image: url('@/assets/images/order-bg.png');
        background-size: 100% 100%;
        &+li{
          margin-left: 32px;
        }
        .packageid{
          line-height: 60px;
          display: flex;
          justify-content: space-between;
          color: #fff;
          padding: 0 30px;
          .id{
            font-size: 30px;
          }
        }
        .order-info{
          padding: 0 20px;
          padding-top: 20px;
          height: calc(100% - 80px - 60px);
          box-sizing: border-box;
          >li{
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            line-height: 23px;
            &+li{
              margin-top: 20px;
            }
            >.label{
              white-space: nowrap;
              background-color: #EEF5FC;
              border-radius: 14px;
              padding: 0 10px;
              margin-right: 10px;
              color: #687D9A;
            }
            >.content{
              white-space: nowrap; /* 防止文本换行 */
              overflow: hidden;    /* 隐藏溢出的内容 */
              text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
              &.lines{
                white-space: wrap;
                display: -webkit-box;
                -webkit-line-clamp: 2; /* 显示 2 行后省略 */
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .el-button{
                margin-left: 5px;
                color: #3988FF;
                font-size: 18px;
              }
            }
          }
        }
      }
    }
    .revocation{
      height: 80px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      >.el-button{
        font-size: 24px;
        font-weight: 700;
        color: #FF0023;
        i{
          font-size: 24px;
        }
      }
      &::after{
        content: '';
        display: inline-block;
        width: calc(100% - 40px);
        position: absolute;
        top: 0;
        left: 20px;
        border-top: 1px dashed #C9D4FB;;
      }
    }
    .print-again{
      text-align: right;
      margin-top: 50px;
      margin-bottom: 50px;
      .el-button{
        height: 54px;
        width: 360px;
        font-size: 24px;
        i{
          font-size: 24px;
        }
      }
    }
  }
</style>
