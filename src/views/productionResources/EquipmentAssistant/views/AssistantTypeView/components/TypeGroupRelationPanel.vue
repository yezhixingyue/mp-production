<template>
  <ul class="relation-panel">
    <li class="info">
      <h4 class="mp-common-title-wrap black">助手类型信息</h4>
      <div>
        <span class="bold">助手类型名：</span>
        <span>{{ relationModel.target.Name }}</span>
      </div>
      <div>
        <span class="bold">简称：</span>
        <span>{{ relationModel.target.NickName || '无' }}</span>
      </div>
    </li>

    <li class="relation-group">
      <h4 class="mp-common-title-wrap black" style="margin-bottom: 10px;">关联设备组</h4>
      <p>
        <span class="is-blue-span" @click="visible = true">+ 添加</span>
      </p>
      <div class="table-box">
        <el-table :data="relationModel.target.GroupList" stripe border style="width: 100%;height: calc(100% - 10px);">
          <mp-table-column prop="ClassName" label="设备类型" width="160" />
          <mp-table-column prop="Name" label="设备组" width="220" />
          <mp-table-column label="人数要求" width="110">
            <template #default="{ row }: { row: IAssistantRelationGroup }">
              <span>{{ row.MinNumber === row.MaxNumber ? row.MinNumber : row.MinNumber + '~' + row.MaxNumber }}</span>
            </template>
          </mp-table-column>
          <mp-table-column label="操作" width="160">
            <template #default="{ row }: { row: IAssistantRelationGroup }">
              <div class="menus">
                <span class="is-blue-span" @click="onNumberEditClick(row)">编辑人数</span>
                <span class="is-pink-span" @click="relationModel.remove(row)">删除</span>
              </div>
            </template>
          </mp-table-column>
        </el-table>
      </div>
    </li>
  </ul>

  <!-- 关联设备组 -->
  <TypeRelationDialog v-model:visible="visible" :EquipmentGroupLevelList="EquipmentGroupLevelList" :relationModel="relationModel" />

  <!-- 设置设备组人数要求 -->
  <RelationGroupNumberDialog v-model:visible="numberVisible" :currentGroup="currentGroup" :relationModel="relationModel" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { TypeGroupRelationModel } from '../model/TypeGroupRelationModel';
import { IEquipmentGroupLevelItem, IAssistantRelationGroup } from '../../../types/types';
import TypeRelationDialog from './TypeRelationDialog.vue';
import RelationGroupNumberDialog from './RelationGroupNumberDialog.vue';

defineProps<{
  relationModel: TypeGroupRelationModel
  EquipmentGroupLevelList: IEquipmentGroupLevelItem[]
}>();

const visible = ref(false);

/** 编辑人数 */
const currentGroup = ref<null | IAssistantRelationGroup>(null);
const numberVisible = ref(false);
const onNumberEditClick = (row: IAssistantRelationGroup) => {
  currentGroup.value = row;
  numberVisible.value = true;
};
</script>

<style scoped lang='scss'>
ul.relation-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .info {
    flex: none;
    > div {
      padding-left: 13px;
      margin-bottom: 5px;

      .bold {
        display: inline-block;
        width: 6em;
      }
    }
  }

  .relation-group {
    margin-top: 30px;
    flex: 1;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    > * {
      flex: none;
    }

    > .table-box {
      flex: 1;
      overflow: hidden;
      margin-top: 10px;
    }
  }

  h4 {
    margin: 10px 0 20px;
    font-size: 15px;

    &::before {
      height: 16px;
    }
  }

  .menus {
    span {
      margin: 0 6px;
    }
  }
}
</style>
