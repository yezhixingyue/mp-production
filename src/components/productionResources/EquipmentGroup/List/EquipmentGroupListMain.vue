<template>
  <main>
    <el-table :data="props.EquipmentGroupData.DataList" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column min-width="120px" prop="ClassID" label="分类">
        <template #default="scope">{{formatListName(scope.row.ClassID, props.EquipmentGroupData.EquipmentClassList)}}</template>
      </mp-table-column>
      <mp-table-column min-width="180px" prop="Name" label="组名称" />
      <mp-table-column min-width="180px" prop="Feature" label="可以外协工厂">
        <template #default="scope">
          {{formatListName(scope.row.FactoryIDS, props.EquipmentGroupData.SubcontractorFactoryList, { key: 'Name', value: 'ID' })}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="180px" label="尺寸限制">
        <template #default="scope">{{formatSizeLimit(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column min-width="220px" label="物料限制（禁用条件）">
        <template #default="scope">{{formatMaterialLimit(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column min-width="120px" prop="ColorLimitContent" label="印色数量限制" />
      <mp-table-column width="360px" label="操作">
        <template #default="scope">
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.size)">尺寸限制</mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.material)">物料限制</mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.color)">印色数量限制</mp-button>
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.edit)">编辑</mp-button>
          <mp-button type="danger" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.remove)">删除</mp-button>
        </template>
      </mp-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getNameByIDAndList } from '@/assets/js/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MpButton from '@/components/common/MpButton.vue';
import { EquipmentGroupMenuEnumType, EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { getMaterialConstraintsListWithNames } from '@/store/modules/resource/utils/utils';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>
  MaterialTypeGroup: IMaterialTypeGroupItemType[]
}>();

const emit = defineEmits(['menuClick']);

const formatListName = (id, list, options = { key: 'Name', value: 'ID' }) => getNameByIDAndList(id, list, options);
const formatSizeLimit = (it: EquipmentGroupItemType) => {
  const {
    MinWidth, MaxWidth, MinLength, MaxLength,
  } = it;

  let str = '';

  if (typeof MinWidth === 'number' && typeof MinLength === 'number') {
    if (MinWidth === -1 || MinLength === -1) {
      str += `最小：${MinLength === -1 ? '无限大' : `${MinLength}mm`}×${MinWidth === -1 ? '无限大' : `${MinWidth}mm`}，`;
    } else {
      str += `最小：${MinLength}×${MinWidth}mm，`;
    }
  }
  if (typeof MaxWidth === 'number' && typeof MaxLength === 'number') {
    if (MaxWidth === -1 || MaxLength === -1) {
      str += `最大：${MaxLength === -1 ? '无限大' : `${MaxLength}mm`}×${MaxWidth === -1 ? '无限大' : `${MaxWidth}mm`}，`;
    } else {
      str += `最大：${MaxLength}×${MaxWidth}mm，`;
    }
  }

  return str;
};
const formatMaterialLimit = (item: EquipmentGroupItemType) => {
  const list = getMaterialConstraintsListWithNames(item.MaterialConstraints, props.MaterialTypeGroup);
  return list.map(it => (it.LimitNumber ? `${it.MaterialTypeName}（${it.LimitNumber}条）` : `${it.MaterialTypeName}`)).join('、');
};

const onMenuClick = (it: EquipmentGroupItemType, type: EquipmentGroupMenuEnumType) => {
  if (type === EquipmentGroupMenuEnumType.remove) {
    MpMessage.warn({
      title: '确定删除该设备组吗 ?',
      msg: `组名称：[ ${it.Name} ]`,
      onOk: () => {
        emit('menuClick', it, type);
      },
    });
    return;
  }
  emit('menuClick', it, type);
};

const getRowKey = (row: EquipmentGroupItemType) => row.ID;
</script>

<style scoped lang='scss'>
</style>
