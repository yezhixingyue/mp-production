<template>
  <div class="first-panel-wrap" v-if="ManualOrderHandlerPageData">
    <h2>订单信息</h2>
    <ul>
      <FirstStepPanelOrderSearch :disabledAll="disabledAll" />
      <li v-show="!disabledAll">
        <label class="title" for="">发货时间:</label>
        <MpDateTimePicker v-model="ManualOrderHandlerPageData.CreateOrderInfo.ProducePeriod.ShiftTime" withTime disabledBeforeToday :disabled="disabledAll" />
      </li>
      <li v-show="!disabledAll">
        <label class="title" for="">客户名称:</label>
        <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Customer.CustomerName" maxlength="20" :disabled="disabledAll"></el-input>
      </li>
      <li v-show="!disabledAll">
        <label class="title" for="">手机号:</label>
        <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Customer.Mobile" maxlength="11" :disabled="disabledAll"></el-input>
      </li>
      <li v-show="!disabledAll">
        <label class="title" for="">交货方式:</label>
        <el-radio-group v-model="ManualOrderHandlerPageData.CreateOrderInfo.ReceiveType" :disabled="disabledAll">
          <el-radio v-for="it in ReceiveTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li v-show="showAddress && !disabledAll">
        <label class="title" for="">收货地址:</label>
        <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Address.Address.AddressDetail" maxlength="60"
         :disabled="disabledAll" class="address"></el-input>
      </li>
      <li v-show="showAddress && !disabledAll">
        <label class="title" for="">收货人:</label>
        <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Address.Address.Consignee" maxlength="10" :disabled="disabledAll"></el-input>
        <span class="m">手机号:</span>
        <el-input v-model.trim="ManualOrderHandlerPageData.CreateOrderInfo.Address.Address.Mobile" maxlength="11" :disabled="disabledAll"></el-input>
      </li>
      <li v-show="showExpress && !disabledAll">
        <label class="title" for="">指定物流/快递:</label>
        <el-select v-model="ManualOrderHandlerPageData.CreateOrderInfo.Address.Express.Second" @change="onExpressChange" :disabled="disabledAll">
          <el-option v-for="item in ManualOrderHandlerPageData.ExpressList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
        <!-- <i class="remark">(选填)</i> -->
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import MpDateTimePicker from '@/components/common/ElementPlusContainners/MpDateTimePicker/MpDateTimePicker.vue';
import { ManualOrderHandlerPageData } from '../../js';
import { ReceiveTypeEnumList } from '../../js/EnumList';
import { ReceiveTypeEnum } from '../../js/enums';
import FirstStepPanelOrderSearch from './FirstStepPanelOrderSearch.vue';

const showAddress = computed(() => {
  if (!ManualOrderHandlerPageData.value || ManualOrderHandlerPageData.value.CreateOrderInfo.ReceiveType === '') return false;
  const _list = [ReceiveTypeEnum.logisticsExpress, ReceiveTypeEnum.homeDelivery];
  return _list.includes(ManualOrderHandlerPageData.value.CreateOrderInfo.ReceiveType);
});

const showExpress = computed(() => ManualOrderHandlerPageData.value?.CreateOrderInfo.ReceiveType === ReceiveTypeEnum.logisticsExpress);

const disabledAll = computed(() => ManualOrderHandlerPageData.value?.source.isManual === false);

const onExpressChange = (id: number) => {
  if (!ManualOrderHandlerPageData.value) return;
  const t = ManualOrderHandlerPageData.value.ExpressList.find(it => it.ID === id);
  ManualOrderHandlerPageData.value.CreateOrderInfo.Address.ExpressText = t?.Name || '';
};

</script>

<style lang='scss'>
.first-panel-wrap {
  font-size: 12px;
  width: 520px;
  > h2 {
    text-align: center;
    font-size: 22px;
    margin-top: 20px;
    margin-bottom: 40px;
  }
  > ul {
    > li {
      margin-bottom: 15px;
      > label.title {
        display: inline-block;
        width: 10em;
        text-align: right;
        line-height: 30px;
        margin-right: 10px;
        vertical-align: top;
      }
      .el-input {
        width: 140px;
      }
      .address {
        width: 290px;
      }
      .m {
        margin: 0 10px;
      }
      .el-select {
        width: 140px;
      }
      .remark {
        margin-left: 10px;
        color: #888;
      }
    }
  }
}
</style>
