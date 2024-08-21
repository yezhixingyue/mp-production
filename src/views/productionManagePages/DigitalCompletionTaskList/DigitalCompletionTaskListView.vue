<template>
  <section class="wrap"> <!-- no-gap -->
    <header  v-if="localManageData">
      <!-- 标签切换 -->
      <MpPageTabList :list="localManageData.TabList" v-model="localManageData.currentTab" @change="onTabChange" />
    </header>
    <main  v-if="localManageData">
      <!-- 设置切换动画 -->
      <InternalCoreView
        v-if="localManageData.currentTaskList"
        :class="isSwitching"
        :key="`${localManageData.currentTaskList.IsPlateTask}`"
        :Permission="localManageData.Permission"
        :ManageTaskListData="localManageData.currentTaskList"
        :EquipmentFilterData="localManageData.EquipmentFilterData"
        :LineList="localManageData.LineList"
        :currentTab="localManageData.currentTab"
      />
    </main>
  </section>
</template>

<script setup lang='ts'>
import MpPageTabList from '@/components/common/General/MpPageTabList.vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { nextTick, onActivated, ref, watch } from 'vue';
import { ManagePageData } from './js/ManagePageData';
import InternalCoreView from './InternalCoreView.vue';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

/** 数码完工任务页面管理数据 */
const localManageData = ref<null | ManagePageData>();

const isSwitching = ref<'' | 'True' | 'False'>('');

watch(() => user.value, async (val) => {
  if (val) {
    await nextTick();
    localManageData.value = new ManagePageData(val.PermissionList.PermissionManageDigitalTask);

    await nextTick();
    localManageData.value.init();
  }
}, {
  immediate: true,
});

const onTabChange = (val: ManagePageData['currentTab']) => {
  isSwitching.value = '';
  setTimeout(() => {
    isSwitching.value = val ? 'True' : 'False';
  }, 10);
};

onActivated(() => {
  isSwitching.value = '';
});
</script>

<script lang="ts">
export default {
  name: 'DigitalCompletionTaskListView',
};
</script>

<style scoped lang='scss'>
.wrap {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  > main {
    overflow: hidden;
    box-sizing: border-box;
    padding-bottom: 2px;
    background-color: #fff;

    @keyframes fromLeft {
      from {
        opacity: 0;
        transform: translateX(-100px);
      }
      to {
        opacity: 0.5;
        transform: translateX(0px);
      }
    }

    @keyframes fromRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 0.5;
        transform: translateX(0px);
      }
    }
    .True {
      animation: fromLeft 300ms;
    }
    .False {
      animation: fromRight 300ms;
    }
  }
}
</style>
