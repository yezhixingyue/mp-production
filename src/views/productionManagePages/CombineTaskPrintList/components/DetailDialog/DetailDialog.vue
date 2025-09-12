<template>
  <DialogContainerComp :visible='visible' :width='775' title='组合工序电子工单' top='6vh'
   @cancel='visible = false' :loading="loading" :disabled="!taskDetail || !user?.PermissionList.PermissionManageUnionTask.Obj.Print"
    :showClose="taskDetail?.List.length===0" :showPrimary="!!taskDetail?.List.length" closeBtnText="关闭"
     :showFooter="!isClientUse" primaryText="打印工单" @closed="emit('close')" @open='onOpen' @submit='submit'>
    <div class='dialog-content' :class="{client: isClientUse}">
      <div style="color: #444; font-size: 13px;" class="box">
        <!-- 标题部分 -->
        <Header :taskDetail="taskDetail" />

        <!-- 订单信息表格 -->
        <OrderInfo :taskDetail="taskDetail" />

        <!-- 生产资源清单 -->
        <TaskResourceList :taskDetail="taskDetail" />

        <!-- 报工处相关操作 -->
        <div v-if="isClientUse && taskDetail && taskDetail.List.length > 0" class="info">
          <!-- 发生变更 -->
          <p v-if="taskDetail.HaveChange" style="color: #FF0000;font-size: 16px;margin-bottom: 10px;">
            <i class="iconfont icon-jingshi mr-10"></i>
            <span>此任务发生了变更，请仔细核对或重新打印工单！</span>
          </p>

          <!-- 全部生产完成 但未全部送达 -->
          <p v-if="!isAllReceived && isAllProduced" style="color: #F6B437;font-size: 16px; margin-bottom: 10px;">
            <el-icon style="font-size: 20px;margin-right: 9px;vertical-align: -4px;margin-left: -1px;"><WarningFilled /></el-icon>
            <span>所有需要的生产资源均已生产完毕！</span>
          </p>

          <!-- 全部送达 -- 设置齐整人 -->
          <div v-if="isAllReceived && !taskDetail.ReadyOperator" class="received">
            <p>
              <el-icon><WarningFilled /></el-icon>
              <span>所有生产资源均已送达</span>
            </p>

            <div v-if="EquipmentID === taskDetail.Equipment.ID">
              <span class="ft-14 bold">选择齐整人：</span>
              <!-- <el-input v-model.trim="arrangeState.mobile" placeholder="输入手机号查找" maxlength="11" @keyup.enter="onArrangeClick" /> -->
              <el-select v-model="arrangeState.staffId" filterable remote reserve-keyword placeholder="输入手机号查找"
                :remote-method="remoteStaffList" :loading="arrangeState.loading" @change="onArrangeStaffChange">
                <el-option
                  v-for="item in arrangeState.staffList" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID"
                />
              </el-select>
              <mp-button type="primary" class="gradient" @click="onArrangeClick">所有生产资源已齐整</mp-button>

              <setArrangeDialog v-model:visible="arrangeState.visible" :staff="arrangeState.staff" :taskDetail="taskDetail" @submit="submitArrange" />
            </div>
          </div>

          <!-- 全部送达 -- 已设置齐整人 -->
          <div v-if="isAllReceived && taskDetail.ReadyOperator" style="color: #28D200;font-size: 16px;margin-bottom: 10px;">
            <i class="iconfont icon-a-jianqu196 mr-10 ft-18"></i>
            <span>本任务所有生产资源已齐整！—— {{ taskDetail.ReadyOperator }}</span>
          </div>
        </div>
      </div>
    </div>
  </DialogContainerComp>

  <PrintArea ref="oPrintDialog" onlyPrint :printStyle="printStyle" v-if="!isClientUse">
    <div class="combint-task-print-wrap">
      <h2>组合工序任务工单</h2>
      <div class="qrCode">
        <img :src="qrCodeSrc" alt="" v-if="qrCodeSrc">
        <p>{{ taskDetail?.WorkCode }}</p>
      </div>

      <Header :taskDetail="taskDetail" isPrint />
      <OrderInfo :taskDetail="taskDetail" />
      <TaskResourceList :taskDetail="taskDetail" isPrint />
    </div>
  </PrintArea>
</template>

<script setup lang='ts'>
import api from '@/api';
import { ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import PrintArea from '@/components/common/General/Print/PrintDialog.vue';
import { IUnionTaskDetail, IUnionTaskTrackInfo } from '../../types/type';
import Header from './Header.vue';
import OrderInfo from './OrderInfo.vue';
import TaskResourceList from './TaskResourceList.vue';
import { useStatus } from './hooks/useStatus';
import { useArrange } from './hooks/useArrange';
import { usePrint } from './hooks/usePrint';
import setArrangeDialog from './setArrangeDialog.vue';

const props = defineProps<{
  row?: IUnionTaskTrackInfo | null
  detail?: IUnionTaskDetail | null
  isClientUse?: boolean
  EquipmentID?: string
}>();

const emit = defineEmits(['close', 'completed']);

const visible = defineModel<boolean>('visible');

const loading = ref(false);
const taskDetail = ref<null | IUnionTaskDetail>(null);

const { isAllReceived, isAllProduced } = useStatus(taskDetail); // 资源状态
const { arrangeState, clearArrangeState, submitArrange, remoteStaffList, onArrangeStaffChange, onArrangeClick } = useArrange(taskDetail, emit); // 设置齐整
const { oPrintDialog, qrCodeSrc, submit, printStyle, user } = usePrint(taskDetail); // 打印相关

const onOpen = async () => { // 弹窗打开 -- 初始化数据 | 详情数据获取
  taskDetail.value = null;
  clearArrangeState();

  if (!props.row) {
    taskDetail.value = props.detail || null;
    return;
  }

  loading.value = true;
  const resp = await api.productionManageApis.getTaskUnionWorkingDetail(props.row.ID, () => {
    visible.value = false;
  });
  loading.value = false;

  if (resp.data?.isSuccess) {
    taskDetail.value = resp.data.Data;
  }
};

</script>

<style scoped lang='scss'>
// @import '@/assets/css/mixins.scss';

.dialog-content {
  margin: -30px 0 -15px;
  // min-height: 160px;
  // max-height: 360px;
  // overflow: auto;
  // overflow: overlay;
  // @include scroll;

  height: 630px;

  &.client {
    height: 710px;
  }

  .box {
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;

    > * {
      flex: none;
    }

    :deep(.task-resource-list-comp-wrap) {
      flex: 1;
      overflow: hidden;

      display: flex;
      flex-direction: column;

      > * {
        flex: none;
      }

      > .table-box {
        flex: 1;
        overflow: auto;

        thead {
          position: sticky;
          top: 0;
          z-index: 9;
        }
      }
    }

    > .info {
      border-top: 1px solid #eee;
      margin: 20px -15px -5px;
      padding: 16px 15px 10px;

      .received {
        font-size: 16px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        > p {
          color: #26BCF9;

          i {
            font-size: 20px;
            margin-right: 9px;
            vertical-align: -4px;
            margin-left: -1px;
          }
        }

        > div {
          display: flex;
          align-items: center;
          .el-select {
            margin-right: 25px;
            width: 150px;

            :deep(.el-input) {
              --el-input-border-radius: 2px;
              --el-input-height: 30px;
            }
          }

          .el-button {
            height: 30px;
            font-size: 14px;
            width: 160px;
          }
        }
      }
    }
  }
}
</style>
