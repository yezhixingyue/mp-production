<template>
  <div>
    <DialogContainerComp
    title="需要辅助信息"
    :visible='Dialog'
    :width="660"
    :primaryClick="PrimaryClick"
    :closeClick="CloseClick"
    :closed="Closed"
    :appendToBody="true"
    >
    <template #default>
      <div class="set-apply-equipment-dialog">
        <el-scrollbar max-height="350px">
        <div class="material-type" v-for="(item, index) in Data.ListFrom" :key="index">
          <p>
            <el-checkbox
              v-model="item.checkAll"
              :indeterminate="item.isIndeterminate"
              @change="handleCheckAllChange(item.checkAll, index)"
            >{{getEnumNameByIDAndEnums(item.Type, AssistInfoTypeEnums)}}</el-checkbox>
          </p>
          <el-checkbox-group
            v-model="item.checks"
            @change="handleCheckedCitiesChange(item.checks, index)"
          >
            <el-checkbox
            v-for="NotesItem in item.Notes"
            :key="NotesItem.ID" :label="NotesItem.ID" :title="NotesItem.Name">
              {{NotesItem.Name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        </el-scrollbar>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script setup lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  reactive, computed, watch,
} from 'vue';
import type { NotesType, SelectAssistInfoGroup } from '@/store/modules/productionSetting/types';
import { getEnumNameByIDAndEnums } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';

interface ListFrom extends SelectAssistInfoGroup{
  checkAll:boolean
  isIndeterminate:boolean
  checks:string[]
}

interface DataType {
  ListFrom:ListFrom[]
}
interface Props {
  visible: boolean
  changeVisible?: (bol:boolean) => void
  saveInfo?: (list:NotesType[]) => void
  activeInfoList?: string[]
  ListGroup?: SelectAssistInfoGroup[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  changeVisible: () => null,
  saveInfo: () => null,
  activeInfoList: () => [],
  ListGroup: () => [],
});

const Data:DataType = reactive({
  ListFrom: [],
});
const Dialog = computed({
  get() {
    return props.visible;
  },
  set(newVal) {
    props.changeVisible(newVal);
  },
});
function CloseClick() {
  props.changeVisible(false);
}
function Closed() {
  // 清空表单
  Data.ListFrom.map(res => {
    const temp = res;
    temp.checkAll = false;
    temp.isIndeterminate = false;
    temp.checks = [];
    return temp;
  });
}
function PrimaryClick() {
  // 所有信息
  const allinfo:NotesType[] = [];
  Data.ListFrom.forEach(item => {
    allinfo.push(...item.Notes);
  });
  // 选中的信息
  const actioninfo:NotesType[] = [];
  Data.ListFrom.forEach(item => {
    item.checks.forEach(it => {
      const temp = allinfo.find(Equipment => Equipment.ID === it);
      if (temp) {
        actioninfo.push(temp);
      }
    });
  });
  props.saveInfo(actioninfo);
}
function handleCheckAllChange(val: boolean, index) {
  if (val) {
    const a = Data.ListFrom[index].Notes.map(it => it.ID as string);
    Data.ListFrom[index].checks = a;
  } else {
    Data.ListFrom[index].checks = [];
  }
  Data.ListFrom[index].isIndeterminate = false;
}
function handleCheckedCitiesChange(value:string[], index) {
  const checkedCount = value.length;
  Data.ListFrom[index].checkAll = checkedCount === Data.ListFrom[index].Notes.length;
  Data.ListFrom[index].isIndeterminate = checkedCount > 0
       && checkedCount < Data.ListFrom[index].Notes.length;
}
watch(() => Dialog.value, (newVal) => {
  Data.ListFrom = [];
  props.ListGroup.forEach((element) => {
    Data.ListFrom.push({
      ...element as SelectAssistInfoGroup,
      checkAll: false,
      isIndeterminate: false,
      checks: [],
    });
  });
  if (newVal && props.activeInfoList) {
    const activeInfoList = props.activeInfoList as string[];
    Data.ListFrom.forEach((element, index) => {
      element.Notes.forEach(item => {
        const temp = activeInfoList.find(res => res === item.ID);
        if (temp) {
          Data.ListFrom[index].checks.push(temp);
          handleCheckedCitiesChange(Data.ListFrom[index].checks, index);
        }
      });
    });
  }
});
</script>
<style lang="scss" scoped>
  .set-apply-equipment-dialog{
    padding-left: 18px;
    padding-right: 0;
    .material-type{
      &.material-type+.material-type{
        margin-top: 20px;
      }
      p{
        :deep(.el-checkbox__label) {
          font-weight: 600;
          font-size: 13px;
        }
      }
    }
    .el-checkbox-group{
      .el-checkbox{
        margin-right: 8px;
        :deep(.el-checkbox__label) {
          display: inline-block;
          width: 10em;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
