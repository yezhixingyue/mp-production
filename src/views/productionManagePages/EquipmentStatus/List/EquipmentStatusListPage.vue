<template>
  <section class="wrap">
    <Header :classList="EquipmentStatusManagePageData.EquipmentClassList" v-model="EquipmentStatusManagePageData.curClassID" />
    <main>
      <canvas ref="canvas" width="800" height="500" v-show="EquipmentStatusManagePageData.list.length > 0"></canvas>
      <HoverItemTooltips v-if="EquipmentStatusManagePageData._HoverItemData" :hoverItemInfo="EquipmentStatusManagePageData._HoverItemData" />
      <el-empty v-show="!EquipmentStatusManagePageData.loading && EquipmentStatusManagePageData.list.length === 0" description="暂无设备" />
    </main>
    <footer>
      <span>
        当前设备 <i class="is-primary">{{EquipmentStatusManagePageData.listNumber}}</i> 个
      </span>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import {
  onActivated, onDeactivated, onMounted, onUnmounted, ref,
} from 'vue';
import { EquipmentStatusManageClass } from './js/EquipmentStatusManageClass';
import Header from './Comps/EquipmentStatusHeader.vue';
import HoverItemTooltips from './Comps/HoverItemTooltips.vue';

const canvas = ref<InstanceType<typeof HTMLCanvasElement>>();

const EquipmentStatusManagePageData = ref(new EquipmentStatusManageClass());

onMounted(() => {
  EquipmentStatusManagePageData.value.init(canvas.value);
});

let num = 0;

onActivated(() => {
  const key = sessionStorage.getItem('refreshEquipmentStatusList');
  EquipmentStatusManagePageData.value.setInterval4List(key === 'True' || (num && (Date.now() - num) > 30 * 1000) || false);
  sessionStorage.removeItem('refreshEquipmentStatusList');
});

onDeactivated(() => {
  num = Date.now();
  EquipmentStatusManagePageData.value.clearInterval4List();
});

onUnmounted(() => {
  EquipmentStatusManagePageData.value.clearInterval4List();
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

    :deep(.el-empty) {
      padding-top: 15vh;
      padding-right: 50px;

      .el-empty__description p {
        font-size: 13px;
      }
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
