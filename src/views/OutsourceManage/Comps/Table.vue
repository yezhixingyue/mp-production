<template>
  <el-table :data="TaskList" border stripe class="table-wrap" ref="oTableRef" @selection-change="onSelectionChange">
    <mp-table-column type="selection" width="60" label-class-name="check-title" class-name='check' v-if="pageType==='await' && localPermission?.WaitSetup" />
    <mp-table-column width="80px" prop="Code" label="任务ID" />
    <mp-table-column width="145px" prop="_TargetID" label="关联ID" />
    <mp-table-column v-if="pageType === 'await'" min-width="120px" prop="_LineName" label="生产线" />
    <mp-table-column v-if="pageType !== 'undelivered'" min-width="135px" prop="_WorkingName" label="工序" />
    <mp-table-column v-if="pageType === 'undelivered'" min-width="100px" prop="_Material" label="物料" />
    <mp-table-column width="90px" prop="_Number" label="数量" />
    <mp-table-column v-if="pageType !== 'undelivered'" min-width="110px" prop="_AssistText" label="加工信息" class-name="">
      <template #default="scope:{ row: Row }">
        <span :class="scope.row._AssistText?'is-pink':'is-gray'" class="assist-ctrl assist"
          v-if="pageType==='await' || pageType === 'all'"
          @click="onAssistTextChangeClick(scope.row)"
          >{{ scope.row._AssistText || '无' }}</span>
        <span :class="scope.row._AssistText?'is-pink':'is-gray'" class="assist" v-else>{{ scope.row._AssistText || '无' }}</span>
      </template>
    </mp-table-column>
    <mp-table-column v-if="pageType !== 'undelivered'" width="140px" label="外协工厂">
      <template #default="scope:{ row: Row }">
        <el-select v-if="scope.row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive && pageType==='await'"
         :disabled="!localPermission?.WaitSetup || scope.row._ExternalSubmitParams._IsFixedFactory"
         :title="scope.row._ExternalSubmitParams._IsFixedFactory ? '外协异常处理中锁定了工厂' : ''"
         v-model="scope.row._ExternalSubmitParams.FactoryID" style="width:120px;" placeholder="指定外协工厂">
          <el-option
            v-for="item in scope.row.Working.UseableEquipmentList || []"
            :key="item.ID"
            :label="item.Name"
            :value="item.ID"
          />
        </el-select>
        <span v-else>{{ scope.row.Equipment.Name }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="110px" label="金额" v-if="pageType==='await'">
      <template #default="scope:any">
        <el-input style="width:70px;margin-right: 5px;" class="amount" placeholder="外协金额"
          v-if="scope.row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive && pageType==='await'"
          :disabled="!localPermission?.WaitSetup || scope.row._ExternalSubmitParams._IsFixedAmount"
          :title="scope.row._ExternalSubmitParams._IsFixedAmount ? '外协异常处理中锁定了价格' : ''"
          v-model.trim="scope.row._ExternalSubmitParams.Amount" maxlength="9"/>
        <span v-else>{{ scope.row._ExternalSubmitParams.Amount }}</span>
        <i>元</i>
      </template>
    </mp-table-column>

    <template v-if="pageType==='all'">
      <mp-table-column width="80px" label="金额" >
        <template #default="scope:any">
          <span>{{ (scope.row as Row).Working.ExternalAttribute.OrignalAmount }}</span>
          <i v-if="typeof (scope.row as Row).Working.ExternalAttribute.OrignalAmount === 'number'">元</i>
        </template>
      </mp-table-column>
      <mp-table-column width="85px" label="异常减款">
        <template #default="scope:any">
          <span>{{ (scope.row as Row).Working.ExternalAttribute.ReduceAmount }}</span>
          <i v-if="typeof (scope.row as Row).Working.ExternalAttribute.ReduceAmount === 'number'">元</i>
        </template>
      </mp-table-column>
      <mp-table-column width="85px" label="最终金额">
        <template #default="scope:any">
          <span>{{ (scope.row as Row).Working.ExternalAttribute.FinalAmount }}</span>
          <i v-if="typeof (scope.row as Row).Working.ExternalAttribute.FinalAmount === 'number'">元</i>
        </template>
      </mp-table-column>
    </template>

    <!-- 下一道工序 未交接时展示 -->
    <mp-table-column min-width="100px" label="下一道工序" v-if="pageType === 'inTransition' || pageType === 'undelivered'">
      <template #default="scope:any">
        <h4 v-if="(scope.row as Row).NextWorkingList?.length === 1" class="next-work">
          <span :title="getNextWorkContentOnlySingle((scope.row as Row).NextWorkingList)"
          >{{ getNextWorkContentOnlySingle((scope.row as Row).NextWorkingList) }}</span>
          <mp-button type="primary" v-if="pageType === 'undelivered'" link @click="onSendErrorClick(scope.row, 0)">报错</mp-button>
        </h4>
        <mp-button type="primary" link v-else-if="(scope.row as Row).NextWorkingList?.length > 1" @click="showNextWorkingList(scope.row)">查看列表</mp-button>
      </template>
    </mp-table-column>
    <!-- 最晚送达时间 未交接时展示 -->
    <mp-table-column width="130px" prop="_LastestSendedTime" label="最晚送达时间" v-if="pageType === 'inTransition'">
      <template #default="scope:any">
        <span :class="{'is-red': (scope.row as Row)._IsTimeout}">{{ (scope.row as Row)._LastestSendedTime }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="140px" label="预计完成日期" v-if="pageType==='await'">
      <template #default="scope:any">
        <MpDateTimePicker style="width:120px;" :disabled="!localPermission?.WaitSetup"
          v-if="scope.row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive  && pageType==='await'"
          v-model="scope.row._ExternalSubmitParams.WishFinishTime" disabledBeforeToday :clearable="false" />
        <span v-else>{{ formatOnlyDate(scope.row._ExternalSubmitParams.WishFinishTime) }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="115px" prop="_CreateTime" label="创建时间" v-if="pageType === 'all'" />
    <mp-table-column width="115px" prop="_StartTime" label="确认外协时间" v-if="pageType !== 'undelivered'" />
    <mp-table-column width="75px" prop="SendOperator" label="外协操作人" v-if="pageType !== 'undelivered'" />
    <!-- 预计完成时间 全部时显示 -->
    <mp-table-column width="110px" label="预计完成日期" v-if="pageType === 'all'">
      <template #default="scope:any">
        {{ formatOnlyDate(scope.row._ExternalSubmitParams.WishFinishTime) }}
      </template>
    </mp-table-column>
    <!-- 完成时间 非待外协时显示 -->
    <mp-table-column width="115px" prop="_FinishTime" label="完成时间" v-if="pageType !== 'await' && pageType !== 'undelivered'" />
    <mp-table-column width="60px" prop="_ExternalStatusText" label="状态" v-if="pageType !== 'inTransition' && pageType !== 'undelivered'" />
    <mp-table-column width="75px" prop="InOperator" label="外协入库人" v-if="pageType === 'all'" />
    <mp-table-column width="75px" prop="OutOperator" label="外协出库人" v-if="pageType === 'all'" />
    <mp-table-column width="240px" label="操作" v-if="pageType==='await' && localPermission?.WaitSetup">
      <template #default="scope:any">
        <mp-button type="primary" class='f' link @click="onMenuClick(scope.row, 'confirmExternal')"
          :disabled="!([ExternalTaskStatusEnum.WaitFactoryReceive, ExternalTaskStatusEnum.FactoryReceived]
          .includes(scope.row.Working.ExternalAttribute.Status)
          ||(scope.row.Working.ExternalAttribute.Status===ExternalTaskStatusEnum.HaveInstored
              &&scope.row.Working.Type===WorkingTypeEnum.platemaking))">{{ scope.row._ExternalStatusCtrlText }}</mp-button>
        <mp-button type="primary" link
          :disabled="scope.row.Working.ExternalAttribute.Status!==ExternalTaskStatusEnum.HaveInstored"
          @click="onMenuClick(scope.row, 'issue')">有问题</mp-button>
        <mp-button type="primary" link
          :disabled="scope.row.Working.ExternalAttribute.Status===ExternalTaskStatusEnum.WaitFactoryReceive"
          :title="scope.row.Working.ExternalAttribute.Status===ExternalTaskStatusEnum.WaitFactoryReceive ? '外协后即可打印工单' : ''"
          @click="onMenuClick(scope.row, 'print')">打印工单</mp-button>
        <mp-button type="primary" link
          :disabled="!getCanNotDownload(scope.row)"
          :title="!getCanNotDownload(scope.row) ? '已外协且有文件才可下载文件' : ''"
          @click="onMenuClick(scope.row, 'loadFile')">下载文件</mp-button>
      </template>
    </mp-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无任务</span>
    </template>
  </el-table>
  <NextWorkingListDialog v-model:visible="visible" :row="curRow" :showSendError="pageType === 'undelivered'" @send-error="onSendErrorClick" />
</template>

<script setup lang='ts'>
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ElTable } from 'element-plus';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { formatOnlyDate } from '@/assets/js/filters/dateFilters';
import { getNextWorkContentOnlySingle } from '@/views/ProductionClient/assets/js/utils';
import MpDateTimePicker from '@/components/common/ElementPlusContainners/MpDateTimePicker/MpDateTimePicker.vue';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { ExternalTaskStatusEnum } from '../js/enum';
import { getCanNotDownload } from '../js/utils';
import { OutsourceManagePageType } from '../js/type';
import NextWorkingListDialog from './NextWorkingListDialog.vue';

type Row = ReturnType<typeof getLocalTaskList>[number]

const props = defineProps<{
  TaskList: ReturnType<typeof getLocalTaskList>
  loading: boolean
  pageType: OutsourceManagePageType
}>();

const emit = defineEmits(['confirmExternal', 'loadFile', 'setMultipleSelection', 'print', 'sendError', 'issue', 'changeAssistText']);

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageExternalTask.Obj);

/* 多选相关处理 ↓
-------------------------------------------*/
const oTableRef = ref<InstanceType<typeof ElTable>>();
const onSelectionChange = (val: typeof props.TaskList) => {
  emit('setMultipleSelection', val, oTableRef.value);
};
watch(() => props.loading, (newVal, oldVal) => {
  if (!newVal && oldVal) { // loading从true转为false 说明重新调取了列表数据 此时清空之前多选信息
    emit('setMultipleSelection', [], oTableRef);
    if (oTableRef.value) oTableRef.value.clearSelection();
  }
});
/** 判断一个任务是否可以外协（禁用多选） */
// const getSelectable = (row: typeof props.TaskList[number]) => row.Working.ExternalAttribute?.Status === ExternalTaskStatusEnum.WaitFactoryReceive;

/* 按钮事件
--------------------------------------------*/
const onMenuClick = (row: typeof props.TaskList[number], type: Parameters<typeof emit>[0]) => {
  const isConfirm = row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive;
  emit(type, row, isConfirm);
};

/* 下一道工序列表
------------------------ */
const curRow = ref<null | Row>(null);
const visible = ref(false);
const showNextWorkingList = (row: typeof props.TaskList[number]) => {
  curRow.value = row;
  visible.value = true;
};

const onSendErrorClick = (row: typeof props.TaskList[number], index: number, callback?: () => void) => {
  emit('sendError', row, index, callback);
};

/** 修改待外协加工信息 */
const onAssistTextChangeClick = (row: Row) => {
  emit('changeAssistText', row);
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

    .amount {
      input {
        text-align: center;
      }
    }

    .next-work {
      display: flex;
      align-items: center;
      > span {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      > button {
        flex: none;
        margin-left: 6px;
      }
    }
  }

  :deep(.check-title) {
    .cell {
      width: 68px;
      padding-left: 7px;
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
      padding-left: 15px;
      > label {
        padding: 5px 20px 5px 4px;
        height: 14px;
      }
    }
  }

  .assist-ctrl {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  .assist {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
