<template>
  <div class="fourth-panel-wrap" v-if="ManualOrderHandlerPageData">
    <h2>
      <el-icon><CircleCheckFilled /></el-icon>
      <span>下单成功</span>
    </h2>
    <p>订单ID：{{ ManualOrderHandlerPageData.CreateOrderInfo.OrderID }}</p>
    <p>预计完成时间：{{ format2MiddleLangTypeDateFunc2(ManualOrderHandlerPageData.CreateOrderInfo.ProducePeriod.ShiftTime) }}</p>
    <h4>加工费：{{ ManualOrderHandlerPageData.CreateOrderInfo.Funds.FinalPrice }}元</h4>
    <h4>运费：{{ ManualOrderHandlerPageData.CreateOrderInfo.Funds.Freight }}元</h4>
    <h4>合计：<i class="is-pink">{{ totalPrice }}</i>元</h4>
    <div class="btns">
      <mp-button type="primary" class="gradient" @click="onCreateNewClick">再来一单</mp-button>
      <mp-button class="blue" @click="onCloseClick">关闭页面</mp-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLayoutStore } from '@/store/modules/layout/index';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { ManualOrderHandlerPageData } from '../../js';
import { ManualOrderHandlerPageClass } from '../../js/ManualOrderHandlerPageClass';

const totalPrice = computed(() => {
  if (!ManualOrderHandlerPageData.value) return '';

  const { FinalPrice, Freight } = ManualOrderHandlerPageData.value.CreateOrderInfo.Funds;

  const _FinalPrice = +FinalPrice || 0;
  const _Freight = +Freight || 0;
  const num = _FinalPrice + _Freight;

  return +num.toFixed(1);
});

const router = useRouter();

const onCloseClick = () => {
  const LayoutStore = useLayoutStore();

  const tabs = LayoutStore.editableTabs;
  let activeName = LayoutStore.editableTabsValue;
  const itemName = activeName;

  if (activeName === itemName) {
    tabs.forEach((tab, index) => {
      if (tab.name === itemName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }
  LayoutStore.removeTabItem(itemName || '1');

  const t = LayoutStore.editableTabs.find((it) => it.name === activeName);
  if (t) {
    LayoutStore.setEditableTabsValue(t.name);
    LayoutStore.setLeftMenuDefaultActive(t.name);
    router.push(t.path);
  }
};

const onCreateNewClick = () => {
  const temp = ManualOrderHandlerPageData.value;
  ManualOrderHandlerPageData.value = new ManualOrderHandlerPageClass(temp || undefined);
};

</script>

<style scoped lang='scss'>
.fourth-panel-wrap {
  width: 500px;
  text-align: center;
  padding-top: 70px;

  > h2 {
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-size: 30px;
    color: #52C41A;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 8px;
    i {
      font-size: 55px;
      margin-right: 10px;
    }
  }
  > p {
    font-size: 16px;
    margin-top: 2px;
  }
  > h4 {
    font-size: 20px;
    margin-top: 10px;
  }
  > div.btns {
    margin-top: 30px;
    button {
      width: 120px;
      height: 35px;
      border-radius: 4px;
      & + button {
        margin-left: 30px !important;
      }
    }
  }
}
</style>
