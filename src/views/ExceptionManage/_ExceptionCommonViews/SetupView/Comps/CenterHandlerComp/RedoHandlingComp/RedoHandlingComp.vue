<template>
  <!-- 重做 -->
  <div class="reproduction">
    <!-- 大版报工：大版工序列表 -->
    <ul v-if="ruleForm._ReportMode === ReportModeEnum.board && ruleForm.RedoInfo.PlateList.length === 1" class="board-working-list">
      <li v-for="it in ruleForm.RedoInfo.PlateList[0].WorkingList" :key="it.ID">
        <el-checkbox v-model="it.checked" :label="it.Name" />
        <el-checkbox v-model="it.ReceiveMaterial" v-if="it._ReceiveMaterial" label="重新领料" :class="{'hide': !it.checked}" />
        <el-checkbox v-model="it.PlateMaking" v-if="it._PlateMaking" label="重新制版" :class="{'hide': !it.checked}" />
      </li>
      <li v-if="ruleForm.RedoInfo.PlateList[0].WorkingList.length === 0" style="text-aligin: center; width: 100%;">
        <el-empty description="暂无可重做工序"></el-empty>
      </li>
    </ul>

    <!-- 订单报工：组合工序 -->
    <div class="union" v-if="ruleForm._ReportMode === ReportModeEnum.order && ruleForm.RedoInfo.UnionLine && ruleForm.RedoInfo.UnionLine.WorkingList.length> 0">
      <div class="u-title">
        <h4>{{ruleForm.RedoInfo.UnionLine.Name}}: {{Detail.TaskDetail.Working.OrderInfo?.Number || ''}}{{Detail.TaskDetail.Working.OrderInfo?.Unit || ''}}</h4>
      </div>
      <div class="u-content">
        <el-checkbox v-for="it in ruleForm.RedoInfo.UnionLine.WorkingList" :key="it.ID" v-model="it.checked" :label="it.Name" />
      </div>
    </div>

    <!-- 订单报工 和 块报工： 大版列表重做信息设置 -->
    <PlateRedoSetupList :ruleForm="ruleForm" v-if="ruleForm._ReportMode !== ReportModeEnum.board && ruleForm.RedoInfo.PlateList.length > 0" />
  </div>
</template>

<script setup lang='ts'>
import { ITaskExceptionDetail } from '@/views/ExceptionManage/_ExceptionCommonViews/js/type';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { computed } from 'vue';
import { HandleExceptionRuleForm } from '../../../js/HandleExceptionRuleForm';
import PlateRedoSetupList from './PlateRedoSetupList.vue';

const props = defineProps<{
  handleExceptionRuleForm: HandleExceptionRuleForm
  Detail: ITaskExceptionDetail
}>();

const ruleForm = computed(() => props.handleExceptionRuleForm);
</script>

<style scoped lang='scss'>
.reproduction {
  .board-working-list {
    display: flex;
    flex-wrap: wrap;

    > li {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      margin-right: 12px;

      > label {
        line-height: 24px;
        height: 24px;

        &.v-hide {
          visibility: hidden;
        }
        :deep(.el-checkbox__label) {
          min-width: 4em;
        }
        margin-right: 0;
      }

      :deep(.el-empty__description p) {
        font-size: 13px;
      }
    }
  }

  .union {
    border: 1px solid #e5e5e5;
    margin-bottom: 16px;
    .u-title {
      padding: 10px 30px;
      background-color: #f5f5f5;
      border-bottom: 1px solid #e5e5e5;
    }
    .u-content {
      padding: 10px 30px;
      :deep(.el-checkbox ) {
        height: 22px;
        .el-checkbox__label {
          min-width: 4em;
        }
      }
    }
  }
}
</style>
