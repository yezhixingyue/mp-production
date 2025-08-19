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
      @issue="onIssueClick"
      @changeAssistText="onAssistTextChangeClick"
    />

    <PrintDialog ref="oPrintDialog" :onlyPrint="onlyPrint" noAutoPrint @submit="submitExternal" :width="dpiHelper.mm2Px(210) + 70">
      <div class="outside-print-area-wrap">
        <section class="outside-print-area" v-if="curRow">
          <header>
            <div class="left">
              <p class="title">凌顶揽众工序外协加工单</p>
              <p class="line">{{ curRow._LineName }}：{{ curRow._TargetID.replace(/（[\w\W]+）$/, '') }}</p>
              <p class="info">
                <span style="margin-right: 1.2em;">创建时间：{{ curRow._CreateTime }}</span>
                <span>外协单位：{{ curentFactory?.Name }}</span>
                <span style="margin-right: 1.2em;">({{ curentFactory?.Mobile }})</span>
                <span style="margin-right: 1.2em;">开单人：{{ onlyPrint ? curRow.Operator : user?.StaffName || '-' }}</span>
                <span>开单时间：{{ onlyPrint ? curRow._StartTime : curPrintDate.slice(0, -3) }}</span>
              </p>
            </div>
            <div class="bar">
              <img :src="imgSrc" alt="" v-show="imgSrc">
              <span style="margin-top: -0.28em;display: block;">{{ curRow.Code }}</span>
            </div>
          </header>

          <main>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">物料信息</th>
                  <th style="width: 18%;">{{ curRow._PrintMaterialSizeTitle }}</th>
                  <th style="width: 18%;">返货数量</th>
                  <th style="width: 11%;">申放</th>
                  <th >外协价格</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="font-size: 0.85em;">{{ curRow._Material || '-' }}</div>
                  </td>
                  <td>
                    <div>{{ curRow._Size || '-' }}</div>
                  </td>
                  <td>{{ curRow._Number || '-' }}</td>
                  <td>{{ curRow._Wastage || '-' }}</td>
                  <td>{{ `${curRow._ExternalSubmitParams.Amount}`.replace(/(?=(\B)(\d{3})+$)/g, ',') }}元</td>
                </tr>
              </tbody>
            </table>

            <table>
              <thead>
                <tr>
                  <th style="width: 18%;">工序名称</th>
                  <th style="width: 54%;">加工要求</th>
                  <th >返货时间</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div>{{ curRow._WorkingName }}</div></td>
                  <!-- <td><div style="font-size: 0.85em;">{{ [curRow._AssistText, curRow._SpecialColorText].filter(it => it).join('；') || '-' }}</div></td> -->
                  <td><div style="font-size: 0.85em;">{{ curRow._AssistText || '-' }}</div></td>
                  <td>{{ curRow._ExternalSubmitParams.WishFinishTime?.split('T')[0] }}</td>
                </tr>
              </tbody>
            </table>
          </main>

          <!-- 时间 -->
          <footer>
            <span>打单人：{{ user?.StaffName || '-' }}</span>
            <span>联系电话：{{ user?.Mobile || '-' }}</span>
            <span>打印时间：{{ curPrintDate }}</span>
            <div>验收人：</div>
          </footer>
        </section>
      </div>
    </PrintDialog>

    <HandleResultDialog v-if="pageType==='await'" v-model:visible="visible" :row="curIssueRow" mode="issue" @setQuestion="e=>onIssueSubmit(e, ManageListData)"/>
    <ChangeAssistTextDialog v-if="pageType==='await'" v-model:visible="assistTextChangeState.visible" :row="assistTextChangeState.row" />
  </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElTable } from 'element-plus';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { getBarcodeSrc } from '@/components/common/General/Print/utils';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { dpiHelper } from '@/assets/js/utils/dpiHelper';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { ManageListClass } from '../../js/ManageListClass';
import { checkExTaskIsComplete } from '../../js/utils';
import Table from '../Table.vue';
import { OutsourceManagePageType } from '../../js/type';
import { useIssue } from './useIssue';
import HandleResultDialog from '../../ExternalReceiveManage/Comps/HandleResultDialog/HandleResultDialog.vue';
import { useAssistTextChange } from './useAssistTextChange';
import ChangeAssistTextDialog from './ChangeAssistTextDialog.vue';
import { ExternalTaskStatusEnum } from '../../js/enum';

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

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
const curPrintDate = ref('');
const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();
const onlyPrint = ref(false);
const curentFactory = ref<null | ManageListClass['FactoryList'][number]>(null);
const onPrintClick = async (row: ReturnType<typeof getLocalTaskList>[number], isConfirm: boolean, isPrint = true) => { // 下载文件 -- 此处按钮禁用判断暂时取反  待功能完成后改回 3.16
  if (!row || !oPrintDialog.value) return;
  curRow.value = row;
  imgSrc.value = '';
  curPrintDate.value = '';
  onlyPrint.value = isPrint;

  const fId = row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive
    ? curRow.value?._ExternalSubmitParams.FactoryID || ''
    : row.Equipment.ID;

  curentFactory.value = props.ManageListData.FactoryList.find(it => it.ID === fId) || null;

  const src = await getBarcodeSrc(row.Code, { width: 160, height: 50 }); // 获取img src

  if (src) {
    imgSrc.value = src;
    curPrintDate.value = format2LangTypeDate(getTimeConvertFormat({ withHMS: true }));

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

/** 单个任务设置有问题 */
const { visible, onIssueClick, curIssueRow, onIssueSubmit } = useIssue();

/** 修改待外协加工信息 */
const { assistTextChangeState, onAssistTextChangeClick } = useAssistTextChange();
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
:deep(.outside-print-area-wrap) {
  // background-color: #eee;
  // border-radius: 2px;
  width: unset;
  height: unset;
}
</style>
