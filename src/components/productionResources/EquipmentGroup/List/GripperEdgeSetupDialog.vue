<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   :title='`叼口设置：${EquipmentGroupData.curEditItem?.Name || ""}`'
   top='18vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   >
   <ul class='dialog-content'>
    <template v-if="gripperSetupData">
        <li>
            <h4>叼口空白：</h4>
            <el-radio-group v-model="gripperSetupData.BiteMouthType">
                <el-radio v-for="it in GripperTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
            </el-radio-group>
        </li>
        <li :class="{disabled: gripperSetupData.BiteMouthType === GripperTypeEnum.empty}">
            <h4>叼口空白尺寸：</h4>
            <el-input
              style="width: 300px;"
              v-model.number="gripperSetupData.BiteMouthSize"
              maxlength="9"
              :disabled="gripperSetupData.BiteMouthType === GripperTypeEnum.empty"
            ></el-input>
            <em>mm</em>
        </li>
    </template>
   </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { GripperSetupClass, GripperTypeEnumList, GripperTypeEnum } from '@/store/modules/resource/EquipmentGroupTypeClass/GripperSetupClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';

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

const gripperSetupData = ref<GripperSetupClass | null>(null);

const onOpen = () => {
  gripperSetupData.value = new GripperSetupClass(props.EquipmentGroupData.curEditItem);
};

const submit = () => {
  if (!gripperSetupData.value) return;
  const err = gripperSetupData.value._validate();

  if (err) {
    MpMessage.error('保存失败', err);
    return;
  }

  emit('submit', gripperSetupData.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -15px;
 min-height: 135px;
 max-height: 360px;
 overflow: auto;
 overflow: overlay;

 @include scroll;

 > li {
    display: flex;
    align-items: center;
    color: #444;
    margin-bottom: 15px;
    :deep(.el-radio__label) {
        font-size: 14px;
    }

    > h4 {
        width: 132px;
        text-align: right;
        letter-spacing: 1px;
        margin-right: 12px;
    }

    > em {
        color: #888;
        margin-left: 5px;
    }

    &.disabled {
        color: #A1A1A1;
    }
 }
}
</style>
