<template>
  <DialogContainerComp
    :title="`添加专色`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="special-color-select-content">
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="it.ID" :disabled="checkedIds.includes(it.ID)"
         v-for="it in SpecialColorList" :title="it.Name" :key="it.ID">{{it.Name}}</el-checkbox>
      </el-checkbox-group>
      <el-empty :description="`暂无专色`" v-if="(SpecialColorList.length === 0)" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IConvertOrderFile, IPrintColor } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';

const props = defineProps<{
  visible: boolean
  FileList: IConvertOrderFile[]
  SpecialColorList: IPrintColor[]
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

const checkedIds = ref<string[]>([]);
const checkList = ref<string[]>([]);

const onOpen = () => {
  checkedIds.value = [...props.FileList.map(it => it.SpecialColorList?.[0] || '')].filter(id => id);
  checkList.value = [...checkedIds.value];
};

const submit = () => {
  if (checkList.value.length === 0) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择专色',
    });
    return;
  }
  const list = checkList.value.map(id => props.SpecialColorList.find(it => it.ID === id)).filter(it => it) as IPrintColor[];

  emit('submit', list);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.special-color-select-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  .el-checkbox {
    margin-right: 10px;
  }
  :deep(.el-checkbox__label) {
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
</style>
