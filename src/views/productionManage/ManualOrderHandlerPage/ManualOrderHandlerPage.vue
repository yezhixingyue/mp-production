<template>
  <section class="wrap">
    <Header :step="curStep" :stepList="stepList" />
    <main>
      main
    </main>
    <Footer :step="curStep" :stepList="stepList" @prev="onPrevClick" @next="onNextClick" />
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import Header from './Comps/Header.vue';
import Footer from './Comps/Footer.vue';
import { PlaceStepEnum } from './js/enums';

const stepList = [
  { ID: PlaceStepEnum.First, Name: '填写订单信息' },
  { ID: PlaceStepEnum.Second, Name: '设置生产工序' },
  { ID: PlaceStepEnum.Third, Name: '报价汇总' },
  { ID: PlaceStepEnum.Fourth, Name: '下单完成' },
];
const curStep = ref(PlaceStepEnum.First);
const _BackingData = ref(null); // 是否记录回退时的数据 以进行比对？ 或许可在任何数据变动时都对该值赋值null 或 false (设置监听函数来触发？)

const onPrevClick = () => {
  // 简单回退即可？如果需要比对 则要记录_BackingData  后续看是否其它数据辅助
  console.log('onPrevClick', _BackingData.value);
};

const onNextClick = () => { // 下一步 需要校验当前步是否完成 并且根据情况生成下一步数据
  // 如果回退后没操作的情况呢 是否需要比对
  console.log('onNextClick', _BackingData.value);
};

</script>

<script lang="ts">
export default {
  name: 'ManualOrderHandlerPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    flex: none;
    padding: 20px 0;
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
    padding: 10px 0;
  }
  > footer {
    flex: none;
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #d4d4d4;
    :deep(.mp-button) {
      width: 120px;
      height: 35px;
      & + .mp-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
