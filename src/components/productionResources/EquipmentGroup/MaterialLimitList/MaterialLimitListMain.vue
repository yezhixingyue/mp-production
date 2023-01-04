<template>
  <main>
    <ConstraintsTable
      v-for="it in mainList"
      :key="it.ID"
      :title="it.title"
      :operate-title="'+添加禁用条件'"
      :remove-title="'删除此类型'"
      :table-list="it.LimitConstraints"
      :PropertyList="getPropertyList(it)"
      :header-intro-text="'符合如下任意一条时禁止加工，如列表为空，则此类物料均可加工'"
      v-model:activeId="activeId"
      @removeTable="onTableRemoveClick(it)"
      @saveCondition="(e) => onSaveClick(it, e)"
      @removeCondition="(e) => onRemoveClick(it, e)"
    >
      <template #interlining>
        <!-- 夹层 用于存放尺寸限制 -->
        <div class="interlining">
          <mp-button type="primary" link @click="onSizeLimitClick(it)">尺寸限制</mp-button>
          <span>{{ formatSizeLimit(it) || '不限制' }}</span>
        </div>
      </template>
    </ConstraintsTable>
    <EquipmentGroupSizeLimitDialog v-model:visible="sizeLimitVisible" :originData="curItem" @submit="handleSizeLimitSubmit"  />
    <mp-empty v-if="mainList.length === 0 && !props.loading" description="暂未设置物料类型限制" />
  </main>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ConstraintsTable from '@/components/common/ConstraintsComps/ConstraintsTable/ConstraintsTable.vue';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import {
  IMaterialTypeLimitTableItemType, MaterialTypeLimitItemType,
} from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { getMaterialConstraintsListWithNames } from '@/store/modules/resource/utils/utils';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { computed, ref } from 'vue';
import EquipmentGroupSizeLimitDialog from './EquipmentGroupSizeLimitDialog.vue';

const props = defineProps<{
  loading: boolean,
  list: MaterialTypeLimitItemType[]
  allPropertyList: PropertyListItemType[]
  MaterialTypeGroup: IMaterialTypeGroupItemType[]
}>();

const emit = defineEmits(['limitItemRemove', 'saveConditon', 'removeCondition', 'setSizeLimit']);

const mainList = computed(() => {
  const list = getMaterialConstraintsListWithNames(props.list, props.MaterialTypeGroup);
  return list.map(it => ({
    ...it,
    title: `${it.CategoryName} - ${it.MaterialTypeName}`,
  }));
});

const activeId = ref<number | string>('');

const getPropertyList = (item: MaterialTypeLimitItemType) => {
  const list = props.allPropertyList.filter(it => it.MaterialType?.ID === item.MaterialTypeID);
  return list;
};

const onTableRemoveClick = (e: IMaterialTypeLimitTableItemType) => {
  MpMessage.warn({
    title: '确定删除该物料类型吗 ?',
    msg: `类型：[ ${e.title} ]`,
    onOk: () => {
      emit('limitItemRemove', e);
    },
  });
};

const onSaveClick = (it: IMaterialTypeLimitTableItemType, condition) => {
  emit('saveConditon', it, condition);
};

const onRemoveClick = (it: IMaterialTypeLimitTableItemType, [condition]) => {
  emit('removeCondition', it, condition);
};

/** 尺寸设置相关
----------------------------------------------- */
const sizeLimitVisible = ref(false);
const curItem = ref<null | MaterialTypeLimitItemType>(null);

const onSizeLimitClick = (it: IMaterialTypeLimitTableItemType) => {
  curItem.value = it;
  sizeLimitVisible.value = true;
};

const handleSizeLimitSubmit = (e) => {
  const cb = () => {
    curItem.value = null;
    sizeLimitVisible.value = false;
  };
  emit('setSizeLimit', e, cb);
};

const formatSizeLimit = (it: MaterialTypeLimitItemType) => {
  const {
    MinSizeWidh, MaxSizeWidh, MinSizeLength, MaxSizeLength,
  } = it;

  const arr: string[] = [];

  let str1 = '';
  if (typeof MinSizeWidh === 'number' && typeof MinSizeLength === 'number') {
    if (MinSizeWidh === -1 || MinSizeLength === -1) {
      str1 += `最小：${MinSizeLength === -1 ? '无限大' : `${MinSizeLength}mm`}×${MinSizeWidh === -1 ? '无限大' : `${MinSizeWidh}mm`}`;
    } else {
      str1 += `最小：${MinSizeLength}×${MinSizeWidh}mm`;
    }
  }
  arr.push(str1);

  let str2 = '';
  if (typeof MaxSizeWidh === 'number' && typeof MaxSizeLength === 'number') {
    if (MaxSizeWidh === -1 || MaxSizeLength === -1) {
      str2 += `最大：${MaxSizeLength === -1 ? '无限大' : `${MaxSizeLength}mm`}×${MaxSizeWidh === -1 ? '无限大' : `${MaxSizeWidh}mm`}`;
    } else {
      str2 += `最大：${MaxSizeLength}×${MaxSizeWidh}mm`;
    }
  }
  arr.push(str2);

  return arr.filter(it => it).join('；');
};

</script>

<style scoped lang='scss'>
.interlining {
  margin-bottom: 9px;
  margin-top: -3px;
  font-size: 12px;
  padding-left: 10px;
  display: flex;
  align-items: center;
  button {
    font-size: 12px;
    margin-right: 25px;
    padding: 0;
  }
}
</style>
