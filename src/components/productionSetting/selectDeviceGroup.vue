<template>
  <div>
    <DialogContainerComp
    title="选择设备"
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
        <div class="material-type" v-for="(item, index) in Data.applyEquipmentListFrom" :key="index">
          <p>
            <el-checkbox
              v-model="item.checkAll"
              :indeterminate="item.isIndeterminate"
              @change="handleCheckAllChange(item.checkAll, index)"
            >{{item.ClassName}}</el-checkbox>
          </p>
          <el-checkbox-group
            v-model="item.checks"
            @change="handleCheckedCitiesChange(item.checks, index)"
          >
            <el-checkbox
            v-for="EquipmentItem in item.EquipmentGroups"
            :key="EquipmentItem.ID" :label="EquipmentItem.ID">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="EquipmentItem.Name"
                placement="top"
                :disabled="EquipmentItem.Name.length<7"
              >
              {{EquipmentItem.Name}}
              </el-tooltip>
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
import type { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';

interface applyEquipmentListFrom extends UseClassEquipmentGroupType{
  checkAll:boolean
  isIndeterminate:boolean
  checks:string[]
}
interface EquipmentGroupCheckDataList{
  checkAll:boolean
  isIndeterminate:boolean
}
interface DataType {
  applyEquipmentListFrom:applyEquipmentListFrom[]
  EquipmentGroupCheckDataList:EquipmentGroupCheckDataList[]
}
interface Props {
  visible: boolean
  changeVisible?: (bol:boolean) => void
  saveEquipment?: (list:EquipmentGroups[]) => void
  activeEquipmentList?: string[]
  EquipmentListGroup?: UseClassEquipmentGroupType[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  changeVisible: () => null,
  saveEquipment: () => null,
  activeEquipmentList: () => [],
  EquipmentListGroup: () => [],
});

const Data:DataType = reactive({
  applyEquipmentListFrom: [],
  EquipmentGroupCheckDataList: [],
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
  Data.applyEquipmentListFrom.map(res => {
    const temp = res;
    temp.checkAll = false;
    temp.isIndeterminate = false;
    temp.checks = [];
    return temp;
  });
}
function PrimaryClick() {
  // 所有设备
  const allEquipment:EquipmentGroups[] = [];
  Data.applyEquipmentListFrom.forEach(item => {
    allEquipment.push(...item.EquipmentGroups);
  });
  // 选中的设备
  const actionEquipment:EquipmentGroups[] = [];
  Data.applyEquipmentListFrom.forEach(item => {
    item.checks.forEach(it => {
      const temp = allEquipment.find(Equipment => Equipment.ID === it);
      if (temp) {
        actionEquipment.push(temp);
      }
    });
  });
  props.saveEquipment(actionEquipment);
}
function handleCheckAllChange(val: boolean, index) {
  if (val) {
    const a = Data.applyEquipmentListFrom[index].EquipmentGroups.map(it => it.ID as string);
    Data.applyEquipmentListFrom[index].checks = a;
  } else {
    Data.applyEquipmentListFrom[index].checks = [];
  }
  Data.applyEquipmentListFrom[index].isIndeterminate = false;
}
function handleCheckedCitiesChange(value:string[], index) {
  const checkedCount = value.length;
  Data.applyEquipmentListFrom[index].checkAll = checkedCount === Data.applyEquipmentListFrom[index].EquipmentGroups.length;
  Data.applyEquipmentListFrom[index].isIndeterminate = checkedCount > 0
       && checkedCount < Data.applyEquipmentListFrom[index].EquipmentGroups.length;
}

watch(() => Dialog.value, (newVal) => {
  // 格式化显示数据
  Data.applyEquipmentListFrom = [];
  props.EquipmentListGroup.forEach((element) => {
    Data.applyEquipmentListFrom.push({
      ...element as UseClassEquipmentGroupType,
      checkAll: false,
      isIndeterminate: false,
      checks: [],
    });
  });
  if (newVal && props.activeEquipmentList) {
    const activeEquipmentList = props.activeEquipmentList as string[];
    Data.applyEquipmentListFrom.forEach((element, index) => {
      element.EquipmentGroups.forEach(item => {
        const temp = activeEquipmentList.find(res => res === item.ID);
        if (temp) {
          Data.applyEquipmentListFrom[index].checks.push(temp);
          handleCheckedCitiesChange(Data.applyEquipmentListFrom[index].checks, index);
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
