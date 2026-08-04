<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column align="center" min-width="400px" prop="Name" label="名称" />
      <mp-table-column align="center" width="160px" prop="Type" label="类型">
        <template #default="scope:any">
          {{formatType(scope.row.Type)}}
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="220px" prop="Type" label="位置">
        <template #default="scope:{ row: IAssistListItem }">
          {{scope.row.Positions.map(it => it.Name).join('、')}}
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="320px" prop="Type" label="报工机台">
        <template #default="scope:{ row: IAssistListItem }">
          {{scope.row.ReportWorkings.map(it => it.Name).join('、')}}
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="320px" prop="Type" label="条码稿">
        <template #default="scope:{ row: IAssistListItem }">
          {{scope.row.MapWorkings.map(it => it.Name).join('、')}}
        </template>
      </mp-table-column>
      <mp-table-column align="center" width="260px" label="操作" v-if="localPermission?.Setup">
        <template #default="scope:any">
          <mp-button type="info" link @click="onEditClick(scope.row)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <div>
          <span v-show="!loading">暂无数据</span>
        </div>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import type { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { getEnumNameByID, localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { IUser } from '@/store/modules/user/types';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/types/enum';

const props = defineProps<{
  list: IAssistListItem[],
  localPermission?: IUser['PermissionList']['PermissionManageAssist']['Obj'],
  loading: boolean
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
