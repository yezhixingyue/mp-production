<template>
  <DialogContainerComp
    :title="`添加半成品:`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="semiFinished-select-content">
      <el-radio-group v-model="radio">
        <el-radio
          v-for="it in AllMaterialSources"
          :key="it.MaterialTypeID"
          :label="it.MaterialTypeID"
          :title="it.MaterialTypeName"
          :disabled="selectedIds.includes(it.MaterialTypeID)"
          >{{it.MaterialTypeName}}</el-radio>
      </el-radio-group>
      <el-empty :description="`暂无半成品`" v-if="(AllMaterialSources.length === 0)" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILineWorkingMaterialSources } from '../../../js/ProductionLineDetailTypes';

const props = defineProps<{
  visible: boolean
  /** 半成品列表数据 */
  AllMaterialSources: ILineWorkingMaterialSources[]
  /** 已选中的半成品id集合 */
  selectedIds: string[]
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

const radio = ref('');

const onOpen = () => {
  radio.value = '';
};

const submit = () => {
  if (!radio.value) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择半成品',
    });
    return;
  }
  const t = props.AllMaterialSources.find(it => it.MaterialTypeID === radio.value);
  if (t) {
    emit('submit', t);
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.semiFinished-select-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  .el-radio {
    margin-right: 10px;
    &.is-disabled {
      :deep(.el-radio__label) {
        color: #aaa;
      }
    }
  }
  :deep(.el-radio__label) {
    width: 10em;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    top: 1px;
    text-align: left;
  }
  :deep(.el-empty) {
    padding: 0;
    padding-bottom: 15px;
    margin-top: -30px;
  }
}
.line-select-dialog {
  text-align: left;
}
</style>
