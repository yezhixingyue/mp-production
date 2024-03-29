<template>
  <footer class="footer-wrap" :class="{await: pageType === 'await'}">
    <div class="ctrl" v-if="pageType === 'await'">
      <div class="left">
        <span>批量操作选中文件:</span>
        <mp-button type="primary" :disabled="loadDisabled" :title="loadDisabledTitle" link @click="onBatchDownloadClick">批量下载已选工单文件</mp-button>
        <mp-button type="primary" :disabled="confirmDisabled" :title="confirmDisabledTitle" link @click="onBatchConfirmClick">批量确认已选工单外协</mp-button>
      </div>
      <div class="right">
        <span>共检索出</span><i class="is-blue is-bold ml-2 mr-2"> {{ManageListData.listNumber}} </i><span>条记录</span>
      </div>
    </div>
    <MpPagination center :nowPage="ManageListData.condition.Page" :pageSize="ManageListData.condition.PageSize"
     :total="ManageListData.listNumber" :handlePageChange="getList" :ExportExcelProps="downloadExcelObj" />
  </footer>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MpPagination from '@/components/common/MpPagination.vue';
import { IExportExcelCondition, IExportExcelProps } from '@/components/common/General/DownLoadExcelComp/types';
import { computed, ComputedRef } from 'vue';
import { ExternalTaskStatusEnum } from '../js/enum';
import { ManageListClass } from '../js/ManageListClass';
import { OutsourceManagePageType } from '../js/type';
import { Condition } from '../js/Condition';
import { checkExTaskIsComplete, getCanNotDownload } from '../js/utils';

const props = defineProps<{
  ManageListData: Required<ManageListClass>
  pageType: OutsourceManagePageType
}>();

const getList = (page: number) => {
  props.ManageListData.getList(page);
};

const confirmDisabled = computed(() => {
  if (props.ManageListData.multipleSelection.length === 0) return true;

  // 找到不能下载文件的项目 - 如果存在则不允许下载
  const t = props.ManageListData.multipleSelection.find(it => it.Working.ExternalAttribute.Status !== ExternalTaskStatusEnum.WaitFactoryReceive);
  if (t) return true;

  return false;
});

const confirmDisabledTitle = computed(() => {
  if (props.ManageListData.multipleSelection.length === 0) return '未选中订单';

  // 找到不能下载文件的项目 - 如果存在则不允许下载
  const t = props.ManageListData.multipleSelection.filter(it => it.Working.ExternalAttribute.Status !== ExternalTaskStatusEnum.WaitFactoryReceive);
  if (t) return '选中工单中存在不可确认的工单';

  return '';
});

const loadDisabled = computed(() => {
  if (props.ManageListData.multipleSelection.length === 0) return true;

  // 找到不能下载文件的项目 - 如果存在则不允许下载
  const t = props.ManageListData.multipleSelection.find(it => !getCanNotDownload(it));
  if (t) return true;

  return false;
});

const loadDisabledTitle = computed(() => {
  if (props.ManageListData.multipleSelection.length === 0) return '未选中订单';

  // 找到不能下载文件的项目 - 如果存在则不允许下载
  const t = props.ManageListData.multipleSelection.filter(it => !getCanNotDownload(it));
  if (t) return '选中工单中存在不可下载的工单';

  return '';
});

const onBatchDownloadClick = () => { // 批量下载
  if (loadDisabled.value) return;
  MpMessage.warn('确定批量下载已选工单文件吗 ?', `共选中订单 ${props.ManageListData.multipleSelection.length} 个`, () => {
    ManageListClass.downloadExTaskFiles(props.ManageListData.multipleSelection);
  });
};

const onBatchConfirmClick = () => { // 批量确认
  if (confirmDisabled.value) return;
  // 1. 校验
  for (let i = 0; i < props.ManageListData.multipleSelection.length; i += 1) {
    const row = props.ManageListData.multipleSelection[i];
    const result = checkExTaskIsComplete(row);

    if (typeof result === 'string') {
      MpMessage.error('外协失败', props.ManageListData.multipleSelection.length > 1 ? `第${i + 1}个选中订单中，${result}` : result);
      return;
    }
  }

  // 2. 提交
  MpMessage.warn({
    title: '确定批量确认已选工单外协吗 ?',
    msg: `共选中订单 ${props.ManageListData.multipleSelection.length} 个`,
    onOk: () => {
      ManageListClass.handleExternalConfirm(props.ManageListData.multipleSelection, true);
    },
  });
};

const downloadExcelObj: ComputedRef<IExportExcelProps | undefined> = computed(() => { // 导出Excel
  if (props.pageType === 'all') {
    const condition = props.ManageListData.condition.filter() as IExportExcelCondition;
    const fileDate = {
      First: (condition.FinishTime as Condition['FinishTime']).First,
      Second: (condition.FinishTime as Condition['FinishTime']).Second,
    };

    return {
      apiPath: 'getExternalTaskExcel',
      fileName: '外协任务列表',
      condition,
      fileDate,
    };
  }
  return undefined;
});

</script>

<style scoped lang='scss'>
.footer-wrap {
  .ctrl {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #444;
    padding-left: 20px;
    padding-right: 100px;
    button {
      font-size: 12px;
      margin-left: 30px;
    }
  }

  &.await {
    :deep(.mp--pagination ) {
      margin-top: 12px;
      .count {
        visibility: hidden;
      }
    }
  }
}
</style>
