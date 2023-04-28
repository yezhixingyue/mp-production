<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12" empty-text="暂无数据">
      <mp-table-column prop="Name" min-width="200px" label="工厂名称" />
      <mp-table-column label="地址" min-width="260px">
        <template #default="scope:any">{{formatAddress(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column prop="LinkMan" label="联系人" min-width="120px" />
      <mp-table-column prop="Mobile" label="电话" min-width="120px" />
      <mp-table-column label="适用于设备分类" min-width="240px">
        <template #default="scope:any">{{formatEquipments(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column width="260px" label="操作">
        <template #default="scope:any">
          <mp-button type="info" link @click="onEditClick(scope.row)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </template>
      </mp-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { IDistrictTreeListItemType } from '@/store/modules/common/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';

const props = defineProps<{
  list: ISubcontractorFactoryListItemType[],
  DistrictTreeList: IDistrictTreeListItemType[],
  EquipmentClassList: EquipmentClassificationListItem[],
}>();

const emit = defineEmits(['edit', 'remove']);

const getRowKey = (row: ISubcontractorFactoryListItemType) => row.ID;
const formatAddress = (row: ISubcontractorFactoryListItemType) => {
  if (props.DistrictTreeList.length > 0) {
    const province = props.DistrictTreeList.find(it => it.ID === row.ProvinceID);
    if (province && province.children) {
      const city = province.children.find(it => it.ID === row.CityID);
      if (city) {
        return `${province.Name}${city.Name}${row.DetailAddress}`;
      }
    }
  }
  return '';
};
const formatEquipments = (row: ISubcontractorFactoryListItemType) => {
  if (props.EquipmentClassList.length > 0) {
    return row.ClassIDS.map(id => props.EquipmentClassList.find(it => it.ID === id)).filter(it => it).map(it => it?.Name).join('、');
  }
  return '';
};

const onEditClick = (it: ISubcontractorFactoryListItemType) => {
  emit('edit', it);
};

const onRemoveClick = (it: ISubcontractorFactoryListItemType) => {
  emit('remove', it);
};

</script>

<style scoped lang='scss'>
</style>
