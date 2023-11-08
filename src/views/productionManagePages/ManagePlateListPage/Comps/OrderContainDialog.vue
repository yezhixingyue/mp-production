<template>
  <DialogContainerComp :visible='localVisible' :width='630' :title='`包含订单 [ 大版ID:${item?.Code} ]`' top='13vh' :show-primary="false" closeBtnText="关闭"
    @open='onOpen' @cancel='localVisible = false' @submit='submit'>
    <div class='dialog-content'>
      <el-table :data="orderList" stripe border class="row-ft-12" max-height="300" v-show="!loading">
        <mp-table-column width="180px" prop="ServerName" label="销售端" />
        <mp-table-column width="128px" prop="OrderCode" label="订单ID" />
        <mp-table-column prop="_SellSideProductName" label="销售端产品" />
      </el-table>
      <p v-show="loading" class="ft-12 is-gray">加载中...</p>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IManagePlateInfo } from '../js/type';
import { IManageOrderListItem } from '../../ManageOrderListPage/js/type';

const props = defineProps<{
  visible: boolean
  item: null | IManagePlateInfo
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const getSellSideProductName = (it: IManageOrderListItem) => {
  const { FirstLevel, SecondLevel, ProductName } = it;
  const list = [FirstLevel || '', SecondLevel || '', ProductName || ''];
  return list.filter(it => it).join('-');
};

const orderList = ref<IManageOrderListItem[]>([]);
const loading = ref(false);

const onOpen = async () => {
  orderList.value = [];

  if (props.item) {
    loading.value = true;
    const resp = await api.productionManageApis.getPlateOrderList(props.item.ID).catch(() => null);
    loading.value = false;

    if (resp?.data.isSuccess) {
      orderList.value = resp.data.Data.map(it => ({ ...it, _SellSideProductName: getSellSideProductName(it) }));
    }
  }
};

const submit = () => {
  console.log('submit  MpMessage.dialogSuccess');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 300px;
  max-height: 300px;
  overflow: auto;
  overflow: overlay;
  overflow: hidden;

  @include scroll;
}
</style>
