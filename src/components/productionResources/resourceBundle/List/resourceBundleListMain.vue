<template>
  <main>
    <el-table :data="props.list" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column min-width="270px" prop="Name" label="资源包名称" />
      <mp-table-column min-width="150px" prop="Feature" label="性质">
        <template #default="scope">{{formatFeatureType(scope.row.Feature)}}{{ scope.row.IsPlateMaterial ? '(版材)' : '' }}</template>
      </mp-table-column>
      <mp-table-column min-width="320px" prop="MaterialTypeGroups" label="包含物料类型">
        <template #default="scope">{{formatMaterialTypeGroups(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column min-width="170px" prop="MatchType" label="满足方式">
        <template #default="scope">{{formatMatchType(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column min-width="220px" label="操作">
        <template #default="scope">
          <mp-button type="info" link @click="onEditClick(scope.row)"><i class="iconfont icon-bianji"></i>编辑</mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)"><i class="iconfont icon-delete"></i>删除</mp-button>
        </template>
      </mp-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getEnumNameByID, localEnumValueIDType } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MpButton from '@/components/common/MpButton.vue';
import {
  ResourceBundleClass, resourceBundleFeatureEnumObj, resourceBundleMatchEnumObj,
} from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { getTableDiaplayContent } from '../Setup/MaterialTypeGroupSelector/utils';

const props = defineProps<{
  list: ResourceBundleClass[],
  MaterialTypeGroup: IMaterialTypeGroupItemType[],
}>();

const emit = defineEmits(['edit', 'remove']);

const formatFeatureType = (Feature: localEnumValueIDType) => getEnumNameByID(Feature, resourceBundleFeatureEnumObj);
const formatMatchType = (item: ResourceBundleClass) => {
  if (item.Feature === resourceBundleFeatureEnumObj.semifinished.ID) return '';
  return getEnumNameByID(item.MatchType, resourceBundleMatchEnumObj);
};
const formatMaterialTypeGroups = (item: ResourceBundleClass) => {
  if (item.Feature === resourceBundleFeatureEnumObj.semifinished.ID) return '';
  return getTableDiaplayContent(item.MaterialTypeGroups, props.MaterialTypeGroup);
};

const onEditClick = (it: ResourceBundleClass) => {
  emit('edit', it);
};

const onRemoveClick = (it: ResourceBundleClass) => {
  MpMessage.warn({
    title: '确定删除该物料资源包吗 ?',
    msg: `资源包名称：[ ${it.Name} ]`,
    onOk: () => {
      emit('remove', it);
    },
  });
};

const getRowKey = (row: ResourceBundleClass) => row.ID;

</script>

<style scoped lang='scss'>
</style>
