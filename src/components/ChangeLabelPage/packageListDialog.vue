<template>
  <DialogContainerComp
    title="包裹列表"
    :visible='visible'
    :width="850"
    top="9vh"
    :closeClick="CloseClick"
    :appendToBody="true"
    :showPrimary="false"
    closeBtnText="关闭"
    class="change-label-common-dialog package-list-dialog"
    >
    <template #default>
      <div v-if="GetOrderInfo" class="dialog-main">
        <p class="order-id">
          <span>订单号：</span><span class="id">{{GetOrderInfo.OrderCode}}</span>
        </p>
        <el-table fit :data="GetOrderInfo?.PrintInfo?.Packages||[]" stripe border style="width: 100%; height: 550px;">
          <el-table-column min-width="254px" prop="ID" show-overflow-tooltip label="标签号"></el-table-column>
          <el-table-column min-width="147px" prop="Number" show-overflow-tooltip label="产品数量">
            <template #default="scope:any">
              {{scope.row.Number}}{{GetOrderInfo.Unit}}
            </template>
          </el-table-column>
          <el-table-column min-width="374px" prop="PublicKey" show-overflow-tooltip label="操作">
            <template #default="scope:any">
              <div class="re-label-box">
                <mp-button type="info" link @click="reLabel(scope.row)">
                  <i class="iconfont icon-zhongda"></i>重打标签
                </mp-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <p style="font-size: 20px;line-height: 25px;text-align: center;margin-top: 21px;">
          共 <span style="color: #3988FF; font-weight: 700;">{{ (GetOrderInfo?.PrintInfo?.Packages||[]).length }}</span> 个包裹
        </p>
      </div>
    </template>
  </DialogContainerComp>
</template>
<script lang="ts" setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { IGetOrderInfo } from '@/views/ChangeLabelPage/types';

const props = withDefaults(defineProps<{
  visible: boolean,
  GetOrderInfo: IGetOrderInfo|null
}>(), {
  visible: false,
});
const emit = defineEmits(['update:visible']);

const ChangeLabelStore = useChangeLabelStore();

const CloseClick = () => {
  emit('update:visible', false);
};
const reLabel = (item) => {
  ChangeLabelStore.packPrint(props.GetOrderInfo as IGetOrderInfo, [item]);
};
// const Closed = () => { };

</script>
<style lang="scss">
.package-list-dialog{
  .el-dialog__body{
    padding: 0 17px;
  }
  .dialog-main{
    >p{
      font-size: 26px;
      color: #444;
      padding-left: 41px;
      line-height: 38px;
      margin-top: 22px;
      >.id{
        color: #3988FF;
        font-size: 30px;
      }
    }
    .el-table{
      .el-table__header{
        .el-table__cell{
          padding-top: 15px;
          padding-bottom: 15px;
          background-color: #EEF5FC;
          .cell{
            font-size: 24px;
            font-weight: 400;
            line-height: 30px;
          }
          &::after{
            height: 24px;
            top: 18px;
          }
        }
      }
      .el-table__body{
        .re-label-box{
          text-align: left;
          padding: 0 30px;
        }
        .el-table__row--striped{
          .re-label-box{
            text-align: right;
          }
        }
        .el-table__row{
          &.el-table__row--striped{
            >td{
              background-color: #EEF5FC;
            }
          }
          .el-table__cell{
            height: 60px;
            .cell{
              font-size: 22px;
              line-height: 28px;
            }
          }
        }
      }
      .el-button{
        color: #444;
        font-size: 22px !important;
        i{
          font-size: 22px !important;
          color: #3988FF;
        }
      }
    }
  }
}
</style>
