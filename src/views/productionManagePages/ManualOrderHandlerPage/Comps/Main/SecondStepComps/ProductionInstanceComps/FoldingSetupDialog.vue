<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='500'
   :title="`设置折手参数：${instanceData._LineInstanceName || instanceData._originLineData?.Name || ''}`"
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   >
   <ul class='dialog-content' v-if="ruleForm">
    <li>
      <div class="row">
        <span class="title">帖标:</span>
        <el-checkbox v-model="ruleForm.NeedSheetIndex">添加帖标</el-checkbox>
      </div>
    </li>
    <li>
      <div class="row">
        <span class="title">爬移使用:</span>
        <el-radio-group v-model="ruleForm.MoveType">
          <el-radio v-for="it in MoveTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </div>
      <div class="row" :class="{hide: ruleForm.MoveType === MoveTypeEnum.None}">
        <span class="title">爬移量:</span>
        <div class="right">
          <div class="pb-10">
            <el-checkbox v-model="ruleForm._CheckedMoveIn">内爬移:</el-checkbox>
            <el-input v-model.trim="ruleForm.MoveInValue" maxlength="9" v-show="ruleForm._CheckedMoveIn"></el-input>
            <span class="unit" v-show="ruleForm._CheckedMoveIn">mm</span>
          </div>
          <div class="pb-8">
            <el-checkbox v-model="ruleForm._CheckedMoveOut">外爬移:</el-checkbox>
            <el-input v-model.trim="ruleForm.MoveOutValue" maxlength="9" v-show="ruleForm._CheckedMoveOut"></el-input>
            <span class="unit" v-show="ruleForm._CheckedMoveOut">mm</span>
          </div>
        </div>
      </div>
    </li>
    <li class="mb-6">
      <div class="row">
        <span class="title">叼口空白:</span>
        <el-radio-group v-model="ruleForm.FeedEdgePosition">
          <el-radio v-for="it in FeedEdgePositionList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </div>
      <div class="row" :class="{hide: ruleForm.FeedEdgePosition === FeedEdgePositionEnum.None}">
        <span class="title">叼口空白尺寸:</span>
        <div>
          <el-input v-model.trim="ruleForm.FeedEdgeValue" maxlength="9"></el-input>
          <span class="unit">mm</span>
        </div>
      </div>
    </li>
    <li>
      <div class="row">
        <span class="title">铣背深度设为:</span>
        <div>
          <el-input v-model.trim="ruleForm.MillingValue" maxlength="9"></el-input>
          <span class="unit">mm</span>
        </div>
      </div>
    </li>
   </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { PlaceOrderProductionInstance } from '@/views/productionManagePages/ManualOrderHandlerPage/js/PlaceOrderProductionInstance';
import { InstanceSettingsOnMakeupFileClass } from '@/views/productionManagePages/ManualOrderHandlerPage/js/InstanceSettingsOnMakeupFileClass';
import { MoveTypeEnum, FeedEdgePositionEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { MoveTypeEnumList, FeedEdgePositionList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/EnumList';

const props = defineProps<{
  visible: boolean
  instanceData: Required<PlaceOrderProductionInstance>
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | InstanceSettingsOnMakeupFileClass>(null);

const onOpen = () => {
  ruleForm.value = new InstanceSettingsOnMakeupFileClass(props.instanceData);
};

const submit = () => {
  if (!ruleForm.value) return;
  const params = ruleForm.value.getParams();
  if (!params) return;

  emit('submit', params);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -40px;
 margin-left: -10px;
 margin-right: -10px;
 color: #444;

 > li {
  div.row {
    display: flex;
    padding-bottom: 10px;
    span.title {
      font-weight: 700;
      line-height: 30px;
      width: 125px;
      text-align: right;
      margin-right: 15px;
    }
    :deep(.el-checkbox__label) {
      color: #444;
    }
    :deep(.el-radio) {
      &:not(:first-of-type) .el-radio__label {
        display: inline-block;
        width: 56px;
      }
      &:first-of-type .el-radio__label {
        display: inline-block;
        width: 45px;
      }
    }

    :deep(.el-input) {
      width: 100px;
      --el-border-radius-base: 3px;
      height: unset;
      --el-component-size: 28px;
    }
    .unit {
      margin-left: 5px;
      font-size: 12px;
    }

    .right {
      > div {
        display: flex;
        align-items: center;

        > label {
          margin-right: 15px;
        }
      }
    }

    &.hide {
      visibility: hidden;
    }
  }

  padding-top: 10px;
  & + li {
    border-top: 1px solid #eee;
  }

  &:last-of-type {
    padding-top: 18px;
  }
 }
}
</style>
