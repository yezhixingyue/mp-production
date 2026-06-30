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
          <el-table-column min-width="166px" prop="ID" show-overflow-tooltip label="标签号"></el-table-column>
          <el-table-column min-width="117px" prop="Number" show-overflow-tooltip label="数量">
            <template #default="scope:any">
              {{scope.row.Number}}{{GetOrderInfo.Unit}}
            </template>
          </el-table-column>
          <el-table-column min-width="127px" prop="PublicKey" show-overflow-tooltip label="操作">
            <template #default="scope:any">
              <mp-button type="info" link @click="reLabel(scope.row)">
                <i class="iconfont icon-zhongda"></i>重打标签
              </mp-button>
            </template>
          </el-table-column>
        </el-table>
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
