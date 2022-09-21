<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <el-table-column align="center" width="280px" prop="Name" label="名称" />
      <el-table-column align="center" width="185px" prop="Type" label="类型">
        <template #default="scope">
          {{formatType(scope.row.Type)}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="185px" label="操作">
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
import type { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { getEnumNameByIDAndEnums, localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';

const props = defineProps<{
  list: IAssistListItem[],
}>();

const emit = defineEmits(['edit', 'remove']);

const formatType = (type: localEnumValueIDType) => getEnumNameByIDAndEnums(type, AssistInfoTypeEnums);

const onEditClick = (it: IAssistListItem) => {
  emit('edit', it);
};

const onRemoveClick = (it: IAssistListItem) => {
  emit('remove', it);
};

const getRowKey = (row: IAssistListItem) => row.NoteID;

</script>

<style scoped lang='scss'>
</style>
