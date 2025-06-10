<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='1100'
   title='申放条件拷贝'
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   :disabled="localTableList.length===0"
   >
   <section class='dialog-content'>
    <header>选择导入机台</header>
    <aside>
      <div v-for="it in localEquipmentList" :key="it.ID" :class="{active:it.LineEquipmentID===localId}" @click="localId=it.LineEquipmentID || ''">
        <span :title="it.Name">{{ it.Name }}</span>
      </div>
    </aside>
    <main>
      <ListTable :tableList="localTableList" hideCtrl emptyText="选中机台暂无可导入数据，请更换为其它机台" />
    </main>
   </section>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { EquipmentListType } from '../js/types';
import { PutOutConditionItemClass } from '../js/PutOutConditionItemClass';
import ListTable from './ListTable.vue';

const props = defineProps<{
  visible: boolean
  EquipmentData: { curEquipID: null | string; EquipmentList: EquipmentListType[] }
  PropertyList: PropertyListItemType[]
}>();

const emit = defineEmits(['update:visible', 'success']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localEquipmentList = ref<EquipmentListType[]>([]);
const localConditionDataList = ref<PutOutConditionItemClass[]>([]);
const localId = ref('');

const localTableList = computed(() => {
  const tableList = localConditionDataList.value.filter(it => it.LineEquipmentID === localId.value);

  return transformConstraintTableList({
    tableList,
    PropertyList: props.PropertyList,
  });
});

const onOpen = async () => {
  localEquipmentList.value = props.EquipmentData.EquipmentList.filter(it => it.LineEquipmentID !== props.EquipmentData.curEquipID);
  localConditionDataList.value = [];
  localId.value = '';

  if (localEquipmentList.value.length === 0) return;

  localId.value = localEquipmentList.value[0].LineEquipmentID || '';

  const resp = await api.getProductionLinePutOutList(localEquipmentList.value.map(it => it.LineEquipmentID || '').filter(it => it));
  if (resp.data?.isSuccess) {
    localConditionDataList.value = resp.data.Data;
  }
};

const fetch = async (oldLineEquipmentID: string, newLineEquipmentID: string) => {
  const resp = await api.getProductionLinePutOutImport(oldLineEquipmentID, newLineEquipmentID);

  if (resp.data?.isSuccess) {
    MpMessage.dialogSuccess({
      title: '导入成功',
      onOk: () => {
        const newConditionList = localConditionDataList.value.filter(it => it.LineEquipmentID === oldLineEquipmentID);

        emit('success', newConditionList);

        localVisible.value = false;
      },
    });
  }
};

const submit = () => {
  const newLineEquipmentID = props.EquipmentData.curEquipID;
  const oldLineEquipmentID = localId.value;
  const t = localEquipmentList.value.find(it => it.LineEquipmentID === oldLineEquipmentID);
  if (!t || !newLineEquipmentID) return;

  MpMessage.warn('导入将会覆盖当前数据，确定导入吗?', `选中机台: [ ${t.Name} ]`, () => {
    fetch(oldLineEquipmentID, newLineEquipmentID);
  });
};

</script>

<style scoped lang='scss'>

.dialog-content {
 margin-top: -15px;
 height: 360px;
 overflow: hidden;

 display: grid;
 grid-template-columns: 220px 1fr;
 grid-template-rows: 16px 1fr;
 gap: 8px;
 grid-template-areas:
  "header header"
  "aside main";

 > header {
    line-height: 16px;
    border-left: 3px solid #26bcf9;
    padding-left: 16px;
    color: #26bcf9;
    font-size: 14px;
    text-align: left;
    grid-area: header;
 }

 > aside {
  grid-area: aside;
  overflow: auto;

  line-height: 40px;

  > div {
    color: #444;
    padding-left: 21px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    cursor: pointer;
    font-weight: 700;
    box-sizing: border-box;
    border: 1px solid rgba($color: #000000, $alpha: 0);

    &:hover {
      background-color: lighten($color: #26bcf9, $amount: 40);
      color: #26bcf9;
    }
    &.active {
      color: #26bcf9;
      font-weight: 700;
      // background-color: lighten($color: #26bcf9, $amount: 40);
      border-color: lighten($color: #26bcf9, $amount: 10);
    }
  }
 }

 > main {
  grid-area: main;
  overflow: hidden;
  > :deep(ul.list-table) {
    max-height: 100%;
    overflow-y: auto;
    > li {
      &.item.header {
        position: sticky;
        top: 0;
      }
    }
  }
 }
}
</style>
