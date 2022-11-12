<template>
  <section class="wrap">
    <Header :classList="EquipmentStatusManagePageData.EquipmentClassList" v-model="EquipmentStatusManagePageData.curClassID" />
    <main>
      <canvas ref="canvas" width="800" height="500"></canvas>
    </main>
    <footer>
      <span>
        <!-- 面板宽度： {{boardDraw.boardWidth}} -->
        当前机器 <i class="is-primary">{{EquipmentStatusManagePageData.listNumber}}</i> 个
      </span>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { EquipmentStatusManageClass } from './js/EquipmentStatusManageClass';
import Header from './Comps/EquipmentStatusHeader.vue';

const canvas = ref<InstanceType<typeof HTMLCanvasElement>>();

const EquipmentStatusManagePageData = ref(new EquipmentStatusManageClass());

onMounted(() => {
  EquipmentStatusManagePageData.value.init(canvas.value);
});

</script>

<script lang="ts">
export default {
  name: 'EquipmentStatusListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  background-color: #fff;
  height: 100%;
  color: #444;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  > main {
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    // canvas {
      // min-height: 100%;
      // min-width: 100%;
      // width: 100%;
      // height: 100%;
      // border: 1px solid #e5e5e5;
      // box-sizing: border-box;
    // }
  }
  > footer {
    height: 45px;
    line-height: 44px;
    color: #444;
    font-size: 13px;
    text-align: right;
    padding-right: 160px;
  }
  > header, > footer {
    flex: none;
  }
}
</style>
