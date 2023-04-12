<template>
  <main class="main-wrap">
    <Table
      :TaskList="ManageListData.list"
      :loading="ManageListData.loading"
      :pageType="pageType"
      @setMultipleSelection="setMultipleSelection"
      @loadFile="onDownloadClick"
      @print="onPrintClick"
      @ConfirmExternal="onConfirmExternalClick"
    />
    <PrintDialog ref="oPrintDialog" :onlyPrint="onlyPrint" noAutoPrint @submit="submitExternal">
      <section class="outside-print-area" v-if="curRow">
        <main>
          <!-- 二维码 -->
          <div class="left">
            <div class="img-box">
              <img :src="imgSrc" alt="" v-show="imgSrc">
            </div>
            <p>ID: {{ curRow.Code }}</p>
          </div>
          <!-- 外协信息 -->
          <div class="right">
            <h2>{{ curRow._WorkingName }}</h2>
            <h2>数量：{{ curRow._Number }}</h2>
            <p>金额：<span v-show="curRow._ExternalSubmitParams.Amount || curRow._ExternalSubmitParams.Amount === 0"
                >￥{{ `${curRow._ExternalSubmitParams.Amount}`.replace(/(?=(\B)(\d{3})+$)/g, ',') }}元</span></p>
            <p class=f>工厂：{{ curRow._ExternalSubmitParams._FactoryName }}<span></span></p>
          </div>
        </main>
        <!-- 制作要求和时间 -->
        <footer>
          <div>
            <h2>制作要求：</h2>
            <span>{{ curRow._AssistText }}</span>
          </div>
          <p>打印时间：{{ curPrintData }}</p>
        </footer>
      </section>
    </PrintDialog>
  </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElTable } from 'element-plus';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { ManageListClass } from '../js/ManageListClass';
import { checkExTaskIsComplete } from '../js/utils';
import Table from './Table.vue';
import { OutsourceManagePageType } from '../js/type';

const props = defineProps<{
  ManageListData: Required<ManageListClass>
  pageType: OutsourceManagePageType
}>();

/* 设置多选 ↓
------------------------ */
const setMultipleSelection = (list: ManageListClass['multipleSelection'], oTableRef: InstanceType<typeof ElTable>) => {
  props.ManageListData.setMultipleSelection(list, oTableRef);
};

/* 文件下载相关 ↓
------------------------ */
const onDownloadClick = (row: ReturnType<typeof getLocalTaskList>[number]) => { // 下载文件
  if (!row) return;
  ManageListClass.downloadExTaskFiles([row]);
};

const curRow = ref<null | ReturnType<typeof getLocalTaskList>[number]>(null);

/* 打印工单
---------------------------------- */
const imgSrc = ref('');
const curPrintData = ref('');
const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();
const onlyPrint = ref(false);
const onPrintClick = async (row: ReturnType<typeof getLocalTaskList>[number], isConfirm: boolean, isPrint = true) => { // 下载文件 -- 此处按钮禁用判断暂时取反  待功能完成后改回 3.16
  if (!row || !oPrintDialog.value) return;
  curRow.value = row;
  imgSrc.value = '';
  curPrintData.value = '';
  onlyPrint.value = isPrint;

  const src = await getQRCodeSrc(row.Code); // 获取img src

  if (src) {
    imgSrc.value = src;
    curPrintData.value = format2LangTypeDate(getTimeConvertFormat({ withHMS: true }));

    if (!isPrint) {
      oPrintDialog.value.open();
    } else {
      oPrintDialog.value.print(`${row.Code}（外协单）`);
    }
  }
};

const submitExternal = async () => {
  if (!curRow.value) return;
  const bool = await ManageListClass.handleExternalConfirm([curRow.value], true);
  if (bool && oPrintDialog.value) {
    oPrintDialog.value.print(`${curRow.value.Code}（外协单）`);
  }
};

/* 单个任务确认外协 或 撤回
------------------------ */
const onConfirmExternalClick = (row: ReturnType<typeof getLocalTaskList>[number], isConfirm: boolean) => {
  if (!row) return;

  // 外协或撤回
  if (isConfirm) {
    const result = checkExTaskIsComplete(row);

    if (typeof result === 'string') {
      MpMessage.error('外协失败', result);
      return;
    }
    onPrintClick(row, isConfirm, false);
    return;
  }

  const title = isConfirm ? '确认外协该任务吗?' : '确认撤回该任务吗?';

  MpMessage.warn(title, `任务ID: [ ${row.Code} ]`, () => {
    ManageListClass.handleExternalConfirm([row], isConfirm);
  });
};

</script>

<style scoped lang='scss'>
.main-wrap {
  --el-border-radius-base: 2px;
  --el-component-size: 30px;

  :deep(.el-select) {
    line-height: 30px;
  }

  :deep(.mp-date-time-picker .el-date-editor) {
    width: 120px;
  }
}
</style>
