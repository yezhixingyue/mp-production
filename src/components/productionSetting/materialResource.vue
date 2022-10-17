<template>
  <div>
    <DialogContainerComp
    title="可选物料资源包"
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
        <div class="material-type">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
            v-for="(item) in props.MaterialListGroup"
            :key="item.ID" :label="item.ID">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="item.Name"
                placement="top"
                :disabled="item.Name.length<9"
              >
              {{item.Name}}
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
  ref, computed, watch,
} from 'vue';
import type { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import type {
  NotesType, SelectAssistInfoGroup, MaterialTypeGroupsType,
  MaterialTypeGroupType,
} from '@/store/modules/productionSetting/types';

interface Props {
  visible: boolean
  changeVisible?: (bol:boolean) => void
  saveEquipment?: (list:EquipmentGroups[]) => void
  activeMaterialList?: string[]
  MaterialListGroup?: MaterialTypeGroupType[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  changeVisible: () => null,
  saveEquipment: () => null,
  activeMaterialList: () => [],
  MaterialListGroup: () => [],
});
const checkList = ref([]);
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
  checkList.value = [];
}
function PrimaryClick() {
  const returnData = props.MaterialListGroup.filter(res => checkList.value.find(it => it === res.ID));
  props.MaterialListGroup.map(res => checkList.value.find(it => it === res.ID));
  console.log(returnData, 'checkList');

  props.saveEquipment(returnData || []);
}
watch(() => props.MaterialListGroup, (newVal) => {
  if (newVal) {
    newVal.forEach((element) => {
      console.log(element);
    });
  }
});
watch(() => Dialog.value, (newVal) => {
  if (newVal && props.activeMaterialList) {
    const activeMaterialList = props.activeMaterialList as string[];
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
