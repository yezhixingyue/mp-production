<template>
  <DialogContainerComp
    :title="`选择${title}:`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="line-select-content">
      <el-radio-group v-model="radio">
        <el-radio :label="it.ID" v-for="it in _localLineList" :title="it.Name" :key="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
      <el-empty :description="`暂无可用${title}`" v-if="(_localLineList.length === 0)" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { ManualOrderHandlerPageData } from '../../../js';

const props = defineProps<{
  visible: boolean
  isLineInstanceUse?: boolean
  curInstanceLineID?: string
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

const title = computed(() => {
  if (props.isLineInstanceUse) return '生产线';
  return ManualOrderHandlerPageData.value?.CreateOrderInfo._curLineType === LineTypeEnum.combine ? '组合生产线' : '生产线';
});

const _localLineList = computed(() => {
  if (!ManualOrderHandlerPageData.value) return [];
  const { _curLineType } = ManualOrderHandlerPageData.value.CreateOrderInfo;
  const type = props.isLineInstanceUse ? LineTypeEnum.normal : _curLineType;
  const _list = ManualOrderHandlerPageData.value.ProductionLineList.filter(it => it.Type === type);
  return _list;
});

const onOpen = () => {
  if (!ManualOrderHandlerPageData.value) {
    radio.value = '';
    return;
  }
  switch (ManualOrderHandlerPageData.value.CreateOrderInfo._curLineType) {
    case LineTypeEnum.normal:
      radio.value = ManualOrderHandlerPageData.value.CreateOrderInfo._curSinigleLine?.ID || '';
      break;
    case LineTypeEnum.combine:
      radio.value = ManualOrderHandlerPageData.value.CreateOrderInfo._curCombineLine?.ID || '';
      break;
    default:
      radio.value = '';
      break;
  }
  if (props.isLineInstanceUse) {
    radio.value = props.curInstanceLineID || '';
  }
};

const submit = () => {
  if (!radio.value) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择生产线',
    });
    return;
  }
  const t = _localLineList.value.find(it => it.ID === radio.value);
  if (t) {
    emit('submit', t);
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.line-select-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  .el-radio {
    margin-right: 10px;
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
