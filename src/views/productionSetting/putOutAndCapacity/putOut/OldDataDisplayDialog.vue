<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='1100'
   :showPrimary="false"
   title='旧版本申放数据'
   closeBtnText="关闭"
   top='9vh'
   @open='onOpen'
   @cancel='localVisible = false'
   >
   <section class='dialog-content'>
    <ListTable :tableList="localTableList" hideCtrl showOld emptyText="暂无数据" />
   </section>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { EquipmentListType } from '../js/types';
import { PutOutConditionItemType } from '../js/PutOutConditionItemClass';
import ListTable from './ListTable.vue';

const props = defineProps<{
  visible: boolean
  EquipmentData: { curEquipID: null | string; EquipmentList: EquipmentListType[] }
  PropertyList: PropertyListItemType[]
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localDataList = ref<PutOutConditionItemType[]>([]);

const localTableList = computed(() => {
  const tableList = localDataList.value;

  return transformConstraintTableList({
    tableList,
    PropertyList: props.PropertyList,
  });
});

const onOpen = async () => {
  localDataList.value = [];

  if (!props.EquipmentData.curEquipID) return;

  const resp = await api.getProductionLinePutOutList([props.EquipmentData.curEquipID]);
  if (resp.data?.isSuccess) {
    localDataList.value = resp.data.Data;
  }
};

</script>

<style scoped lang='scss'>

.dialog-content {
 margin-top: -15px;
 height: 520px;
 overflow: hidden;
> :deep(ul.list-table) {
  max-height: 100%;
  overflow-y: auto;

  > li {
    &.item.header {
      position: sticky;
      top: 0;
      font-size: 14px;
    }

    font-size: 12px;
  }
}
}
</style>
