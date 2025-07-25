<template>
 <DialogContainerComp
   :visible='visible'
   :width='638'
   title='添加半成品'
   primaryText="确定"
   top='12vh'
   @open='onOpen'
   @cancel='visible = false'
   @submit='submit'
   >
   <div class='dialog-content'>
    <el-checkbox-group v-model="checkList">
      <el-checkbox
        v-for="it in list" :key="it.MaterialTypeID"
        :label="it.MaterialTypeID"
        :title="it.MaterialTypeName"
        :disabled="checkedIds.includes(it.MaterialTypeID)"
        >{{ it.MaterialTypeName }}</el-checkbox>
    </el-checkbox-group>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ILineWorkingMaterialSources } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';

const props = defineProps<{
  list: ILineWorkingMaterialSources[]
  checkedIds: string[]
}>();

const emit = defineEmits(['submit']);

const visible = defineModel<boolean>('visible');

const checkList = ref<string[]>([]);

const onOpen = () => {
  checkList.value = [...props.checkedIds];
};

const submit = () => {
  const newIds = checkList.value.filter(id => !props.checkedIds.includes(id));
  if (newIds.length === 0) {
    ElMessage.warning({ message: '选项未发生变化' });
    return;
  }

  emit('submit', newIds);

  visible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -15px;
 min-height: 160px;
 max-height: 360px;
 overflow: auto;
 overflow: overlay;
 margin-right: -10px;

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
  text-align: left;
}
}
</style>
