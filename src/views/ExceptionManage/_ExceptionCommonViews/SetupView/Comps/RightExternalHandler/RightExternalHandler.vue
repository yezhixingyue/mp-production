<template>
  <div class="right column scroll">
    <p class="mp-common-title-wrap black mb-15">外协处理：</p>
    <ul>
      <li>
        <span>外协减款：</span>
        <el-input maxlength="9" v-model.trim="ruleForm.ReduceAmount" style="width:120px"></el-input>
        <span class="ml-10">元</span>
      </li>
      <li>
        <el-checkbox v-model="_FixedFactoryValue" label="锁定外协工厂" />
        <el-select v-model="ruleForm._FixedFactoryID" style="width:160px;margin-left: 20px;" v-show="_FixedFactoryValue">
          <el-option v-for="item in ruleForm._FactoryList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </li>
      <li>
        <el-checkbox v-model="_ExceptFactoryValue" label="排除当前外协工厂" />
      </li>
      <li>
        <el-checkbox v-model="ruleForm._IsFixedAmount" label="锁定外协金额" />
        <el-input v-show="ruleForm._IsFixedAmount" maxlength="9" style="width:120px;margin: 0 10px 0 20px;" v-model.trim="ruleForm.FixedAmount"></el-input>
        <span v-show="ruleForm._IsFixedAmount">元</span>
      </li>
      <li>
        <el-checkbox v-model="ruleForm._IsChangeContent" label="修改加工信息" />
        <span class="is-gray ml-20 p-content" :title="ruleForm._originProcessContent">原加工信息：{{ ruleForm._originProcessContent }}</span>
      </li>
      <li style="padding-left: 23px;" v-show="ruleForm._IsChangeContent">
        <el-input v-model.trim="ruleForm.ProcessContent" :rows="4"  type="textarea" maxlength="100" />
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { ExternalErrorLimitTypeEnum } from '../../js/enum';
import { RightExternalClass } from '../../js/RightExternalClass';

const props = defineProps<{
  ExternalRuleForm: RightExternalClass
}>();

const ruleForm = computed(() => props.ExternalRuleForm);

const _FixedFactoryValue = computed({
  get() {
    return ruleForm.value.LimitType === ExternalErrorLimitTypeEnum.Fixed;
  },
  set(val) {
    ruleForm.value.LimitType = val ? ExternalErrorLimitTypeEnum.Fixed : ExternalErrorLimitTypeEnum.None;
  },
});

const _ExceptFactoryValue = computed({
  get() {
    return ruleForm.value.LimitType === ExternalErrorLimitTypeEnum.Except;
  },
  set(val) {
    ruleForm.value.LimitType = val ? ExternalErrorLimitTypeEnum.Except : ExternalErrorLimitTypeEnum.None;
  },
});

</script>

<style scoped lang='scss'>
.right {
  width: 380px;
  padding-left: 50px;
  padding-right: 50px;
  min-width: 300px;
  > ul {
    padding-left: 13px;
    font-size: 12px;
    line-height: 30px;

    > li {
      display: flex;
      --el-component-size: 30px;
      --el-border-radius-base: 2px;
      margin-bottom: 13px;

      :deep(.el-checkbox) {
        height: 30px;
        line-height: 30px;
      }
      &:nth-of-type(3), &:nth-of-type(5) {
        line-height: 24px;
        :deep(.el-checkbox) {
          height: 24px;
          line-height: 24px;
        }
      }

      .p-content {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:nth-of-type(5) {
        margin-bottom: 4px;
      }

      :deep(.el-textarea__inner) {
        font-size: 12px;
      }
    }
  }

  &.v-part-hide {
    > ul {
      > li {
        visibility: hidden;
        &:first-of-type {
          visibility: visible;
        }
      }
    }
  }
}
</style>
