<template>
  <DialogContainerComp
    :title="`设置辅助信息`"
    :visible='localVisible'
    :width="620"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="assist-info-setup-content">
      <div v-for="it in list" :key="it.ID" class="item">
        <span class="title" :title="it.Name">{{ it.Name }}</span>
        <i class="s">:</i>
        <el-input v-model.trim="it.Content" maxlength="40"></el-input>
      </div>
      <el-empty :description="`暂无可设置内容`" v-if="(list.length === 0)" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';

const props = defineProps<{
  visible: boolean
  modelValue: IConvertAssistInfo[]
}>();

const emit = defineEmits(['update:visible', 'update:modelValue']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const list = ref<IConvertAssistInfo[]>([]);

const onOpen = () => {
  list.value = props.modelValue.filter(it => it.Type === AssistInfoTypeEnum.text).map(it => ({ ...it }));
};

const submit = () => {
  const _list = props.modelValue.filter(it => it.Type !== AssistInfoTypeEnum.text);
  emit('update:modelValue', [...list.value, ..._list]);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.assist-info-setup-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 0px;
  text-align: left;
  @include scroll;

  .item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    .title {
      flex: none;
      font-weight: 700;
      color: #444;
      min-width: 10em;
      text-align: right;
      max-width: 10em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .s {
      margin-right: 10px;
      font-weight: 700;
    }

    :deep(.el-input) {
      width: 360px;
      height: 40px;
      .el-input__wrapper {
        border-radius: 4px;
        font-size: 13px;
      }
    }
  }

  :deep(.el-empty) {
    padding: 0;
    padding-bottom: 15px;
    margin-top: -30px;
  }
}
</style>
