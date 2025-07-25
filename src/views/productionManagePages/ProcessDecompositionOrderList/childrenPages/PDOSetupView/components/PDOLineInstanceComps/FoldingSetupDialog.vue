<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='500'
   :title="`设置折手参数：${instanceItem._LineInstanceName || instanceItem._lineData?.Name || ''}`"
   top='12vh'
   primaryText="确定"
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   >
   <ul class='dialog-content' v-if="ruleForm">
    <li>
      <div class="row">
        <span class="title">贴标:</span>
        <div>
          <el-checkbox v-model="ruleForm.NeedSheetIndex">添加贴标</el-checkbox>
          <p style="color: #aaa;font-size: 12px;">说明：折首后，叠帖数量为1时则设置无效</p>
        </div>
      </div>
    </li>
    <li>
      <div class="row">
        <span class="title">爬移:</span>
        <div>
          <div style="display: flex;align-items: center;">
            <el-checkbox v-model="ruleForm.MoveType" :true-label="MoveTypeEnum.Zoom" :false-label="MoveTypeEnum.None">设置爬移系数</el-checkbox>
            <el-input v-model.trim="ruleForm.MoveInValue" maxlength="9" v-show="ruleForm.MoveType === MoveTypeEnum.Zoom" class="ml-10"></el-input>
          </div>
          <div v-show="ruleForm.MoveType === MoveTypeEnum.Zoom">
            <p :class="{'is-gray': !instanceItem.Attribute.Material.Name}" style="margin-top: 12px;margin-bottom: 4px;"
            >物料：{{ [instanceItem.Attribute.Material.TypeName, instanceItem.Attribute.Material.Name].filter(Boolean).join('-') || '-' }}</p>
            <p style="color: #aaa;font-size: 12px;">说明：物料厚度X系数=单张纸爬移量(2P)</p>
          </div>
        </div>
      </div>
    </li>
    <li class="mb-6">
      <div class="row">
        <span class="title">掀口:</span>
        <div style="display: flex;align-items: center;">
          <el-checkbox v-model="ruleForm.GripperEdgePosition" :true-label="FeedEdgePositionEnum.Front" :false-label="FeedEdgePositionEnum.None"
          >设置掀口值</el-checkbox>
          <el-input v-model.trim="ruleForm.GripperEdgeValue" maxlength="9" v-show="ruleForm.GripperEdgePosition === FeedEdgePositionEnum.Front" class="ml-10"/>
        </div>
      </div>
    </li>
    <li>
      <div class="row">
        <span class="title">铣背:</span>
        <div>
          <div style="display: flex;align-items: center;">
            <el-checkbox v-model="ruleForm.HaveMilling">设置铣背值</el-checkbox>
            <el-input v-model.trim="ruleForm.MillingValue" maxlength="9" v-show="ruleForm.HaveMilling" class="ml-10"/>
          </div>
          <p style="color: #aaa;font-size: 12px;">说明：折首后，叠帖数量为1时则设置无效</p>
        </div>
      </div>
    </li>
   </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MoveTypeEnum, FeedEdgePositionEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { PDOLineInstanceType } from '../../model/Instance';
import { InstanceSettingInfo } from '../../model/InstanceSettingInfo';

const props = defineProps<{
  visible: boolean
  instanceItem: PDOLineInstanceType
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

const ruleForm = ref<null | InstanceSettingInfo>(null);

const onOpen = () => {
  ruleForm.value = new InstanceSettingInfo(props.instanceItem);
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
