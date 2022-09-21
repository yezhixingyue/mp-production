<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <el-table-column align="center" width="280px" prop="Name" label="分类" />
      <el-table-column align="center" width="280px" label="操作">
        <template #default="scope">
          <mp-button type="info" link @click="onEditClick(scope.row)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { EquipmentClassificationItemClassType } from '@/views/productionResources/equipmentClassification/TypeClass/EquipmentClassificationItemClassType';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';

const props = defineProps<{
  list: EquipmentClassificationListItem[],
}>();

const emit = defineEmits(['edit', 'remove']);

const onEditClick = (it: EquipmentClassificationItemClassType) => {
  emit('edit', it);
};

const onRemoveClick = (it: EquipmentClassificationItemClassType) => {
  emit('remove', it);
};

const getRowKey = (row: EquipmentClassificationItemClassType) => row.ID;

</script>

<style scoped lang='scss'>
</style>
