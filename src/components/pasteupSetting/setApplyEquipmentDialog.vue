<template>
  <div>
    <DialogContainerComp
    title="适用设备"
    :visible='Dialog'
    :width="660"
    :primaryClick="setApplyEquipmentPrimaryClick"
    :closeClick="setApplyEquipmentCloseClick"
    :closed="setApplyEquipmentClosed"
    :appendToBody="true"
    >
    <template #default>
      <div class="set-apply-equipment-dialog">
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
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  reactive, computed, watch,
} from 'vue';
import { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';

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
export default {
  components: {
    DialogContainerComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    changeVisible: {
      type: Function,
      default: () => null,
    },
    saveEquipment: {
      type: Function,
      default: () => null,
    },
    // 已经设置的适用设备列表（一级）
    haveSetApplyEquipmentList: {
      type: Array,
      defalut: [],
    },
    // 适用设备列表（二级）
    applyEquipmentList: {
      type: Array,
      defalut: () => [],
    },
  },
  setup(props) {
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
    function setApplyEquipmentCloseClick() {
      props.changeVisible(false);
    }
    function setApplyEquipmentClosed() {
      // 清空表单
      Data.applyEquipmentListFrom.map(res => {
        const temp = res;
        temp.checkAll = false;
        temp.isIndeterminate = false;
        temp.checks = [];
        return temp;
      });
    }
    function setApplyEquipmentPrimaryClick() {
      // 所有设备
      const allEquipment:EquipmentGroups[] = [];
      Data.applyEquipmentListFrom.forEach(item => {
        allEquipment.push(...item.EquipmentGroups);
      });
      console.log(allEquipment, 'all');
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
      console.log(actionEquipment, 'actionEquipment');
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
    watch(() => props.applyEquipmentList, (newVal) => {
      if (newVal) {
        newVal.forEach((element) => {
          const temp = element as UseClassEquipmentGroupType;
          temp.EquipmentGroups = [
            {
              ID: 'eb2be879-0525-45fb-97f0-af1600f78f11',
              Name: '1',
            },
            {
              ID: 'eb2be879-0525-45fb-97f0-af1600f78f21',
              Name: '2',
            },
            {
              ID: 'eb2be879-0525-45fb-97f0-af1600f78f31',
              Name: '13',
            },
          ];
          Data.applyEquipmentListFrom.push({
            ...temp as UseClassEquipmentGroupType,
            checkAll: false,
            isIndeterminate: false,
            checks: [],
          });
        });
      }
    });
    watch(() => Dialog.value, (newVal) => {
      if (newVal && props.haveSetApplyEquipmentList) {
        const haveSetApplyEquipmentList = props.haveSetApplyEquipmentList as EquipmentGroups[];
        console.log(props.haveSetApplyEquipmentList, 'Dialog');
        Data.applyEquipmentListFrom.forEach((element, index) => {
          element.EquipmentGroups.forEach(item => {
            const temp = haveSetApplyEquipmentList.find(res => res.ID === item.ID);
            if (temp) {
              Data.applyEquipmentListFrom[index].checks.push(temp.ID);
              handleCheckedCitiesChange(Data.applyEquipmentListFrom[index].checks, index);
            }
          });
        });
      }
    });
    return {
      Data,
      Dialog,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      setApplyEquipmentCloseClick,
      setApplyEquipmentClosed,
      setApplyEquipmentPrimaryClick,
    };
  },
};
</script>
<style lang="scss">
  .set-apply-equipment-dialog{
    //
  }
</style>
