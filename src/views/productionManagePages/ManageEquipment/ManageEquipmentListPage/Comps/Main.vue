<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="128px" prop="_ClassName" label="分类" />
      <mp-table-column width="160px" prop="_GroupName" label="设备组" />
      <mp-table-column width="180px" prop="Name" label="名称" />
      <mp-table-column width="108px" label="状态">
        <template #default="scope:any">{{ scope.row.IsOpen ? '' : '已关闭' }}</template>
      </mp-table-column>
      <mp-table-column min-width="215px" label="运行时间设置">
        <template #default="scope:any">{{ scope.row._RunningTime }}</template>
      </mp-table-column>
      <mp-table-column width="215px" label="绑定状态">
        <template #default="scope:any">
          <span v-show="scope.row.Terminal">已绑定主机</span>
          <mp-button v-if="localPermission?.Relieve" v-show="scope.row.Terminal"
           link type="primary" class="ml-40" @click="onUnbindClick(scope.row)">解绑</mp-button>
        </template>
      </mp-table-column>
      <!-- <mp-table-column width="280px" label="操作" class-name="ctrl"> -->
      <mp-table-column width="280px" label="操作" v-if="localPermission?.Setup">
        <template #default="scope:any">
          <mp-button type="primary" link @click="onTimeClick(scope.row)">运行时间</mp-button>
          <mp-button :type="scope.row.IsOpen ? 'danger' : 'primary'" link @click="onOpenSwitchClick(scope.row)" :disabled="scope.row.MaintainInfo.IsAutomatic"
            style="margin-left: 25px;">
            {{ scope.row.IsOpen ? '关机' : '开机'}}
          </mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getNameByIDAndList } from '@/assets/js/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { computed } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { getPeriodDateContent, getPeriodListContent } from '@/assets/js/utils/getPeriodContent';
import { IEquipmentMaintainInfo, IManageEquipmentInfo } from '../js/types';

const props = defineProps<{
  list: IManageEquipmentInfo[]
  loading: boolean
  EquipmentGroupList: EquipmentGroupItemType[]
  EquipmentClassList: EquipmentClassificationListItem[]
}>();

const emit = defineEmits(['unbind', 'switchIsOpen', 'setTime']);

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageEquipment.Obj);

const formatListName = (id, list, options = { key: 'Name', value: 'ID' }) => getNameByIDAndList(id, list, options);

const formatRunningTime = (MaintainInfo: IEquipmentMaintainInfo) => {
  if (!MaintainInfo.IsAutomatic) return '手动开关机';
  const arr: string[] = [];
  // PeriodType

  const { LimitOff, PeriodType, ItemList, PeriodList } = MaintainInfo;

  const _LimitOffText = `以下时间段${LimitOff ? '关机' : '开机'}：`;

  const _PeriodTypeText = getPeriodDateContent(PeriodType, ItemList);

  const _PeriodListText = getPeriodListContent(PeriodList);

  arr.push(_LimitOffText, _PeriodTypeText, _PeriodListText);

  return arr.join('');
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  _ClassName: formatListName(it.ClassID, props.EquipmentClassList),
  _GroupName: formatListName(it.GroupID, props.EquipmentGroupList),
  _RunningTime: formatRunningTime(it.MaintainInfo),
})));

const onUnbindClick = (row: IManageEquipmentInfo) => {
  MpMessage.warn({
    title: '确定解除该设备绑定吗？',
    msg: `设备名称：[ ${row.Name} ]`,
    onOk: () => {
      emit('unbind', row);
    },
  });
};

const onTimeClick = (row: IManageEquipmentInfo) => {
  emit('setTime', row);
};

const onOpenSwitchClick = (row: IManageEquipmentInfo) => {
  MpMessage.warn({
    title: `确定${row.IsOpen ? '关机' : '开机'}吗？`,
    msg: `设备名称：[ ${row.Name} ]`,
    onOk: () => {
      emit('switchIsOpen', row);
    },
  });
};

</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(th.ctrl .cell) {
    text-align: left;
    padding-left: 102px;
  }
  :deep(td.ctrl .cell) {
    text-align: left;
    padding-left: 60px;
    button + .el-button {
      margin-left: 30px;
    }
  }
}

</style>
