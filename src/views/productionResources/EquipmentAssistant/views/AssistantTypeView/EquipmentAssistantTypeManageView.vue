<template>
  <section class="equip-assistant-type-wrap">
    <header>
      <mp-button type="primary" @click="onTypeEditClick(null)">+ 新增助手类型</mp-button>
    </header>

    <main>
      <div class="left">
        <el-table :data="localTypeManageData.list" stripe border style="width: 100%;height: calc(100% - 10px);">
          <mp-table-column prop="Name" label="助手类型名" width="200" />
          <mp-table-column prop="NickName" label="简称" width="120" />
          <mp-table-column prop="Index" label="报工次序" width="85" />
          <mp-table-column prop="Number" label="任(兼)职数" width="85" />
          <mp-table-column prop="Number" label="状态" width="60">
            <template #default="{ row }: { row: IAssistantType }">
              <span :class="{'is-gray': row.IsDisable}">{{ row.IsDisable ? '禁用' : '启用' }}</span>
            </template>
          </mp-table-column>
          <mp-table-column label="操作" width="150">
            <template #default="{ row }: { row: IAssistantType }">
              <div class="menus">
                <span class="is-pink-span" @click="localTypeManageData.remove(row)">删除</span>
                <span class="is-blue-span" @click="onTypeEditClick(row)">编辑</span>
                <span class="is-blue-span" @click="localTypeManageData.setTypeRelation(row)">设置</span>
              </div>
            </template>
          </mp-table-column>
        </el-table>
      </div>

      <div class="right" v-if="localTypeManageData.relationModel">
        <TypeGroupRelationPanel :relationModel="localTypeManageData.relationModel" :EquipmentGroupLevelList="localTypeManageData.EquipmentGroupLevelList" />
      </div>

      <TypeSaveDialog v-model:visible="visible" :item="currentAssistantType" @submit="handleTypeUpsertSubmit" />
    </main>

    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { getGoBackFun } from '@/router';
import { onBeforeRouteLeave } from 'vue-router';
import { useAssistantTypeEdit } from './hooks/useAssistantTypeEdit';
import TypeSaveDialog from './components/TypeSaveDialog.vue';
import { AssistantTypeManageClass } from './model/AssistantTypeManageClass';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IAssistantType } from '../../types/types';
import TypeGroupRelationPanel from './components/TypeGroupRelationPanel.vue';
import { localAssistantManageModel } from '../../store';

const localTypeManageData = ref(new AssistantTypeManageClass());

/** 助手类型 新增|编辑相关 */
const { visible, currentAssistantType, onTypeEditClick, handleTypeUpsertSubmit } = useAssistantTypeEdit(localTypeManageData);

onMounted(() => {
  localTypeManageData.value.getTypeList();
});

onBeforeRouteLeave((to) => {
  if (to.name === 'EquipmentAssistant' && localAssistantManageModel.value && localTypeManageData.value.loaded) {
    localAssistantManageModel.value.AssistantTypeList = localTypeManageData.value.list;
  }

  return true;
});
</script>

<script lang='ts'>
export default {
  name: 'EquipmentAssistantTypeManageView',
};
</script>

<style scoped lang='scss'>
.equip-assistant-type-wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 100px;
  background-color: #fff;

  > header {
    padding: 15px 0 30px;
  }

  > main {
    display: flex;
    overflow-y: hidden;

    > div {
      height: 100%;

      &.left {
        width: 700px;
        padding-right: 15px;
        border-right: 1px solid #eee;
      }

      &.right {
        padding-left: 40px;
      }
    }
  }

  > footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 10px;

    button {
      width: 120px;
    }
  }

  .menus {
    > span {
      margin: 0 5px;
    }
  }
}
</style>
