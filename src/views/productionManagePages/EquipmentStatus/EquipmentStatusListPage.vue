<template>
  <section class="wrap">
    <Header :classList="EquipmentStatusManagePageData.EquipmentClassList" v-model="EquipmentStatusManagePageData.curClassID" />
    <main>
      <canvas ref="canvas" width="800" height="500"></canvas>
      <HoverItemTooltips v-if="EquipmentStatusManagePageData._HoverItemData" :hoverItemInfo="EquipmentStatusManagePageData._HoverItemData" />
    </main>
    <footer>
      <span>
        <!-- 面板宽度： {{boardDraw.boardWidth}} -->
        当前设备 <i class="is-primary">{{EquipmentStatusManagePageData.listNumber}}</i> 个
      </span>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { EquipmentStatusManageClass } from './js/EquipmentStatusManageClass';
import Header from './Comps/EquipmentStatusHeader.vue';
import HoverItemTooltips from './Comps/HoverItemTooltips.vue';

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
    padding-right: 5px;
    position: relative;
    canvas {
      user-select: none;
    }
  }
  > footer {
    height: 45px;
    line-height: 44px;
    color: #444;
    font-size: 13px;
    text-align: right;
    padding-right: 80px;
  }
  > header, > footer {
    flex: none;
  }
}
</style>
