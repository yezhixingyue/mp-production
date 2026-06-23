<template>
  <div class="order-list-comp">
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
            <div class="content">{{item.Size}}</div>
          </li>
          <li>
            <div class="label">数量:</div>
            <div class="content">{{item.Number}}{{item.Unit}}/款 {{item.KindCount}}款
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
          <li style="width: 100%;">
            <div class="label">内容:</div>
            <div class="content" :title="item.Content">{{item.Content}}</div>
          </li>
        </ul>
        <p class="revocation">
          <el-button type="danger" link @click="RevocationOrder(item)">
            <i class="iconfont icon-chexiaodabao"></i>
            <p>撤销打包</p>
          </el-button>
        </p>
      </li>
      <li v-if="!PrintExpressList.length" style="background-color: unset; margin-top: 150px;">
        <el-empty description="无数据"  style="margin: 0 auto;"/>
      </li>
    </ul>
    <footer>
      <MpPagination
        :nowPage="ChangeLabelStore.getPrintListOptions.Page"
        :pageSize="ChangeLabelStore.getPrintListOptions.PageSize"
        :total="ChangeLabelStore.PrintExpressListTotal"
        :handlePageChange="PaginationChange">
        <template #text>
          <p style="font-size: 20px;">
            共计<span style="margin: 0 10px; font-weight: 700; color: #3988FF;">{{ ChangeLabelStore.PrintExpressListTotal }}</span>条
          </p>
        </template>
      </MpPagination>
    </footer>
  </div>
</template>
<script setup lang="ts">
import { IGetOrderInfo } from '@/views/ChangeLabelPage/types';
import MpPagination from '@/components/common/MpPagination.vue';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['seePackageList']);
const ChangeLabelStore = useChangeLabelStore();
const { PrintExpressList } = storeToRefs(ChangeLabelStore);
const RevocationOrder = (item: IGetOrderInfo) => {
  ChangeLabelStore.RevocationOrder(item, ChangeLabelStore.getPrintListOptions.Page);
};
const PaginationChange = (newValue) => {
  ChangeLabelStore.getPrintExpressList(newValue);
};
const seePackages = (item) => {
  emit('seePackageList', item);
};
</script>
<style lang="scss">
  .order-list-comp{
    // width: 100vw;
    // background-color: #fff;
    height: 100%;
    box-sizing: border-box;
    >footer{
      height: 90px;
      box-shadow: 0px -8px 15px 1px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .mp--pagination{
        justify-content: center;
        .el-pager{
          .number{
            font-size: 16px;

            &+.number{
              margin-left: 20px;
            }
          }
          .is-active{
            background-color: #3988FF;
            color: #fff;
            border-radius: 3px;
            width: 31px;
            height: 31px;
          }
        }
        .btn-prev, .btn-next{
          .el-icon{
            font-size: 20px;
          }
        }
      }
    }
    .order-list{
      padding: 20px 40px 20px 56px;
      box-sizing: border-box;
      overflow-y: auto;
      height: calc(100% - 90px);
      >li{
        height: 160px;
        font-size: 18px;
        background-color: #fff;
        display: flex;
        border-radius: 4px;
        &+li{
          margin-top: 20px;
        }
        >p{
          height: 100%;
          position: relative;
          &::after{
            content: '';
            display: inline-block;
            height: calc(100% - 20px);
            position: absolute;
            top: 10px;
            left: 0px;
            border-left: 1px dashed #C9D4FB;;
          }
        }
        .packageid{
          line-height: 60px;
          display: flex;
          flex-direction: column-reverse;
          justify-content: center;
          align-items: center;
          padding: 0 30px;
          width: 255px;
          font-size: 1;
          font-size: 16px;
          line-height: 20px;
          &::after{
            left: 100%;
            right: 0px;
          }
          .id{
            font-size: 28px;
            color: #3988FF;
            font-weight: 700;
            line-height: 35px;
            margin-top: 20px;
          }
        }
        .order-info{
          padding: 10px 30px 26px 26px;
          box-sizing: border-box;
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          >li{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 23px;
            width: 33.3%;
            margin-top: 15px;
            >.label{
              white-space: nowrap;
              background-color: #EEF5FC;
              border-radius: 14px;
              padding: 0 10px;
              margin-right: 10px;
              color: #687D9A;
            }
            >.content{
              .el-button{
                margin-left: 5px;
                color: #3988FF;
                font-size: 18px;
              }
              white-space: nowrap; /* 禁止换行 */
              overflow: hidden; /* 隐藏溢出 */
              text-overflow: ellipsis; /* 显示省略号 */
            }
          }
        }
        .revocation{
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 196px;
          >.el-button{
            font-size: 24px;
            font-weight: 700;
            color: #FF0023;
            i{
              font-size: 40px;
            }
            >span{
              display: flex;
              flex-direction: column;
              >p{
                margin-top: 10px;
              }
            }
          }
        }
      }
    }

  }
</style>
