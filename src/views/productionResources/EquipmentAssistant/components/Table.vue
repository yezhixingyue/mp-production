<template>
  <el-table :data="localAssistantManageModel.list" stripe border style="width: 100%;height: 100%;">
    <mp-table-column prop="Name" label="姓名" width="220" />
    <mp-table-column prop="IDCard" label="身份证号" width="260" />
    <mp-table-column prop="TypeList" label="担任助手类型" min-width="285" :formatter="(row: IAssistantInfo) => formatTypeList(row.TypeList)" />
    <mp-table-column prop="Number" label="状态" width="100">
      <template #default="{ row }: { row: IAssistantInfo }">
        <span :class="{'is-gray': row.IsDisable}">{{ row.IsDisable ? '禁用' : '启用' }}</span>
      </template>
    </mp-table-column>
    <mp-table-column prop="OperatorName" label="最后操作人" width="125" />
    <mp-table-column prop="EditTime" label="最后操作时间" width="180" :formatter="(row: IAssistantInfo) => format2MiddleLangTypeDateFunc2(row.EditTime)" />
    <mp-table-column label="操作" width="200" v-if="user?.PermissionList.PermissionAssistant.Obj.MemberSetup">
      <template #default="{ row }: { row: IAssistantInfo }">
        <div class="menus">
          <span class="is-blue-span" @click="onEditClick(row)">编辑</span>
          <span class="is-pink-span" @click="onRemoveClick(row)">删除</span>
        </div>
      </template>
    </mp-table-column>

    <template #empty>
      <div>
        <span v-show="!localAssistantManageModel.loading">暂无数据</span>
      </div>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserHook } from '@/store/modules/user';
import { AssistantListManageModel } from '../model/AssistantListManageModel';
import { IAssistantInfo } from '../types/types';
import { localAssistantTypeList } from '../store';

const props = defineProps<{
  localAssistantManageModel: AssistantListManageModel
}>();

const emit = defineEmits(['edit']);

const { user } = useUserHook();

const formatTypeList = (TypeList: IAssistantInfo['TypeList']) => localAssistantTypeList.value
  .filter(it => TypeList.includes(it.ID))
  .map(it => it.Name).join('、');

const onRemoveClick = (row: IAssistantInfo) => {
  MpMessage.warn('确定删除该助手吗 ?', `姓名：[ ${row.Name} ]`, async () => {
    if (await props.localAssistantManageModel.remove(row)) {
      ElMessage.success('删除成功');
    }
  });
};

const onEditClick = (row: IAssistantInfo) => {
  emit('edit', row);
};

</script>

<style scoped lang='scss'>
.menus {
  > span {
    margin: 0 10px;
  }
}
</style>
