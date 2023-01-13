<template>
  <section class="equipment-page">
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <EquipmentTable
       :title="curLineWorkName"
       :EquipmentList="EquipmentList"
       @add="onAddClick('default')"
       @onRemoveClick="onRemoveClick"
       @ToPutOutPage="ToPutOutPage"
       @TocCpacityPage="TocCpacityPage"
       :isPlateMaking="isPlateMakingGroup"
       />
      <EquipmentTable
       v-if="PlateMakingEquipmentSetupData"
       :title="PlateMakingEquipmentSetupData.WorkName"
       :EquipmentList="PlateMakingEquipmentList"
       isPlateMaking
       @add="onAddClick('additional')"
       @onRemoveClick="onRemoveClick"
       @ToPutOutPage="ToPutOutPage"
       @TocCpacityPage="TocCpacityPage"
       />
    </main>
    <EquipmentAddDialog v-model:visible="visible" :title="dialogTitle"
     :ClassEquipmentGroups="curClassEquipmentGroups" :cur-edit-item="curEditItem" @submit="submit" />
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { getGoBackFun } from '@/router';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { IClassEquipmentGroups } from '@/store/modules/productionSetting/types';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import EquipmentAddDialog from './Comps/EquipmentAddDialog.vue';
import { EquipmentListType, ILineEquipmentSaveParams } from './js/types';
import EquipmentTable from './Comps/EquipmentTable.vue';
import { EquipmentSetupType, IPlateMakingEquipmentSetupData } from '../productionLine/js/types';
import { WorkSourceTypeEnum } from './js/enum';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[]
  LineWorkID?: string
  ClassEquipmentGroups: IClassEquipmentGroups[]
  curLineWorkName: string
  PlateMakingEquipmentSetupData?: IPlateMakingEquipmentSetupData | null
  Equipments?: { ID: string, LineEquipmentID: string }[]
  /** 是否为制版组使用 */
  isPlateMakingGroup?: boolean
}>();

const emit = defineEmits(['ToPutOut', 'TocCpacity', 'remove', 'save']);

const EquipmentIDS = computed(() => (props.Equipments ? props.Equipments.map(it => it.ID) : []));

const _getEquipmentList = (ClassEquipmentGroups: IClassEquipmentGroups[]) => {
  if (Array.isArray(ClassEquipmentGroups) && ClassEquipmentGroups.length > 0) {
    const list:EquipmentListType[] = [];
    ClassEquipmentGroups?.forEach(lv1 => {
      lv1.EquipmentGroups.forEach(lv2 => {
        lv2.Equipments.forEach(it => {
          if (it.LineEquipmentID || EquipmentIDS.value.includes(it.ID)) {
            let LineEquipmentID = it.LineEquipmentID || '';
            if (props.Equipments) {
              const t = props.Equipments.find(e => e.ID === it.ID);
              LineEquipmentID = t?.LineEquipmentID || '';
            }
            list.push({
              ID: it.ID,
              Name: it.Name,
              LineEquipmentID,
              ClassID: lv1.ClassID,
              ClassName: lv1.ClassName,
              GroupID: lv2.GroupID,
              GroupName: lv2.GroupName,
            });
          }
        });
      });
    });
    return list;
  }
  return [];
};

const EquipmentList = computed(() => _getEquipmentList(props.ClassEquipmentGroups));

const PlateMakingEquipmentList = computed(() => _getEquipmentList(props.PlateMakingEquipmentSetupData?.PlateMakingClassEquipmentGroups || []));

const curSetupType = ref<EquipmentSetupType>('default');
const visible = ref(false);
const curClassEquipmentGroups = computed(() => {
  const list = curSetupType.value === 'default'
    ? props.ClassEquipmentGroups
    : props.PlateMakingEquipmentSetupData?.PlateMakingClassEquipmentGroups || [];

  return list;
});
const curEditItem = computed(() => {
  const _EquipmentList = curSetupType.value === 'default' ? EquipmentList : PlateMakingEquipmentList;
  const WorkSourceType = curSetupType.value === 'default' ? WorkSourceTypeEnum.Normal : WorkSourceTypeEnum.PlateMaking;
  return {
    LineWorkID: props.LineWorkID || '',
    EquipmentIDS: _EquipmentList.value.map(it => it.ID),
    WorkSourceType,
  };
});
const dialogTitle = computed(() => (curSetupType.value === 'default' ? props.curLineWorkName : props.PlateMakingEquipmentSetupData?.WorkName || ''));

const callback = () => { // 保存成功后的回调函数
  visible.value = false;
  // 数据改动
};

const onAddClick = (type: EquipmentSetupType) => {
  curSetupType.value = type;
  visible.value = true;
};

const submit = (data: ILineEquipmentSaveParams) => { // 添加设备 本地保存？
  const temp: ILineEquipmentSaveParams = { ...data };
  if (curSetupType.value === 'additional') {
    temp.WorkSourceType = WorkSourceTypeEnum.PlateMaking;
  }
  if (curSetupType.value === 'additional' && props.PlateMakingEquipmentSetupData) {
    temp.LineWorkID = props.PlateMakingEquipmentSetupData.PlateMakingWorkIdentID;
  }

  emit('save', temp, callback);
};

const ToPutOutPage = (it: EquipmentListType) => { // 伸放
  emit('ToPutOut', it, curSetupType.value);
};

const TocCpacityPage = (it: EquipmentListType) => { // 设备产能
  emit('TocCpacity', it, curSetupType.value);
};

const onRemoveClick = (it: EquipmentListType) => { // 本地保存？
  emit('remove', it, curSetupType.value);
};

</script>

<style lang='scss'>
@import '@/assets/css/var.scss';
.equipment-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0px;
  }
  > main{
    flex: 1;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
    .el-table__header-wrapper {
      display: none;
    }
  }
  > footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
}
</style>
