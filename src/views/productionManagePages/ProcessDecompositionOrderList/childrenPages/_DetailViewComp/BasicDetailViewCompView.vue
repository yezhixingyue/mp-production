<template>
  <section class="pdo-basic-detail-wrap">
    <aside>
      <OrderIntro :rowOrder="rowItem" />
    </aside>
    <main>
      <!-- 详情 -->
      <template v-if="detail">
        <!-- 组合生产线自身 -->
        <InstanceDetail :item="detail" isCombine v-if="detail.WorkingList.length" />

        <!-- 实例列表 -->
        <ul>
          <li v-for="(it, i) in detail.InstanceList" :key="i">
            <InstanceDetail :item="it" :ColorList="detail.CraftResolve.ColorList"  />
          </li>
        </ul>
      </template>
    </main>
    <footer>
      <mp-button type='primary' v-if="showSubmit" @click="submit">提交</mp-button>
      <mp-button class="blue" @click="onBackClick">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { getGoBackFun } from '@/router';
import { IPDOrderItem, TCraftResolveDetail } from '../../types/types';
import OrderIntro from '../../components/OrderIntro.vue';
import InstanceDetail from './components/InstanceDetail.vue';

const props = defineProps<{
  detail: TCraftResolveDetail | null
  rowItem: IPDOrderItem
  showSubmit?: boolean
}>();

const emit = defineEmits(['submit', 'back']);

const submit = () => {
  emit('submit');
};

const onBackClick = () => {
  if (!props.showSubmit) {
    getGoBackFun();
    return;
  }

  emit('back');
};

</script>

<style scoped lang='scss'>
.pdo-basic-detail-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 15px 10px;
  background-color: #fff;
  overflow: hidden;
  display: grid;
  grid-template-columns: 336px 1fr;
  grid-template-rows: 1fr 75px;
  grid-template-areas:
    "aside main"
    "footer footer";

  > aside {
    grid-area: aside;
    border-right: 1px solid #888;
    padding-top: 20px;

    > ul {
      line-height: 30px;
    }
  }

  > main {
    grid-area: main;
    overflow: auto;
    padding-left: 20px;
    padding-top: 10px;
    // background-color: #f6f6f6;

    > ul {
      > li:last-of-type {
        > div {
          margin-bottom: 10px !important;
        }
      }
    }
  }
  > footer {
    text-align: center;
    grid-area: footer;
    padding-top: 15px;
    margin-top: 20px;

    button {
      width: 120px;
      height: 35px;
      margin: 0 30px;
    }
  }
}
</style>
