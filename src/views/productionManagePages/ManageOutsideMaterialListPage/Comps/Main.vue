<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="120px" prop="Server" label="销售端" />
      <mp-table-column width="130px" prop="OrderCode" label="订单ID" />
      <mp-table-column width="120px" prop="Line" label="生产线" />
      <mp-table-column min-width="120px" prop="Size" label="尺寸" />
      <mp-table-column width="100px" prop="_Number" label="数量" />
      <mp-table-column min-width="140px" prop="_CustomerInfo" label="客户（手机号）" />
      <mp-table-column width="125px" prop="_CreateTime" label="下单时间" />
      <mp-table-column width="140px" prop="_MaterialSource" label="物料来源">
        <template #default="scope:any">
          <span>{{ scope.row._MaterialSource }}</span>
          <mp-button v-if="scope.row.MaterialSource === PlaceOrderMaterialSourceEnum.homePickup "
           type="primary" class="ft-12 ml-10" link @click="onAddressDisplayClick(scope.row)">取料地址</mp-button>
        </template>
      </mp-table-column>
      <mp-table-column min-width="140px" prop="MaterialSize" label="物料尺寸" />
      <mp-table-column min-width="140px" prop="" label="下一道工序" class-name="red" />
      <mp-table-column width="125px" prop="_ReceiveTime" label="到货时间" />
      <mp-table-column width="100px" prop="Operator" label="操作人" />
      <mp-table-column width="85px" prop="_Status" label="状态" />
      <mp-table-column width="110px" label="操作">
        <template #default="scope:any">
          <mp-button type="primary" class="ft-12" v-if="scope.row.Status === ExternalMaterialStatusEnum.WaitingDelivery"
           link @click="onDeliveryClick(scope.row)">到货</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
    <AddressDisplayDialog v-model:visible="AddressVisible" :address="ActiveItem?.Address || null" />
    <DeliveryConfirmDialog v-model:visible="DeliveryVisible" @submit="onDeliverySubmit" />
  </main>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { IExternalMaterialDetail } from '../js/types';
import { ExternalMaterialStatusEnumList } from '../js/EnumList';
import { PlaceOrderMaterialSourceEnumList } from '../../ManualOrderHandlerPage/js/EnumList';
import { PlaceOrderMaterialSourceEnum } from '../../ManualOrderHandlerPage/js/enums';
import DeliveryConfirmDialog from './DeliveryConfirmDialog.vue';
import AddressDisplayDialog from './AddressDisplayDialog.vue';
import { ExternalMaterialStatusEnum } from '../js/enum';

const props = defineProps<{
  list: IExternalMaterialDetail[]
  loading: boolean
  handleDelivery:(item:IExternalMaterialDetail)=>void
}>();

const localList = computed(() => {
  const list = props.list.map(it => ({
    ...it,
    _Number: it.Number || it.Number === 0 ? `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit || ''}` : '',
    _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
    _CustomerInfo: `${it.Customer}(${it.Mobile})`,
    _MaterialSource: getEnumNameByID(it.MaterialSource, PlaceOrderMaterialSourceEnumList),
    _ReceiveTime: format2MiddleLangTypeDateFunc2(it.ReceiveTime),
    _Status: getEnumNameByID(it.Status, ExternalMaterialStatusEnumList),
  }));

  return list;
});

const ActiveItem = ref<null | IExternalMaterialDetail>(null);

/** 确认到货相关 */
const DeliveryVisible = ref(false);

const onDeliveryClick = (item: IExternalMaterialDetail) => { // 到货
  ActiveItem.value = item;
  DeliveryVisible.value = true;
};

const onDeliverySubmit = () => {
  if (!ActiveItem.value) return;
  props.handleDelivery(ActiveItem.value);
};

/** 取料地址展示相关 */
const AddressVisible = ref(false);

const onAddressDisplayClick = (item: IExternalMaterialDetail) => {
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
