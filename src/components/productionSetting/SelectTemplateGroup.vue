<template>
  <DialogContainerComp
    title="选择大版模板"
    :visible='localVisible'
    :width="660"
    @submit="submit"
    @open="onOpen"
    @cancel="onCancel"
    autoClose
    :disabled="!radio"
    primary-text="确定"
  >
    <div class="set-apply-equipment-dialog">
      <el-scrollbar max-height="350px">
        <el-radio-group v-model="radio">
          <el-radio v-for="it in ImpositionTemmplateList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
      </el-scrollbar>
    </div>
  </DialogContainerComp>
</template>
<script setup lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ImpositionTemmplateListType } from '@/store/modules/productionSetting/types';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean
  modelValue: string | null
  ImpositionTemmplateList: ImpositionTemmplateListType[]
}>();

const emit = defineEmits(['update:visible', 'update:modelValue']);

const radio = ref('');

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const onOpen = () => {
  if (!props.modelValue) {
    radio.value = '';
    return;
  }

  const ids = props.ImpositionTemmplateList.map(it => it.ID);
  radio.value = ids.includes(props.modelValue) ? props.modelValue : '';
};

const onCancel = () => {
  localVisible.value = false;
};

function submit() {
  emit('update:modelValue', radio.value);
  emit('update:visible', false);
}

</script>
<style lang="scss">
.set-apply-equipment-dialog{
  padding: 0 15px;
  margin-top: -12px;
  min-height: 125px;
  .el-radio-group{
    width: 100%;
    .el-radio{
      width: calc(25% - 10px);
      margin-right: 10px;
    }
  }
}
</style>
