<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose title="设置印色数量限制" @submit="submit" @open="onOpen" :width="700" top="22vh">
    <div v-if="ruleForm" class="content-wrap">
      <div class="box">
        <span class="label">印色数量限制：</span>
        <el-input v-model.trim="ruleForm.ColorLimitContent" maxlength="20" show-word-limit></el-input>
        <i>色</i>
      </div>
      <div class="tips-box is-orange">
        <span class="label"><el-icon><WarningFilled /></el-icon></span>
        <div>
          <p>多种数量使用半角逗号“,”分隔，不限制则不填，例如：4,6色   指仅允许四色或六色</p>
        </div>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { GroupColorLimitClass } from '@/store/modules/resource/EquipmentGroupTypeClass/GroupColorLimitClass';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  EquipmentGroupData: Required<EquipmentGroupTypeClass>
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

const ruleForm = ref<null | GroupColorLimitClass>(null);

const onOpen = () => { // 初始化
  ruleForm.value = new GroupColorLimitClass(props.EquipmentGroupData.curEditItem);
};

const submit = () => {
  if (!ruleForm.value) return;
  const res = ruleForm.value.validate(props.EquipmentGroupData.curEditItem?.ColorLimitContent || '');
  if (!res) return;
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';

.content-wrap {
  padding: 20px;
  margin: 0 auto;
  padding-top: 0;
  width: 520px;
  > div.box {
    > .label {
      font-weight: 700;
      color: #888;
    }
    > .el-input {
      width: 400px;
    }
    > i {
      font-size: 12px;
      color: #888;
      margin-left: 10px;
    }
  }
  .tips-box {
    font-size: 12px;
    letter-spacing: 0.5px;
    margin-top: 12px;
    display: flex;
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
