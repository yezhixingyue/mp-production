<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column align="center" width="280px" prop="Name" label="名称" />
      <mp-table-column align="center" width="185px" prop="Type" label="类型">
        <template #default="scope:any">
          {{formatType(scope.row.Type)}}
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="400px" prop="Type" label="展示位置">
        <template #default="scope:{ row: IAssistListItem }">
          <span v-if="scope.row.Type===AssistInfoTypeEnum.text">
            {{ NoteDisplayPositionList.filter(n => scope.row.Position[n.Key] === true).map(n => n.Name).join('、') || '' }}
          </span>
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="185px" label="操作" v-if="localPermission?.Setup">
        <template #default="scope:any">
          <mp-button type="info" link @click="onEditClick(scope.row)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </template>
      </mp-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import type { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { getEnumNameByID, localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums, AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { IUser } from '@/store/modules/user/types';
import { INoteDisplayPosition } from '@/views/productionResources/assistInfo/hooks/useNoteDisplayPositionList';

const props = defineProps<{
  list: IAssistListItem[],
  localPermission?: IUser['PermissionList']['PermissionManageAssist']['Obj']
  NoteDisplayPositionList: INoteDisplayPosition[]
}>();

const emit = defineEmits(['edit', 'remove']);

const formatType = (type: localEnumValueIDType) => getEnumNameByID(type, AssistInfoTypeEnums);

const onEditClick = (it: IAssistListItem) => {
  emit('edit', it);
};

const onRemoveClick = (it: IAssistListItem) => {
  emit('remove', it);
};

const getRowKey = (row: IAssistListItem) => row.ID;

</script>

<style scoped lang='scss'>
</style>
