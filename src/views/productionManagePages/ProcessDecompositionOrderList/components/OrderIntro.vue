<template>
  <ul class="order-intro">
    <li>
      <span class="title">订单编号：</span>
      <span class="val">{{ rowOrder.OrderCode }}</span>
    </li>
    <li>
      <span class="title">产品名称：</span>
      <span class="val">{{ [rowOrder.FirstLevel, rowOrder.ProductName].filter((it) => it).join("-") }}</span>
    </li>
    <li :title="rowOrder.Content">
      <span class="title">文件内容：</span>
      <span class="val">{{ rowOrder.Content }}</span>
    </li>
    <li>
      <span class="title">款数数量：</span>
      <span class="val">{{ rowOrder.Number }}{{ rowOrder.Unit }}{{ rowOrder.KindCount }}款</span>
    </li>

    <li>
      <span class="title">成交价格：</span>
      <span class="val">{{ rowOrder.Fund.FinalPrice }}元</span>
    </li>
    <li>
      <span class="title">付款时间：</span>
      <span class="val">{{ format2MiddleLangTypeDateFunc2(rowOrder.PayTime) }}</span>
    </li>
    <li>
      <span class="title">预计完成：</span>
      <span class="val">{{ format2MiddleLangTypeDateFunc2(rowOrder.WishFinishTime) }}</span>
    </li>
    <li>
      <span class="title">配送方式：</span>
      <span class="val">{{ rowOrder.Address?.ExpressText }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IPDOrderItem } from '../types/types';

defineProps<{
  rowOrder: IPDOrderItem;
}>();
</script>

<style scoped lang="scss">
.order-intro {
  font-size: 13px;
  line-height: 25px;
  font-family: "Arial Negreta", "Arial Normal", Arial, sans-serif;

  > li {
    padding-left: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    .title {
      font-weight: 700;
    }
  }
}
</style>
