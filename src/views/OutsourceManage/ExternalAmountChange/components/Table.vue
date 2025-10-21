<template>
  <el-table :data="localList" border stripe class="table-wrap">
    <mp-table-column width="100px" prop="_TaskDetail.Code" label="外协任务ID" />
    <mp-table-column width="145px" prop="_TaskDetail._TargetID" label="关联ID" />
    <mp-table-column min-width="135px" prop="_TaskDetail._WorkingName" label="工序" />
    <mp-table-column width="120px" prop="_TaskDetail.Equipment.Name" label="外协工厂" />
    <mp-table-column width="125px" prop="_TaskDetail._SendTime" label="外协时间" />
    <mp-table-column width="125px" prop="_TaskDetail._FinishTime" label="外协入库时间" />
    <mp-table-column width="100px" prop="OutPrice" label="外协金额">
      <template #default="scope: { row: TaskPriceCheckInfoRowType }">
        <span>{{ scope.row.OutPrice }}元</span>
      </template>
    </mp-table-column>
    <mp-table-column width="85px" prop="TaskDetail.SendOperator" label="外协操作人" />
    <mp-table-column width="85px" prop="RecheckOperatorName" label="财务复核人" />
    <mp-table-column width="100px" prop="ReferencePrice" label="复核金额">
      <template #default="scope: { row: TaskPriceCheckInfoRowType }">
        <span>{{ scope.row.ReferencePrice }}元</span>
      </template>
    </mp-table-column>
    <mp-table-column width="100px" prop="ChangePrice" label="改后金额">
      <template #default="scope: { row: TaskPriceCheckInfoRowType }">
        <span v-if="scope.row.ChangePrice || scope.row.ChangePrice === 0"
         :class="{'is-pink': scope.row.ChangePrice > scope.row.ReferencePrice}">{{ scope.row.ChangePrice }}元</span>
      </template>
    </mp-table-column>
    <mp-table-column width="85px" prop="ManagerName" label="外协主管" />
    <mp-table-column width="85px" prop="_StatusText" label="复核状态">
      <template #default="scope: { row: TaskPriceCheckInfoRowType }">
        <span :class="{'is-success': scope.row.Status === TaskPriceCheckStatusEnum.HaveChecked}">{{ scope.row._StatusText }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="240px" label="操作">
      <template #default="{ row }: { row: TaskPriceCheckInfoRowType }">
        <mp-button v-if="localPermission?.ChangePrice"
          :disabled="![TaskPriceCheckStatusEnum.Initial,TaskPriceCheckStatusEnum.Refuse].includes(row.Status) || row.TaskDetail.SendOperatorID!==user?.StaffID"
          type="primary" link @click="onMenuClick(row, 'changePrice')">修改金额</mp-button>
        <mp-button v-if="showCheckPrice" :disabled="user?.StaffID!==row.ManagerID||![TaskPriceCheckStatusEnum.HaveChangePrice].includes(row.Status)"
          type="primary" link @click="onMenuClick(row, 'check')">审核</mp-button>
        <mp-button v-if="localPermission?.ConfirmPrice" :disabled="![TaskPriceCheckStatusEnum.WaitCheck].includes(row.Status)"
          type="primary" link @click="onMenuClick(row, 'confirm')">确认</mp-button>
        <mp-button v-if="localPermission?.Remove"
         :disabled="![TaskPriceCheckStatusEnum.Initial].includes(row.Status) || row.CreatorID!==user?.StaffID"
          type="danger" link @click="onMenuClick(row, 'delete')">删除</mp-button>
      </template>
    </mp-table-column>

    <template #empty>
      <span class="ft-12" v-show="!localPageData.listManager.loading">暂无数据</span>
    </template>
  </el-table>

  <ItemSetupDialog :localPageData="localPageData" :user="user" :row="currentRowData.row" :type="currentRowData.type" v-model:visible="currentRowData.visible" />
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { IUser } from '@/store/modules/user/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElMessage } from 'element-plus';
import { MenuEventType, TaskPriceCheckInfoRowType } from '../types/type';
import { getTableDataList } from '../tools';
import { TaskPriceCheckStatusEnum } from '../types/enum';
import { PageMoudleManageClassType } from '../model/PageMoudleManageClass';
import ItemSetupDialog from './ItemSetupDialog.vue';

const props = defineProps<{
  localPageData: PageMoudleManageClassType
  user: IUser | null
  localPermission?: IUser['PermissionList']['PermissionTaskChangePrice']['Obj']
}>();

const localList = computed(() => getTableDataList(props.localPageData.listManager.list));

const showCheckPrice = computed(() => { // 是否显示审核按钮
  if (!props.user) return false;
  const ids = props.localPageData.outsourceManager.list.map(i => i.StaffID);

  return ids.includes(props.user.StaffID);
});

/* 按钮事件
--------------------------------------------*/
const currentRowData = ref<{ row: null | TaskPriceCheckInfoRowType; type: '' | MenuEventType; visible: boolean }>({ row: null, type: '', visible: false });
const onMenuClick = async (row: TaskPriceCheckInfoRowType, type: MenuEventType) => {
  currentRowData.value.row = row;
  currentRowData.value.type = type;

  switch (type) {
    case 'changePrice':
      // 修改金额
      currentRowData.value.visible = true;
      break;

    case 'check':
      // 审核
      currentRowData.value.visible = true;
      break;

    case 'confirm':
      // 确认 -- 两种情况：需要弹窗|不需要弹窗
      if (typeof row.ChangePrice === 'number') {
        if (row.ChangePrice > row.ReferencePrice) {
          currentRowData.value.visible = true;
        } else if (await props.localPageData.listManager.confirm({ ID: row.ID, IsRefused: false }, props.user?.StaffName || '')) {
          ElMessage.success('已确认通过');
        }
      }

      break;

    case 'delete':
      // 删除
      MpMessage.warn('确定删除该价格修改条目吗?', `外协任务ID: [ ${row.TaskDetail.Code} ]`, () => {
        props.localPageData.listManager.remove(row.ID);
      });

      break;

    default:
      break;
  }
};

</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(td.is-pink) {
    .cell {
      color: #ff0000;
      padding: 0 6px;
    }
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    .cell {
      padding: 0 2px;
    }

    button {
      font-size: 12px;
      padding: 0;

      .iconfont {
        font-size: 16px;
      }

      &.f {
        width: 4em;
      }
    }
  }
}
</style>
