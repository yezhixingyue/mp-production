<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   title='包裹列表'
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @closed="onClosed"
   :showPrimary="false"
   closeBtnText="关闭"
   class="pack-list-dialog"
   >
    <template #default>
      <div  class="dialog-main">
        <p class="order-id" style="font-size: 20px;">
          <span>订单号：</span><span style="color: #3988FF;font-weight: 700;">{{orderID}}</span>
        </p>
        <el-table v-if="GetOrderInfo" fit :data="GetOrderInfo?.PrintInfo?.Packages||[]" stripe border style="width: 100%; height: 500px;">
          <el-table-column min-width="166px" prop="ID" show-overflow-tooltip label="标签号"></el-table-column>
          <el-table-column min-width="117px" prop="Number" show-overflow-tooltip label="数量">
            <template #default="scope:any">
              {{scope.row.Number}}{{GetOrderInfo.Unit}}
            </template>
          </el-table-column>
          <el-table-column min-width="117px" prop="Number" show-overflow-tooltip label="打包时间">
            <template #default="scope:any">
              {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
            </template>
          </el-table-column>
        </el-table>
        <div v-else>
          <el-empty description="暂无数据" />
        </div>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IGetOrderInfo } from '@/views/ChangeLabelPage/types';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';

const props = defineProps<{
  visible: boolean
  orderID: string
}>();

const emit = defineEmits(['update:visible']);

const GetOrderInfo = ref<IGetOrderInfo|null>(null);
const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const onOpen = async () => {
  const resp = await api.changeLabelPageApis.getPrintExpressList({ Page: 1, KeyWords: `${props.orderID}-0001`, PageSize: 2 }).catch(() => null);
  if (resp?.data?.isSuccess) {
    GetOrderInfo.value = resp.data.Data || resp.data.Data[0] ? resp.data.Data[0] as IGetOrderInfo : null;
  }
};
const onClosed = async () => {
  GetOrderInfo.value = null;
};

</script>

<style lang='scss'>
.pack-list-dialog{
  .el-dialog__body{
    padding-top: 15px;
  }
}
</style>
