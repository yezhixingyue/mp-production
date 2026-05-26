<template>
  <section class="page-wrap">
    <header>
      <MpBreadcrumb :list="breadcrumbList" />

      <MpButton type="primary" class="mt-20" @click="onEditClick(null)">+ 添加权限人</MpButton>
    </header>

    <main>
      <el-table :data="localManageModel.list" stripe border class="row-ft-12">
        <mp-table-column align="center" width="300px" prop="Name" label="操作权限人" />

        <mp-table-column align="center" min-width="500px" label="负责生产线">
          <template #default="scope: { row: IAdjustPermissionInfo }">
            {{scope.row.LineList.map(it => it.Name).join('、')}}
          </template>
        </mp-table-column>

        <mp-table-column align="center" width="280px" label="操作">
          <template #default="scope: { row: IAdjustPermissionInfo }">
            <mp-button type="info" link @click="onEditClick(scope.row)">
              <i class="iconfont icon-bianji"></i>编辑
            </mp-button>
            <mp-button type="info" link @click="onRemoveClick(scope.row)">
              <i class="iconfont icon-delete"></i>删除
            </mp-button>
          </template>
        </mp-table-column>
      </el-table>

      <Dialog v-model:visible="visible" :item="currentItem" :ids="localManageModel.list.map(it => it.ID)" @submit="onsubmit" />
    </main>

    <footer>
      <mp-button class="blue" style="width: 120px;" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import MpButton from '@/components/common/MpButton.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import Dialog from './components/Dialog.vue';
import { useDialog } from './hooks/useDialog';
import { PrepressAdjPermissionManage } from './model/PrepressAdjPermissionManage';
import { IAdjustPermissionInfo } from '../types';
import { localPrepressAdjModel } from '../store';
import { AdjustTabTypeEnum } from '../types/enum';

const breadcrumbList = [
  { to: { path: '/PrepressAdjustment/List' }, name: '印前调整' },
  { name: '权限分配' },
];

const localManageModel = ref(new PrepressAdjPermissionManage());

const { visible, currentItem, onEditClick } = useDialog();

const onsubmit = (data: IAdjustPermissionInfo) => {
  localManageModel.value.save(data, () => { visible.value = false; });
};

const onRemoveClick = (item: IAdjustPermissionInfo) => {
  MpMessage.warn({
    title: '确认删除该项吗 ?',
    msg: `操作权限人：${item.Name}`,
    onOk() {
      localManageModel.value.remove(item.ID);
    },
  });
};

onMounted(() => {
  localManageModel.value.getList();
});

onBeforeRouteLeave((to) => {
  if (to.name === 'PrepressAdjustment') {
    if (localPrepressAdjModel.value.currentTab === AdjustTabTypeEnum.AddNumber) {
      localPrepressAdjModel.value.addNumberModuleData?.getList(localPrepressAdjModel.value.addNumberModuleData.condition.Page);
    }
    if (localPrepressAdjModel.value.currentTab === AdjustTabTypeEnum.UnionPlate) {
      localPrepressAdjModel.value.unionPlateModuleData?.getList(localPrepressAdjModel.value.unionPlateModuleData.condition.Page);
    }
  }
});
</script>

<script lang="ts">
export default {
  name: 'PrepressAdjustmentPermissionPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;

  > header {
    padding: 20px;
  }

  > main {
    flex: 1;
    overflow: hidden;
    padding: 0 20px;

    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    height: 40px;
    padding: 30px 0;

    text-align: center;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
