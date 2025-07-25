<template>
  <DialogContainerComp
    title="选择审稿输出文件"
    :visible='visible'
    :width="635"
    top="20vh"
    @open="onOpen"
    @submit="submit"
    @cancel="visible = false"
    primary-text="确定"
    >
    <div class="select-main">
      <el-radio-group v-model="radio" v-if="type !== 'assist'">
        <el-radio label="">无</el-radio>
        <el-radio v-for="it in list" :key="it.FilePath" :label="it.FilePath" :disabled="disabledIds.includes(it.FilePath)"
        >{{ [it.PartName, it.FileName].filter(it => it).join('-') }}</el-radio>
      </el-radio-group>

      <el-checkbox-group v-model="checkList" v-else>
        <el-checkbox v-for="it in list" :key="it.FilePath" :label="it.FilePath" :disabled="disabledIds.includes(it.FilePath)"
        >{{ [it.PartName, it.FileName].filter(it => it).join('-') }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IPDOrderItem } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { ref } from 'vue';
import { FileMatchType } from './hooks/useFileMatch';

const props = defineProps<{
  list: IPDOrderItem['FileList']
  type: FileMatchType
  disabledIds: string[]
}>();

const visible = defineModel<boolean>('visible');
const mapIds = defineModel<string[]>('mapIds');

const radio = ref('');
const checkList = ref<string[]>([]);

const onOpen = () => {
  if (props.type === 'assist') {
    checkList.value = [...(mapIds.value || [])];
  } else {
    radio.value = mapIds.value?.[0] || '';
  }
};

const submit = () => {
  mapIds.value = props.type === 'assist' ? checkList.value : [radio.value];

  visible.value = false; // Close the dialog on submit
};
</script>

<style scoped lang='scss'>
.select-main {
  margin-top: -20px;
  margin-right: -15px;
  min-height: 200px;

  .el-checkbox {
    margin-right: 15px;
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
</style>
