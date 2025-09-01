<template>
 <DialogContainerComp
   :visible='visible'
   :width='1100'
   title='申放条件拷贝'
   top='12vh'
   @open='onOpen'
   @cancel='visible = false'
   @submit='submit'
   :disabled="localTableList.length===0"
   >
   <section class='dialog-content'>
    <header>选择导入机台</header>
    <aside>
      <div v-for="it in localEquipmentList" :key="it.ID" :class="{active:it.LineEquipmentID===activeId}" @click="activeId=it.LineEquipmentID || ''">
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
import { TransformConstraintTableItemType, transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { EquipmentListType } from '../js/types';
import { PutOutConditionItemType } from '../js/PutOutConditionItemClass';
import ListTable from './ListTable.vue';

const props = defineProps<{
  EquipmentData: { curEquipID: null | string; EquipmentList: EquipmentListType[] }
  PropertyList: PropertyListItemType[]
  FormulaUseModule: UseModuleEnum
  WorkingID: string
}>();

const emit = defineEmits(['success']);

const visible = defineModel<boolean>('visible');

const localEquipmentList = ref<EquipmentListType[]>([]);
const localConditionDataList = ref<TransformConstraintTableItemType<PutOutConditionItemType>[]>([]);
const localId = ref('');

const _fetchedPositionIDs = new Set<string>();
const fetchDataList = async (val: string) => {
  if (!val || _fetchedPositionIDs.has(val)) return;

  const resp = await api.formulaApis.getFormulaList({
    UseModule: props.FormulaUseModule,
    WorkingID: props.WorkingID,
    PositionID: val,
  });

  if (resp.data?.isSuccess) {
    localConditionDataList.value.push(...transformConstraintTableList<PutOutConditionItemType>({
      tableList: resp.data.Data,
      PropertyList: props.PropertyList,
    }));

    _fetchedPositionIDs.add(val);
  }
};

const activeId = computed({
  get() {
    return localId.value;
  },
  set(val) {
    if (localId.value === val) return;
    localId.value = val;

    fetchDataList(val);
  },
});

const localTableList = computed(() => localConditionDataList.value.filter(it => it.PositionID === activeId.value));

const onOpen = async () => {
  _fetchedPositionIDs.clear();
  localEquipmentList.value = props.EquipmentData.EquipmentList.filter(it => it.LineEquipmentID !== props.EquipmentData.curEquipID);
  localConditionDataList.value = [];
  activeId.value = '';

  if (localEquipmentList.value.length === 0) return;

  activeId.value = localEquipmentList.value[0].LineEquipmentID || '';
};

const fetch = async (oldLineEquipmentID: string, newLineEquipmentID: string) => {
  const resp = await api.formulaApis.getFormulaCopy({
    SourcePositionID: oldLineEquipmentID,
    DestPositionID: newLineEquipmentID,
    UseModule: props.FormulaUseModule,
  });

  if (resp.data?.isSuccess) {
    MpMessage.dialogSuccess({
      title: '导入成功',
      onOk: () => {
        // const newConditionList = localConditionDataList.value.filter(it => it.PositionID === oldLineEquipmentID);

        emit('success', resp.data?.Data);

        visible.value = false;
      },
    });
  }
};

const submit = () => {
  const newLineEquipmentID = props.EquipmentData.curEquipID;
  const oldLineEquipmentID = activeId.value;
  const t = localEquipmentList.value.find(it => it.LineEquipmentID === oldLineEquipmentID);
  if (!t || !newLineEquipmentID) return;

  MpMessage.warn('保存后将覆盖当前机台申放数据', '请确定是否覆盖', () => {
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
      font-size: 12px;
      &.item.header {
        position: sticky;
        top: 0;
        font-size: 14px;
      }
    }
  }
 }
}
</style>
