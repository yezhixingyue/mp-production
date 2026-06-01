<template>
  <section class="page-wrap">
    <header>
      <!-- 无生产线占位提示 -->
      <p class="is-gray ft-12 ml-25 mt-98" v-if="!haveLinePremission">
        <el-empty description="当前岗位无调整权限"  style="text-align: left;" />
      </p>

      <MpPageTabList v-else :list="localPrepressAdjModel.TabList" v-model="localPrepressAdjModel.currentTab"
       @change="(e)=>localPrepressAdjModel.onTabChange(e)"/>

      <!-- 权限分配 -->
      <span class="is-blue-span permission" v-if="localPrepressAdjModel.Permission?.Obj.Permission" @click="onPermissionClick">权限分配</span>
    </header>

    <main v-if="haveLinePremission">
      <!-- 提前入尾版 -->
      <ListModuleIndex
        v-if="localPrepressAdjModel.unionPlateModuleData && localPrepressAdjModel.currentTab === AdjustTabTypeEnum.UnionPlate"
        :moduleData="localPrepressAdjModel.unionPlateModuleData"
        :type="AdjustTabTypeEnum.UnionPlate"
        :Permission="localPrepressAdjModel.Permission"
      />

      <!-- 追加印数 -->
      <ListModuleIndex
        v-if="localPrepressAdjModel.addNumberModuleData && localPrepressAdjModel.currentTab === AdjustTabTypeEnum.AddNumber"
        :moduleData="localPrepressAdjModel.addNumberModuleData"
        :type="AdjustTabTypeEnum.AddNumber"
        :Permission="localPrepressAdjModel.Permission"
      />
    </main>
  </section>
</template>

<script setup lang='ts'>
import MpPageTabList from '@/components/common/General/MpPageTabList.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { nextTick, watch, computed } from 'vue';
import { localPrepressAdjModel } from '../store';
import ListModuleIndex from './components/ListModule/ListModuleIndex.vue';
import { AdjustTabTypeEnum } from '../types/enum';

const router = useRouter();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const haveLinePremission = computed(() => {
  if (user.value) {
    if (localPrepressAdjModel.value.TabList.length === 0) return false;

    return true;
  }
  return false;
});

watch(() => user.value, async (val) => {
  if (val) {
    await nextTick();
    if (!localPrepressAdjModel.value.user) localPrepressAdjModel.value.init(val);
  }
}, {
  immediate: true,
});

/** 调整到权限分配页面 */
const onPermissionClick = () => {
  router.push('/PrepressAdjustment/Permission');
};
</script>

<script lang="ts">
export default {
  name: 'PrepressAdjustmentListPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  background-color: #fff;
  height: 100%;
  color: #444;
  display: flex;
  flex-direction: column;

  > header {
    position: relative;

    .permission {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 13px;
    }
  }

  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
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
