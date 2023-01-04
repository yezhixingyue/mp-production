<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose title="设置尺寸限制" @submit="submit" @open="onOpen" :width="700">
    <div v-if="ruleForm" class="content-wrap">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>长</th>
            <th></th>
            <th>宽</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="t">最小尺寸：</td>
            <td>
              <el-input type="number" v-model.number="ruleForm.MinLength"></el-input>
            </td>
            <td class="m">
              <i>×</i>
            </td>
            <td>
              <el-input type="number" v-model.number="ruleForm.MinWidth"></el-input>
            </td>
            <td class="end">
              <i>mm</i>
            </td>
          </tr>
          <tr>
            <td class="t">最大尺寸：</td>
            <td>
              <el-input type="number" v-model.number="ruleForm.MaxLength"></el-input>
            </td>
            <td class="m">
              <i>×</i>
            </td>
            <td>
              <el-input type="number" v-model.number="ruleForm.MaxWidth"></el-input>
            </td>
            <td class="end">
              <i>mm</i>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="tips-box is-orange">
        <span class="label"><el-icon><WarningFilled /></el-icon></span>
        <div>
          <p><i>1.</i> -1表示无限；</p>
          <p><i>2.</i> 限制范围含最大和最小尺寸；</p>
          <p><i>3.</i> 长宽指的是：面向机器，左右方向为长，上下（或前后）方向为宽；</p>
        </div>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MaterialTypeLimitItemType } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { GroupSizeLimitClass } from '@/store/modules/resource/EquipmentGroupTypeClass/GroupSizeLimitClass';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  originData: MaterialTypeLimitItemType | null
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

const ruleForm = ref<null | GroupSizeLimitClass>(null);

const onOpen = () => { // 初始化
  const temp = props.originData ? {
    ID: props.originData.ID,
    MinWidth: props.originData.MinSizeWidh,
    MaxWidth: props.originData.MaxSizeWidh,
    MinLength: props.originData.MinSizeLength,
    MaxLength: props.originData.MaxSizeLength,
  } : null;
  ruleForm.value = new GroupSizeLimitClass(temp);
};

const submit = () => {
  if (!ruleForm.value) return;
  const res = ruleForm.value.validate();
  if (!res) return;
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';
@import '@/assets/css/mixins.scss';

.content-wrap {
  padding: 20px;
  padding-top: 0;
  margin: 0 auto;
  margin-top: -20px;
  min-height: 240px;
  width: 460px;
  > table {
    > thead {
      color: #888;
      font-size: 12px;
      th {
        font-weight: 400;
        padding-bottom: 4px;
      }
    }
    > tbody {
      > tr {
        > td {
          padding-bottom: 18px;
          :deep(.el-input) {
            width: 100px;
            border-radius: 3px;
          }
          &.t {
            font-weight: 700;
            color: #888;
            padding-right: 2px;
          }
          &.m i, &.end i{
            margin: 0 15px;
            color: #888;
            font-size: 14px;
          }
          &.end i {
            font-size: 12px;
          }
        }
      }
    }
  }
  .tips-box {
    font-size: 12px;
    letter-spacing: 0.5px;
    margin-top: 20px;
    display: flex;
    background-color: #fff;
    > span.label {
      line-height: 35px;
      > i {
        font-size: 14px;
        margin-right: 10px;
      }
    }
    > div {
      > p {
        line-height: 30px;
        i {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
