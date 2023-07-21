<template>
  <li v-if="ManualOrderHandlerPageData">
    <label class="title" for="">来源:</label>
    <el-radio-group v-model="ManualOrderHandlerPageData.source.isManual">
      <el-radio :label="true">手动下单</el-radio>
      <el-radio :label="false">销售系统引入</el-radio>
    </el-radio-group>
  </li>
  <li v-if="ManualOrderHandlerPageData" v-show="disabledAll">
    <label class="title" for="">订单号:</label>
    <el-select v-model="ManualOrderHandlerPageData.source.serverID"  placeholder="请选择转换服务器"
        class="mr-10" @change="onServerIDChange">
      <el-option
        v-for="item in ManualOrderHandlerPageData.ConvertServerList"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID"
      />
    </el-select>
    <el-input :disabled="!ManualOrderHandlerPageData.source.serverID && ManualOrderHandlerPageData.source.serverID !== 0" class="mr-10"
      @focus="onInpFocus" @blur="onInpBlur"
      v-model.trim="ManualOrderHandlerPageData.source.orderID" maxlength="20" placeholder="请输入订单号" @keyup.enter="onSearchClick"></el-input>
    <mp-button :disabled="!ManualOrderHandlerPageData.source.orderID" style="height: 28px;width: 65px;" @click="onSearchClick"
      type="primary" size="small">检索</mp-button>
  </li>
  <li v-if="ManualOrderHandlerPageData" v-show="disabledAll">
    <!-- <label class="title" for="">订单信息:</label> -->
    <div style="display: inline-block;line-height: 30px;">
      <p class="is-gray" style="margin-left: 132px;" v-if="!ManualOrderHandlerPageData.source.sourceOrderData">
        <template v-if="loading">加载中...</template>
        <template v-else>暂无数据，请检索订单信息</template>
      </p>
      <table v-else border="0" cellpadding="0" cellspacing="0" class="detail-table">
        <tbody>
          <tr>
            <td>发货时间:</td>
            <td>{{ formatData?.date || '' }}</td>
          </tr>
          <tr>
            <td>客户名称:</td>
            <td>{{ ManualOrderHandlerPageData.source.sourceOrderData.Customer.CustomerName }}</td>
          </tr>
          <tr>
            <td>客户手机号:</td>
            <td>{{ ManualOrderHandlerPageData.source.sourceOrderData.Customer.Mobile }}</td>
          </tr>
          <tr>
            <td>配送方式:</td>
            <td>{{ ManualOrderHandlerPageData.source.sourceOrderData.Address.ExpressText }}</td>
          </tr>
          <tr>
            <td>收货地址:</td>
            <td>{{ formatData?.address || '' }}</td>
          </tr>
          <tr>
            <td>收货人:</td>
            <td>{{ ManualOrderHandlerPageData.source.sourceOrderData.Address.Address.Consignee }}</td>
          </tr>
          <tr>
            <td>收货人手机号:</td>
            <td>{{ ManualOrderHandlerPageData.source.sourceOrderData.Address.Address.Mobile }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </li>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ManualOrderHandlerPageData } from '../../js';

defineProps<{
  disabledAll: boolean,
}>();

const formatData = computed(() => {
  if (!ManualOrderHandlerPageData.value?.source.sourceOrderData) return null;
  const { Address, ProducePeriod } = ManualOrderHandlerPageData.value.source.sourceOrderData;
  const { ExpressArea, AddressDetail } = Address.Address;
  const { RegionalName, CityName, CountyName } = ExpressArea || {};
  const address = [RegionalName, CityName, CountyName, AddressDetail].filter(it => it).join('');

  const date = format2LangTypeDate(ProducePeriod?.ShiftTime || '');

  return { address, date };
});

const onServerIDChange = () => {
  if (ManualOrderHandlerPageData.value) {
    ManualOrderHandlerPageData.value.source.orderID = '';
    ManualOrderHandlerPageData.value.source.sourceOrderData = null;
  }
};

const inpFocusValue = ref<string | number>('');
const onInpFocus = () => {
  inpFocusValue.value = ManualOrderHandlerPageData.value?.source.orderID || '';
};
const onInpBlur = () => {
  if (ManualOrderHandlerPageData.value && inpFocusValue.value !== ManualOrderHandlerPageData.value.source.orderID) {
    ManualOrderHandlerPageData.value.source.sourceOrderData = null;
  }
};

const loading = ref(false);
const onSearchClick = async (e: MouseEvent) => {
  if ((e.target as HTMLInputElement).tagName === 'INPUT') {
    (e.target as HTMLInputElement).blur();
  }
  if (ManualOrderHandlerPageData.value?.source.orderID) {
    if (/^\d+$/.test(ManualOrderHandlerPageData.value.source.orderID)) {
      loading.value = true;
      await ManualOrderHandlerPageData.value.getSourceOrderInfo();
      loading.value = false;
    } else {
      MpMessage.error('检索失败', '订单号格式输入不正确');
    }
  }
};

</script>

<style scoped lang='scss'>
.detail-table {
  // width: 388px;
  border-collapse: collapse;
  tr {
    td {
      // border: 1px solid #ddd;
      // padding: 9px 0;
      padding-bottom: 18px;
      line-height: 24px;
      &:first-of-type {
        width: 120px;
        text-align: right;
        padding-right: 10px;
      }
    }
  }
}
</style>
