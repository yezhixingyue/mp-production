<template>
  <div class="center column scroll">
    <!-- 标题 -->
    <p class="mp-common-title-wrap black mb-15">处理方式：</p>
    <!-- 处理方式 -->
    <div class="solvetype">
      <el-radio-group v-model="ruleForm.SolveType">
        <el-radio v-for="it in SolveTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
      </el-radio-group>
    </div>
    <!-- 撤销处理 -->
    <RevocationInfoHandleComp v-if="ruleForm.SolveType === SolveTypeEnum.rollbackBeforeMakeup" :handleExceptionRuleForm="handleExceptionRuleForm" />
    <!-- 重做处理 -->
    <RedoHandlingComp v-if="ruleForm.SolveType === SolveTypeEnum.remake"
     :handleExceptionRuleForm="handleExceptionRuleForm" :Detail="TaskExceptionDetail" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { SolveTypeEnum } from '../../js/enum';
import { SolveTypeEnumList } from '../../js/EnumList';
import { HandleExceptionRuleForm } from '../../js/HandleExceptionRuleForm';
import RevocationInfoHandleComp from './RevocationInfoHandleComp/RevocationInfoHandleComp.vue';
import RedoHandlingComp from './RedoHandlingComp/RedoHandlingComp.vue';
import { ITaskExceptionDetail } from '../../../js/type';

const props = defineProps<{
  handleExceptionRuleForm: HandleExceptionRuleForm
  TaskExceptionDetail: ITaskExceptionDetail
}>();

const ruleForm = computed(() => props.handleExceptionRuleForm);

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.center {
  width: 520px;
  min-width: 360px;
  padding-right: 70px;
  padding-left: 25px;

  @include scroll;

  .solvetype {
    margin-bottom: 10px;
  }

  :deep(.el-radio) {
      margin-right: 20px;
      height: 28px;

      .el-radio__label {
        display: inline-block;
        min-width: 5em;
      }

      &:first-child {
        .el-radio__label {
          min-width: 7em;
        }
      }

      &:last-child {
        margin-right: 0;
        .el-radio__label {
          min-width: 3em;
        }
      }
    }

  :deep(.el-checkbox) {
    margin-right: 20px;
    height: 28px;

    .el-checkbox__label {
      display: inline-block;
      min-width: 5em;
    }

    // &:first-child {
    //   .el-checkbox__label {
    //     min-width: 6em;
    //   }
    // }

    &:last-child {
      margin-right: 0;
      .el-checkbox__label {
        min-width: 3em;
      }
    }
  }

 > div {
    width: 100%;
  }
}
</style>
