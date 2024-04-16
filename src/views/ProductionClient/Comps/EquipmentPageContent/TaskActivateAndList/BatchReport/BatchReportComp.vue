<template>
  <main class="report-wrap">
    <el-table :data="localTaskList" border stripe class="table-wrap" @selection-change="handleSelectionChange" ref="multipleTableRef">
      <mp-table-column type="selection" width="40" class-name="check-box-row" />
      <mp-table-column width="180px" label="任务编号">
        <template #default="scope:any">
          <div>
            <p>{{ scope.row.Code }}</p>
            <p>{{ scope.row._TargetID }}</p>
          </div>
        </template>
      </mp-table-column>
      <mp-table-column width="70px" prop="_ProcessTimes" label="加工次数" />
      <mp-table-column min-width="200px" label="任务信息" :show-overflow-tooltip="false">
        <template #default="scope:any">
          <div class="info">
            <!-- 辅助文字信息 -->
            <p class="is-red">{{ scope.row._AssistText}}</p>
            <!-- 数量和物料 -->
            <p>
              <span class="mr-15 ft-20">{{ scope.row._UnFinishNumber }}</span>
              <span>{{ scope.row._Material }}</span>
            </p>
            <!-- 详细信息 -->
            <p>{{ scope.row._DetailText }}</p>
          </div>
        </template>
      </mp-table-column>
      <mp-table-column width="80px" prop="_StatusText" label="状态" />
      <mp-table-column width="300px" label="操作">
        <template #default="scope:any">
          <div>
            <mp-button type="primary" link @click="onSingleCompleteClick(scope.row)">加工完成</mp-button>
            <mp-button type="primary" link @click="onErrorClick(scope.row)">报错</mp-button>
            <mp-button type="primary" link @click="onPicDisplayClick(scope.row)" :disabled="scope.row._images.length === 0">示意图</mp-button>
            <mp-button type="primary" link @click="onDownloadClick(scope.row)" :disabled="scope.row._files.length === 0">下载文件</mp-button>
          </div>
        </template>
      </mp-table-column>
    </el-table>
    <div class="footer">
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" label="全选" />

      <div class="btn-box">
        <MpPagination countInLeft :nowPage="curInstance.TaskListData.condition.Page" :pageSize="curInstance.TaskListData.condition.PageSize"
          :total="curInstance.TaskListData.TaskListNumber" :handlePageChange="(e) => curInstance.TaskListData.getEquipmentTaskList(e, null, true)">
          <template #text="data: { total: number }">共检索出<i class="is-bold ml-5 mr-5">{{ data.total }}</i>个任务</template>
        </MpPagination>
        <mp-button type="primary" @click="onCompleteClick">完成选中任务</mp-button>
      </div>
    </div>
    <!-- 图片展示 -->
    <PictureDisplayDialog v-model:visible="picVisible" title="示意图" :curRowData="curRowData"
     :picSrcList="(curRowData._images.map(it => it.FilePath).filter(it => it) as string[])" v-if="curRowData" />
    <!-- 文件下载弹窗 -->
    <FileDownloadDialog v-model:visible="downloadVisible" :files="curRowData._files" v-if="curRowData" />
    <!-- 确认批量报工报工 -->
    <BatchReportConfirmDialog v-model:visible="batchReportVisible" :TaskList="multipleSelection" @submit="submitReport" />
  </main>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { TerminalEquipmentInstance } from '@/views/ProductionClient/assets/js/Instance';
import { ElTable } from 'element-plus';
import { computed, ref } from 'vue';
import MpPagination from '@/components/common/MpPagination.vue';
import { getLocalTaskList } from './getLocalTaskList';
import PictureDisplayDialog from './PictureDisplayDialog.vue';
import FileDownloadDialog from '../../CurTaskPanel/FileDownloadDialog.vue';
import BatchReportConfirmDialog from './BatchReportConfirmDialog.vue';

const props = withDefaults(defineProps<{
  curInstance: Required<TerminalEquipmentInstance>
  loading?: boolean
  isError?: boolean
}>(), {
  loading: false,
  isError: false,
});

const emit = defineEmits(['report', 'singleReport', 'error']);

/* 列表展示
-------------------------------------------------- */
const localTaskList = computed(() => getLocalTaskList(props.curInstance.TaskListData.TaskList, props.isError));

/* 表格选中相关
-------------------------------------------------- */
const multipleSelection = ref<(ReturnType<typeof getLocalTaskList>[number])[]>([]);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();

const handleSelectionChange = (val: (ReturnType<typeof getLocalTaskList>[number])[]) => {
  multipleSelection.value = val;
};

const checkAll = computed({
  get() {
    return multipleSelection.value.length === localTaskList.value.length && multipleSelection.value.length > 0;
  },
  set() {
    if (!multipleTableRef.value) return;
    multipleTableRef.value.toggleAllSelection();
  },
});

const isIndeterminate = computed(() => (multipleSelection.value.length < localTaskList.value.length && multipleSelection.value.length > 0));

/* 完成选中任务相关
-------------------------------------------------- */
const onSingleCompleteClick = (row: ReturnType<typeof getLocalTaskList>[number]) => { // 单个报工
  emit('singleReport', row);
};

const batchReportVisible = ref(false);
const onCompleteClick = () => { // 批量报工
  if (multipleSelection.value.length === 0) {
    MpMessage.error('操作失败', '请选择任务');
    return;
  }

  if (multipleSelection.value.length === 1) {
    onSingleCompleteClick(multipleSelection.value[0]);
    return;
  }

  batchReportVisible.value = true;
};

const submitReport = () => {
  const cb = () => {
    batchReportVisible.value = false;
  };
  emit('report', multipleSelection.value.map(it => it.ID), cb);
};

const onErrorClick = (row: ReturnType<typeof getLocalTaskList>[number]) => { // 报错
  emit('error', row);
};

const curRowData = ref<ReturnType<typeof getLocalTaskList>[number] | null>(null);

const picVisible = ref(false);
const onPicDisplayClick = (row: ReturnType<typeof getLocalTaskList>[number]) => { // 查看示意图
  if (!row) return;
  curRowData.value = row;
  picVisible.value = true;
};

const downloadVisible = ref(false);
const onDownloadClick = (row: ReturnType<typeof getLocalTaskList>[number]) => { // 下载文件
  if (!row) return;
  curRowData.value = row;
  downloadVisible.value = true;
};

</script>

<style scoped lang='scss'>
.report-wrap {
  .table-wrap {
    margin-top: 25px;
    :deep(.el-table__header-wrapper) {
      display: none;
      th > .cell {
        font-size: 15px;
      }
    }
    :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
      border-top: 1px solid rgb(235, 238, 245);
      padding: 0;
      .cell {
        padding: 0 6px;
        height: 120px;
        line-height: 28px;
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        color: #444;
        > div {
          width: 100%;
          > p {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &.info {
            text-align: left;
            padding-left: 20px;
          }
        }

        .el-button {
          font-size: 16px;
          margin-top: -2px;
          &.is-disabled {
            color: #cbcbcb;
          }
        }
      }

      &.check-box-row {
        .cell {
          padding: 0;
          border-right: 1px solid rgb(235, 238, 245);
          min-width: 40px;
          > label {
            margin-right: -1px;
            width: 100%;
            height: 100%;
            justify-content: center;
          }
        }
      }
    }

  }
  .footer {
    padding-left: 13px;
    padding-top: 4px;

    .btn-box {
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-left: -30px;
      .el-button {
        font-size: 30px;
        width: 260px;
        height: 60px;
        --el-border-radius-base: 6px;
      }
    }
  }
}
</style>
