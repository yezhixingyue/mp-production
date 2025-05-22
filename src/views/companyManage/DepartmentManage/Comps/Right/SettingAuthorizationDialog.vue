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
      <el-checkbox :disabled="checkedALLDisabled" v-model="checkedALL" @change="checkedALLChange">所有生产线（包含新增生产线）</el-checkbox>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="line in props.lineList" :key="line.ID" :label="line.ID"
        :disabled="checkedALL || getCheckbox(line)">
          {{line.Name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </template>
  </DialogContainerComp>
</template>

<script lang='ts' setup>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ref, computed } from 'vue';

interface IlineList {
  Name: string,
  ID: string
}
interface IProps {
  visible: boolean,
  ParentLineList: (string|number)[],
  SelectLineList: string[],
  lineList: IlineList[],
  childLineIDs: string[],
  departmentParentID: number
}
const props = defineProps<IProps>();

const emit = defineEmits(['update:visible', 'PrimaryClick']);
const checkAllValue = '00000000-0000-0000-0000-000000000000';

const checkList = ref<(string|number)[]>([]);
const checkedALL = ref(false);
const checkedALLDisabled = computed(() => {
  if (props.childLineIDs.find(it => it === checkAllValue)) return true;
  const _ParentLineList = props.ParentLineList.filter(it => it !== checkAllValue);
  if (props.ParentLineList.length !== _ParentLineList.length) { // 说明父级部门全选了
    return false;
  }
  if (props.departmentParentID === -1) {
    return false;
  }
  return true;
});

const onCloseClick = () => {
  emit('update:visible', false);
};
const onPrimaryClick = () => {
  if (checkedALL.value) {
    checkList.value.unshift(checkAllValue);
  }
  emit('PrimaryClick', checkList.value);
};
const getCheckbox = (line) => {
  // !!props.childLineIDs.find(it => it === line.ID)
  //       || (props.ParentLineList.length ? !props.ParentLineList.find(it => it === line.ID) : false)
  if (props.departmentParentID === -1) {
    return props.childLineIDs.find(it => it === line.ID);
  }
  return !!props.childLineIDs.find(it => it === line.ID)
        || (!props.ParentLineList.find(it => it === checkAllValue)
          ? !props.ParentLineList.find(it => it === line.ID) : false);
};
const onClosed = () => {
  checkList.value = [];
  checkedALL.value = false;
};
const checkedALLChange = (e) => {
  if (e) {
    checkList.value = props.lineList.map(it => it.ID);
  } else {
    onClosed();
    checkList.value = [...props.childLineIDs];
  }
};
const open = () => {
  const _SelectLineList = props.SelectLineList.filter(it => {
    const isNoDel = props.lineList.find(line => line.ID === it); // 生产线没有被删除
    // const isNoDisabled = props.ParentLineList.length === 0 || props.ParentLineList.find(line => it === line);
    return isNoDel;
  });
  checkList.value = _SelectLineList;
  if ((props.departmentParentID === -1 || props.ParentLineList.find(it => it === checkAllValue))
  && props.SelectLineList.find(it => it === checkAllValue)) {
    checkedALL.value = true;
    checkedALLChange(true);
  }
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
