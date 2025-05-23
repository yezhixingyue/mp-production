<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="75px" prop="Code" label="编号" />
      <mp-table-column width="75px" prop="_TargetTypeText" label="类型" />
      <!-- <mp-table-column width="115px" prop="Server" label="销售端" /> -->
      <mp-table-column width="110px" prop="TargetCode" label="订单/大版ID" />
      <mp-table-column width="130px" prop="Line" label="生产线" />
      <mp-table-column width="160px" prop="Material" label="物料" />
      <!-- <mp-table-column min-width="120px" prop="Size" label="尺寸" /> -->
      <mp-table-column min-width="140px" prop="MaterialSize" label="物料尺寸" />
      <mp-table-column width="100px" prop="_Number" label="数量">
        <template #default="scope:any">
          {{ scope.row._Number }}<i style="color: #aaa;">({{ scope.row._NumberType }})</i>
        </template>
      </mp-table-column>
      <mp-table-column min-width="140px" prop="_CustomerInfo" label="客户（手机号）" />
      <mp-table-column width="125px" prop="_CreateTime" label="下单时间" />
      <mp-table-column width="120px" prop="_MaterialSource" label="物料来源">
        <template #default="scope:any">
          <span>{{ scope.row._MaterialSource }}</span>
          <mp-button v-if="scope.row.MaterialSource === PlaceOrderMaterialSourceEnum.homePickup "
           type="primary" class="ft-12 ml-10" link @click="onAddressDisplayClick(scope.row)">取料地址</mp-button>
        </template>
      </mp-table-column>
      <mp-table-column min-width="120px" prop="_NextWorkingText" label="下一道工序" class-name="red" />
      <mp-table-column width="125px" prop="_ReceiveTime" label="到货时间" />
      <mp-table-column width="100px" prop="Operator" label="操作人" />
      <mp-table-column width="75px" prop="_Status" label="状态" />
      <mp-table-column width="100px" label="操作">
        <template #default="scope:any">
          <mp-button type="primary" class="ft-12" v-if="localPermission?.Receive && scope.row.Status === ExternalMaterialStatusEnum.WaitingDelivery"
           link @click="onDeliveryClick(scope.row)">到货</mp-button>
          <mp-button type="primary" class="ft-12"
           v-if="localPermission?.Print && [ExternalMaterialStatusEnum.HaveDelivery, ExternalMaterialStatusEnum.Received].includes(scope.row.Status)"
           link @click="onPrintClick(scope.row)">打印</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
    <AddressDisplayDialog v-model:visible="AddressVisible" :address="ActiveItem?.Address || null" />
    <DeliveryConfirmDialog v-model:visible="DeliveryVisible" @submit="onDeliverySubmit" />
    <PrintDialog v-model:visible="printVisible" :curRow="ActiveItem"  />
  </main>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { IExternalMaterialDetail } from '../js/types';
import { PlaceOrderMaterialSourceEnum } from '../../ManualOrderHandlerPage/js/enums';
import DeliveryConfirmDialog from './DeliveryConfirmDialog.vue';
import AddressDisplayDialog from './AddressDisplayDialog.vue';
import { ExternalMaterialStatusEnum } from '../js/enum';
import PrintDialog from './PrintDialog.vue';
import { formatTableList } from '../js/formatTableList';

const props = defineProps<{
  list: IExternalMaterialDetail[]
  loading: boolean
  handleDelivery:(item:IExternalMaterialDetail)=>void
}>();

const localList = computed(() => formatTableList(props.list));

const ActiveItem = ref<null | ReturnType<typeof formatTableList>[number]>(null);

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionExternalMaterial.Obj);

/** 确认到货相关 */
const DeliveryVisible = ref(false);

const onDeliveryClick = (item: ReturnType<typeof formatTableList>[number]) => { // 到货
  ActiveItem.value = item;
  DeliveryVisible.value = true;
};

const onDeliverySubmit = () => {
  if (!ActiveItem.value) return;
  props.handleDelivery(ActiveItem.value);
};

/** 打印相关 */
const printVisible = ref(false);
const onPrintClick = (item: ReturnType<typeof formatTableList>[number]) => {
  ActiveItem.value = item;
  printVisible.value = true;
};

/** 取料地址展示相关 */
const AddressVisible = ref(false);

const onAddressDisplayClick = (item: ReturnType<typeof formatTableList>[number]) => {
  ActiveItem.value = item;
  AddressVisible.value = true;
};

</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    .cell {
      padding: 0 6px;

      button {
        padding: 0;
        position: relative;
        top: -1px;
      }
    }

    &.red {
      .cell {
        color: #ff0000;
        font-weight: 700;
      }
    }
  }
}
</style>
