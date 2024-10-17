<template>
  <main>
    <el-table :data="localTaskList" border stripe class="table-wrap" :class="{'show-header': showHeader, 'little-height': useLittleHeight}"
     ref="oTableRef" @selection-change="onSelectionChange">
      <mp-table-column v-if="showRowOptions.useMultipleSelection" type="selection" width="70"
       label-class-name="check-title" class-name='check' :selectable="getSelectable" />
      <mp-table-column width="125px" prop="Code" label="任务ID" />
      <mp-table-column width="160px" prop="_TargetID" label="关联ID" />
      <mp-table-column v-if="showRowOptions.showWorkingName" width="170px" prop="_WorkingName" label="工序" />
      <mp-table-column v-if="showRowOptions.showProcessTimes" width="100px" prop="_ProcessTimes" label="操作次序" />
      <mp-table-column v-if="showRowOptions.showContent" prop="_DetailText" min-width="120px" label="内容" />
      <mp-table-column v-if="showRowOptions.showMaterial" min-width="120px" prop="_Material" label="物料" />
      <mp-table-column width="110px" prop="_Number" label="数量" />
      <mp-table-column min-width="120px" prop="_AssistText" label="加工信息" class-name="is-pink t-l" />
      <slot name="ExternalHandle"></slot>
      <mp-table-column v-if="showRowOptions.showEquAndOperator" prop="_EquAndOperator" min-width="100px" label="设备 (操作人)" />
      <mp-table-column v-if="showRowOptions.showWishDuration" prop="_WishDuration" width="120px" label="预计加工时长" />
      <mp-table-column v-if="showRowOptions.showActualDuration" prop="_ActualDuration" width="120px" label="实际加工时长" />
      <mp-table-column v-if="showRowOptions.showFinishTime" prop="_FinishTime" width="130px" label="完成时间" />
      <mp-table-column v-if="showRowOptions.showLatestFinishTime" prop="LatestFinishTime" width="130px" label="最迟完工时间">
        <template #default="scope:{ row: typeof localTaskList.value[number] }">
          <span v-if="scope.row._LatestFinishTime" :class="scope.row._LatestFinishTime.isTimedout ?'is-pink' : ''">{{ scope.row._LatestFinishTime.Time }}</span>
        </template>
      </mp-table-column>
      <mp-table-column v-if="showRowOptions.showStatus" width="100px" prop="_StatusText" label="当前状态" >
        <template #default="scope:any">
          <span :class="isError ? 'is-pink' : ''">{{ scope.row._StatusText }}</span>
        </template>
      </mp-table-column>
      <mp-table-column v-if="showRowOptions.showExternalStatus" width="100px" prop="_ExternalStatusText" label="状态" />
      <mp-table-column v-if="showRowOptions.showCtrlMenus.length > 0" width="185px" label="操作">
        <template #default="scope:any">
          <mp-button type="primary" link @click="onMenuClick(scope.row, 'switchEqu')"
           v-if="showRowOptions.showCtrlMenus.includes('switchEqu') && user?.PermissionList.PermissionEquipmentStatus.Obj.ChangeEquipemnt"
            :disabled="!canSwitchEqu(scope.row)">
            <i class="iconfont icon-churukujilu"></i>更换设备
          </mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, 'confirmExternal')" v-if="showRowOptions.showCtrlMenus.includes('confirmExternal')">
            {{ scope.row._ExternalStatusCtrlText }}
          </mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, 'loadFile')" v-if="showRowOptions.showCtrlMenus.includes('loadFile')">
            下载文件
          </mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无{{ isError ? '待转移' : '' }}任务</span>
      </template>
    </el-table>
    <slot name="footer"></slot>
  </main>
</template>

<script setup lang='ts'>
import { ExternalTaskStatusEnum } from '@/views/OutsourceManage/js/enum';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { ElTable } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
import { getLocalTaskList } from './BatchReport/getLocalTaskList';

const emit = defineEmits(['switchEqu', 'confirmExternal', 'loadFile', 'setMultipleSelection']);

interface rowDisplayOptions {
  showContent: boolean
  showWishDuration: boolean
  showCtrlMenus: Parameters<typeof emit>[0][]
  showActualDuration: boolean
  showStatus: boolean
  showFinishTime: boolean
  showLatestFinishTime: boolean,
  showEquAndOperator: boolean
  useMultipleSelection: boolean
  showExternalStatus: boolean
  showWorkingName: boolean
  showProcessTimes: boolean
  showMaterial: boolean,
}

const props = withDefaults(defineProps<{
  TaskList: ITaskDetail[]
  loading?: boolean
  isError?: boolean
  showHeader?: boolean
  rowDisplayOptions?: Partial<rowDisplayOptions>
  useMultipleSelection?: boolean
  useLittleHeight?: boolean
}>(), {
  loading: false,
  isError: false,
  showHeader: false, // 是否为设备状态详情页面所用 - 是的话 需要添加内容列、预计加工时长列和操作列列表
});

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

/* 列表展示相关
-------------------------------------------*/
const localTaskList = computed(() => getLocalTaskList(props.TaskList, props.isError, true));

const _defaultshowRowOptions: rowDisplayOptions = {
  showContent: false,
  showWishDuration: false,
  showCtrlMenus: [],
  showActualDuration: false,
  showStatus: true,
  showFinishTime: false,
  showLatestFinishTime: false,
  showEquAndOperator: false,
  useMultipleSelection: false,
  showExternalStatus: false,
  showWorkingName: false,
  showProcessTimes: true,
  showMaterial: true,
};

const showRowOptions = computed(() => ({
  ..._defaultshowRowOptions,
  ...props.rowDisplayOptions || {},
}));

/* 多选相关处理 ↓
-------------------------------------------*/
const oTableRef = ref<InstanceType<typeof ElTable>>();
const onSelectionChange = (val: typeof props.TaskList) => {
  emit('setMultipleSelection', val);
};
watch(() => props.loading, (newVal, oldVal) => {
  if (!newVal && oldVal && showRowOptions.value.useMultipleSelection) {
    // loading从true转为false 说明重新调取了列表数据 此时清空之前多选信息
    emit('setMultipleSelection', []);
    if (oTableRef.value) oTableRef.value.clearSelection();
  }
});

/** 判断一个任务是否可以外协（禁用多选） */
const getSelectable = (row: typeof localTaskList.value[number]) => row.Working.ExternalAttribute?.Status === ExternalTaskStatusEnum.WaitFactoryReceive;

/* 按钮点击事件处理
-------------------------------------------*/
const onMenuClick = (row: typeof localTaskList.value[number], type: Parameters<typeof emit>[0]) => {
  switch (type) {
    // case 'switchEqu':
    // MpMessage.warn('确定更换设备吗', `任务ID：[ ${row.Code} ]`, () => {
    //   emit('switchEqu', row); // 设置过后从列表中删除掉该项，并且总条码数 - 1
    // });
    // break;

    default:
      emit(type, row);
      break;
  }
};
const canSwitchEqu = (row: typeof localTaskList.value[number]) => {
  const _canSwitchList = [ProductiveTaskStatusEnum.Initial, ProductiveTaskStatusEnum.Producibility];
  return _canSwitchList.includes(row.Status);
};
</script>

<style scoped lang='scss'>
.table-wrap {
  margin-top: 25px;
  &:not(.show-header) {
    :deep(.el-table__header-wrapper) {
      display: none;
    }
  }

  :deep(td.is-pink) {
    .cell {
      color: #ff3769;
      padding: 0 6px;
    }
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    button {
      font-size: 12px;

      .iconfont {
        font-size: 16px;
      }
    }

    // &.t-l {
    //   text-align: left;
    //   padding-left: 8px;
    //   padding-right: 8px;
    // }
  }

  :deep(.check-title) {
    .cell {
      width: 68px;
      padding-left: 11px;
      > label > span {
        position: relative;
        &::after {
          content: '全选';
          position: absolute;
          left: 19px;
          font-weight: 700;
          color: #444;
          top: -4px;
        }
        &.is-disabled::after {
          cursor: not-allowed;
        }
      }
    }
  }

  :deep(.el-table__body tbody .check) {
    .cell {
      padding-left: 11px;
      > label {
        padding: 5px 20px 5px 0;
        height: 14px;
      }
    }
  }

  &.little-height {
    margin-top: 20px;
    :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
      height: 20px;
      padding: 0;
      .cell {
        line-height: 20px;
        color: #444;
      }
    }
  }
}
</style>
