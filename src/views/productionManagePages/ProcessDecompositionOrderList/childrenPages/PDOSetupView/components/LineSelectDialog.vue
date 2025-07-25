<template>
  <DialogContainerComp
    :title="`选择${title}:`"
    :visible='visible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="visible = false"
    primary-text="确定"
    >
    <div class="line-select-content">
      <!-- 普通生产线选择 -->
      <ul v-if="lineType === LineTypeEnum.normal && _lineData && _lineData.NormalLineList.length > 0" style="margin-top: -24px;">
        <li v-for="it in _lineData.NormalLineList" :key="it.ID">
          <p class="line-name">{{ it.Name }}</p>
          <el-radio v-for="c in it.children" :key="c.ID" :label="c.ID" v-model="_radio" :title="c.Name">{{ c.Name }}</el-radio>
        </li>
      </ul>
      <!-- 组合生产线选择 -->
      <div v-else-if="lineType === LineTypeEnum.combine && _lineData && _lineData.CombineLineList.length > 0">
        <el-radio v-for="c in _lineData.CombineLineList" :key="c.ID" :label="c.ID" v-model="_radio" :title="c.Name">{{ c.Name }}</el-radio>
      </div>

      <!-- 为空 -->
      <el-empty :description="`暂无可用${title}`" v-else />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { PDOSetupViewStore } from '../store/PDOSetupViewStore';

const props = defineProps<{
  lineType: LineTypeEnum
  lineID: string
}>();

const emit = defineEmits(['change']);

const visible = defineModel<boolean>('visible');

const title = computed(() => (props.lineType === LineTypeEnum.combine ? '组合生产线' : '生产线'));

const _radio = ref('');
const _lineData = computed(() => PDOSetupViewStore.value?.lineListData || null);

const onOpen = async () => {
  _radio.value = props.lineID;
};

const submit = () => {
  if (!_radio.value || !_lineData.value || !_lineData.value.originData.find(it => it.ID === _radio.value)) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择生产线',
    });
    return;
  }

  const t = _lineData.value.originData.find(it => it.ID === _radio.value);
  if (t) {
    emit('change', t);
    visible.value = false;
  } else {
    MpMessage.error({
      title: '操作失败',
      msg: '未找到对应的生产线',
    });
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
  margin-top: -10px;
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

  .line-name {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 2px;
    margin-top: 22px;
    color: #26bcf9;
  }
}
.line-select-dialog {
  text-align: left;
}
</style>
