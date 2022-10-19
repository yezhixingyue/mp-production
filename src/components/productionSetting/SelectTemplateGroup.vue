<template>
  <div>
    <DialogContainerComp
    title="选择大版文件"
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
        <div class="material-type" v-for="(item, index) in Data.TemplateGroupFrom" :key="index">
          <p>
            <el-checkbox
              v-model="item.checkAll"
              :indeterminate="item.isIndeterminate"
              @change="handleCheckAllChange(item.checkAll, index)"
            >{{item.Name}}</el-checkbox>
          </p>
          <el-checkbox-group
            v-model="item.checks"
            @change="handleCheckedCitiesChange(item.checks, index)"
          >
            <el-checkbox
            v-for="EquipmentItem in item.children"
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
import type {
  NotesType, SelectAssistInfoGroup, MaterialTypeGroupsType, ImpositionTemmplateListGroupType,
  MaterialTypeGroupType, ProcessListType, ImpositionTemmplateListType,
} from '@/store/modules/productionSetting/types';
import { useProductionSettingStore } from '@/store/modules/productionSetting';

const productionSettingStore = useProductionSettingStore();

interface TemplateGroupFrom extends ImpositionTemmplateListGroupType{
  checkAll:boolean
  isIndeterminate:boolean
  checks:string[]
}
interface EquipmentGroupCheckDataList{
  checkAll:boolean
  isIndeterminate:boolean
}
interface DataType {
  TemplateGroupFrom:TemplateGroupFrom[]
  EquipmentGroupCheckDataList:EquipmentGroupCheckDataList[]
}
interface Props {
  visible: boolean
  changeVisible?: (bol:boolean) => void
  saveTemplate?: (list:ImpositionTemmplateListType[]) => void
  activeTemplateList?: string[]
  TemplateGroup?: ImpositionTemmplateListGroupType[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  changeVisible: () => null,
  saveTemplate: () => null,
  activeTemplateList: () => [],
  TemplateGroup: () => [],
});

const Data:DataType = reactive({
  TemplateGroupFrom: [],
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
  Data.TemplateGroupFrom.map(res => {
    const temp = res;
    temp.checkAll = false;
    temp.isIndeterminate = false;
    temp.checks = [];
    return temp;
  });
}
function PrimaryClick() {
  // 所有设备
  const allTemplate:ImpositionTemmplateListType[] = [];
  Data.TemplateGroupFrom.forEach(item => {
    allTemplate.push(...item.children);
  });
  // 选中的设备
  const actionTemplate:ImpositionTemmplateListType[] = [];
  Data.TemplateGroupFrom.forEach(item => {
    item.checks.forEach(it => {
      const temp = allTemplate.find(Template => Template.ID === it);
      if (temp) {
        actionTemplate.push(temp);
      }
    });
  });
  props.saveTemplate(actionTemplate);
}
function handleCheckAllChange(val: boolean, index) {
  if (val) {
    const a = Data.TemplateGroupFrom[index].children.map(it => it.ID as string);
    Data.TemplateGroupFrom[index].checks = a;
  } else {
    Data.TemplateGroupFrom[index].checks = [];
  }
  Data.TemplateGroupFrom[index].isIndeterminate = false;
}
function handleCheckedCitiesChange(value:string[], index) {
  const checkedCount = value.length;
  Data.TemplateGroupFrom[index].checkAll = checkedCount === Data.TemplateGroupFrom[index].children.length;
  Data.TemplateGroupFrom[index].isIndeterminate = checkedCount > 0
       && checkedCount < Data.TemplateGroupFrom[index].children.length;
}

watch(() => Dialog.value, (newVal) => {
  // 格式化显示数据
  Data.TemplateGroupFrom = [];
  props.TemplateGroup.forEach((element) => {
    Data.TemplateGroupFrom.push({
      ...element as ImpositionTemmplateListGroupType,
      checkAll: false,
      isIndeterminate: false,
      checks: [],
    });
  });
  console.log(props.TemplateGroup, 'props.TemplateGroup');
  console.log(Data.TemplateGroupFrom, 'Data.TemplateGroupFrom');

  if (newVal && props.activeTemplateList) {
    const activeTemplateList = props.activeTemplateList as string[];
    Data.TemplateGroupFrom.forEach((element, index) => {
      element.children.forEach(item => {
        const temp = activeTemplateList.find(res => res === item.ID);
        if (temp) {
          Data.TemplateGroupFrom[index].checks.push(temp);
          handleCheckedCitiesChange(Data.TemplateGroupFrom[index].checks, index);
        }
      });
    });
  }
});
</script>
<style lang="scss">
  .set-apply-equipment-dialog{
    padding: 0 22px;
    .material-type{
      &.material-type+.material-type{
        margin-top: 20px;
      }
      p{
        font-weight: 600;
        .el-checkbox__label{
          font-weight: 600;
        }
      }
    }
    .el-checkbox-group{
      .el-checkbox{
        width: calc(25% - 10px);
        margin-right: 10px;
      }
    }
  }
</style>
