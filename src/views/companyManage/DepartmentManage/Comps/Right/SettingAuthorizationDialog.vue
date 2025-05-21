<template>
  <DialogContainerComp
  title="设置生产线权限"
  :visible='visible'
  :primaryClick="onPrimaryClick"
  :closeClick="onCloseClick"
  :closed="onClosed"
  primaryText="确定"
  :closeBtnText="'取消'"
  :width="710"
  :open="open"
  class="setting-authorization-dialog"
  >
  <template #default>
    <div class="box">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="line in props.lineList" :key="line.ID" :label="line.ID"
        :disabled="props.ParentLineList.length ? !props.ParentLineList.find(it => it === line.ID) : false">{{line.Name}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </template>
  </DialogContainerComp>
</template>

<script lang='ts' setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ref } from 'vue';

interface IlineList {
  Name: string,
  ID: string
}

const props = defineProps<{
  visible: boolean
  ParentLineList: string[],
  SelectLineList: string[],
  lineList: IlineList[],
}>();

const emit = defineEmits(['update:visible', 'PrimaryClick']);

const checkList = ref<string[]>([]);

const onCloseClick = () => {
  emit('update:visible', false);
};
const onPrimaryClick = () => {
  emit('PrimaryClick', checkList.value);
};
const onClosed = () => {
  checkList.value = [];
};
const open = () => {
  checkList.value = props.SelectLineList;
};
</script>
<style lang='scss'>
.setting-authorization-dialog{
  .el-dialog__body{
    .box{
      overflow-y: auto;
      height: 300px;
      max-height: 300px;
    }
    .el-checkbox-group{
      .el-checkbox{
        width: 160px;
        margin-right: 10px;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
    }
  }
}
</style>
