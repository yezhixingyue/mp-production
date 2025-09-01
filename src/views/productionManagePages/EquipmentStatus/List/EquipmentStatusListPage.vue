<template>
  <section class="mp-prod-condition-prop-select-dialogwrap">
    <Header :classList="EquipmentStatusManagePageData.EquipmentClassList" v-model="EquipmentStatusManagePageData.curClassID" />
    <main ref="oWrap">
      <ul class="left-list" v-show="leftInfoList.length" :style="`padding-top: ${TOPWHITESPACE}px;width:${TITLEWIDTH}px`" @mouseleave="curTitleItem = null">
        <li
          v-for="it in leftInfoList" :key="it.Equipment.ID"
          class="left-item"
          :style="`
            height: ${RowHeight}px;
            background-color:${curTitleItem?.Equipment.ID === it.Equipment.ID
               ? curTitleItem?._EquipmentTaskStatusEnumitem?.HoverColor : it._EquipmentTaskStatusEnumitem?.Color}
          `"
          @mouseenter.prevent="curTitleItem = it"
         >
          <div class="l" :style="`width:${TITLELEFTWIDTH}px`">
            <span>{{ it.Equipment.ClassName }}</span>
            <span>{{ it.Equipment.GroupName }}</span>
          </div>
          <h2>{{ it.Equipment.Name }}</h2>
        </li>
      </ul>
      <div class="canvas-box">
        <canvas ref="canvas" width="800" height="500" v-show="EquipmentStatusManagePageData.list.length > 0"></canvas>
      </div>
      <HoverItemTooltips v-if="leftHoverItem || EquipmentStatusManagePageData._HoverItemData" :isLeftUse="!!leftHoverItem"
       :hoverItemInfo="(leftHoverItem || EquipmentStatusManagePageData._HoverItemData)!" />
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
  computed, onActivated, onDeactivated, onMounted, onUnmounted, ref, watchEffect,
} from 'vue';
import { EquipmentStatusManageClass } from './js/EquipmentStatusManageClass';
import Header from './Comps/EquipmentStatusHeader.vue';
import HoverItemTooltips from './Comps/HoverItemTooltips.vue';
import {
  RowHeight, TOPWHITESPACE, TITLEWIDTH, TITLELEFTWIDTH,
} from './js/BoardDraw';
import { EquipmentStatusEnumList } from './js/EnumList';
import { IHoverTarget } from './js/types';

const canvas = ref<InstanceType<typeof HTMLCanvasElement>>();

const oWrap = ref<InstanceType<typeof HTMLElement>>();

const EquipmentStatusManagePageData = ref(new EquipmentStatusManageClass());

const leftInfoList = computed(() => EquipmentStatusManagePageData.value.list.map(it => ({
  ...it,
  _EquipmentTaskStatusEnumitem: EquipmentStatusEnumList.find(_it => _it.ID === it.Status),
})));

const curTitleItem = ref<null |(typeof leftInfoList.value)[number]>(null);

const leftHoverItem = ref<null | IHoverTarget>(null);
watchEffect(() => {
  if (curTitleItem.value && oWrap.value) {
    const index = leftInfoList.value.findIndex(it => it.Equipment.ID === curTitleItem.value?.Equipment.ID);
    const offsetX = TITLEWIDTH + oWrap.value.scrollLeft - 12;
    const offsetY = index > -1 ? index * RowHeight : 0;
    let clientY = 0;
    const itemDom = oWrap.value.querySelectorAll('.left-item')?.[index];
    if (itemDom) {
      clientY = itemDom.getBoundingClientRect().bottom - RowHeight;
    }

    leftHoverItem.value = {
      position: {
        offsetX,
        offsetY,
        clientX: 0,
        clientY,
      },
      index,
      data: {
        item: curTitleItem.value,
        Task: null,
      },
    };
  } else {
    leftHoverItem.value = null;
  }
});

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
.mp-prod-condition-prop-select-dialogwrap {
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
    display: flex;
    .left-list {
      flex: none;
      width: 280px;
      position: sticky;
      background-color: #fff;
      left: 0;
      z-index: 999;
      li {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e5e5e5;
        box-sizing: border-box;
        color: #444;
        .l {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-left: 8px;
          padding-right: 15px;
          > span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        h2 {
          flex: 1;
          height: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 50px;
          font-size: 22px;
          padding-right: 8px;
        }

        & {
          border-width: 0px;
          position: relative;
          &::before {
            width: 100%;
            height: 1px;
            position: absolute;
            content: '';
            left: 0;
            bottom: -0.5px;
            background-color: #e5e5e5;
            z-index: 9;
          }
          &:last-of-type {
            &::after {
              width: 100%;
              height: 25px;
              position: absolute;
              content: '';
              left: 0;
              bottom: -25.5px;
              background-color: #fff;
              z-index: 9;
            }
          }
        }
      }
    }
    canvas {
      user-select: none;
    }

    :deep(.el-empty) {
      padding-top: 8vh;
      padding-right: 50px;
      margin: 0 auto;

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
