<template>
  <main>
    <el-table :data="props.localEquipmentListClassData.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column min-width="100px" prop="ClassID" label="分类">
        <template #default="scope:any">{{formatListName(scope.row.ClassID, props.localEquipmentListClassData.EquipmentClassList)}}</template>
      </mp-table-column>
      <mp-table-column min-width="100px" prop="ClassID" label="设备组">
        <template #default="scope:any">{{formatListName(scope.row.GroupID, props.localEquipmentListClassData.EquipmentGroupList)}}</template>
      </mp-table-column>
      <mp-table-column min-width="135px" prop="Name" label="名称" />
      <mp-table-column width="140px" prop="ClassID" label="咬口">
        <template #default="scope:{ row: IManageEquipmentInfo }">
          <span>{{scope.row.IsDoubleBite ? '双咬口' : ''}}</span>
        </template>
      </mp-table-column>
      <mp-table-column width="160px" prop="Index" label="设备状态显示顺序" />
      <mp-table-column width="150px" prop="ClassID" label="状态">
        <template #default="scope:any">
          <span class="is-pink">{{scope.row.IsUseable ? '' : '已停用'}}</span>
        </template>
      </mp-table-column>
      <mp-table-column width="280px" label="操作">
        <template #default="scope:any">
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentTableMenuEnumType.setState)">
            {{ scope.row.IsUseable ? '停用' : '启用' }}
          </mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentTableMenuEnumType.edit)">编辑</mp-button>
          <mp-button type="danger" link @click="onMenuClick(scope.row, EquipmentTableMenuEnumType.remove)">删除</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!props.localEquipmentListClassData.loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getNameByIDAndList } from '@/assets/js/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { EquipmentListClass, EquipmentTableMenuEnumType } from '@/views/productionResources/procesisngMachinery/TypeClass/EquipmentListClass';

const props = defineProps<{
  localEquipmentListClassData: Required<EquipmentListClass>
}>();

const emit = defineEmits(['menuClick']);

const formatListName = (id, list, options = { key: 'Name', value: 'ID' }) => getNameByIDAndList(id, list, options);

const onMenuClick = (it: IManageEquipmentInfo, type: EquipmentTableMenuEnumType) => {
  switch (type) {
    case EquipmentTableMenuEnumType.edit:
      emit('menuClick', it, type);
      break;
    case EquipmentTableMenuEnumType.remove:
      MpMessage.warn({
        title: '确定删除该设备吗 ?',
        msg: `设备名称：[ ${it.Name} ]`,
        onOk: () => {
          emit('menuClick', it, type);
        },
      });
      break;
    case EquipmentTableMenuEnumType.setState:
      MpMessage.warn({
        title: it.IsUseable ? '确定要停用该设备吗 ?' : '确定要启用该设备吗 ?',
        msg: `设备名称：[ ${it.Name} ]`,
        onOk: () => {
          emit('menuClick', it, type);
        },
      });
      break;
    default:
      break;
  }
};

const getRowKey = (row: IManageEquipmentInfo) => row.ID;

</script>

<style scoped lang='scss'>
</style>
