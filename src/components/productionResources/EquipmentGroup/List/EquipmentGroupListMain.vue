<template>
  <main>
    <el-table :data="props.EquipmentGroupData.DataList" stripe border :row-key="getRowKey" class="row-ft-12">
      <mp-table-column min-width="100px" prop="ClassID" label="分类">
        <template #default="scope:any">{{formatListName(scope.row.ClassID, props.EquipmentGroupData.EquipmentClassList)}}</template>
      </mp-table-column>
      <mp-table-column min-width="135px" prop="Name" label="组名称" />
      <mp-table-column width="150px" prop="Feature" label="数码自动模切机">
        <template #default="scope:any">
          {{scope.row.IsDigitalAutoDieCut ? '是' : ''}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="170px" prop="Feature" label="可以外协工厂">
        <template #default="scope:any">
          {{formatListName(scope.row.FactoryIDS, props.EquipmentGroupData.SubcontractorFactoryList, { key: 'Name', value: 'ID' })}}
        </template>
      </mp-table-column>
      <!-- <mp-table-column width="150px" prop="Feature" label="叼口设置">
        <template #default="scope:any">
          <template v-if="scope.row.BiteMouthType !== GripperTypeEnum.empty">
            {{getNameByIDAndList(scope.row.BiteMouthType, GripperTypeEnumList)}}
            <i>( {{ scope.row.BiteMouthSize }}mm )</i>
          </template>
        </template>
      </mp-table-column> -->
      <!-- <mp-table-column width="125px" prop="Feature" label="允许批量报工">
        <template #default="scope:any">
          {{scope.row.AllowBatchReport ? '允许' : (scope.row.AllowBatchReport === false ? '不允许' : '' )}}
        </template>
      </mp-table-column> -->
      <!-- <mp-table-column min-width="200px" label="尺寸限制">
        <template #default="scope:any">{{formatSizeLimit(scope.row)}}</template>
      </mp-table-column> -->
      <mp-table-column min-width="260px" label="物料限制（禁用条件）">
        <template #default="scope:any">{{formatMaterialLimit(scope.row)}}</template>
      </mp-table-column>
      <mp-table-column width="140px" prop="ColorLimitContent" label="印色数量限制" />
      <mp-table-column width="400px" label="操作">
        <template #default="scope:any">
          <!-- <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.gripper)">叼口设置</mp-button> -->
          <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.material)"
           v-if='localPermission?.MaterialTypeLimit'>物料限制</mp-button>
          <mp-button type="primary" class="mr-35" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.color)"
           v-if='localPermission?.ColorLimit'>印色数量限制</mp-button>
          <!-- <mp-button type="primary" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.edit)">编辑</mp-button> -->
          <EditMenu style="margin-right:25px" @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.edit)" v-if='localPermission?.Setup' />
          <RemoveMenu style="margin-right:25px" @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.remove)" v-if='localPermission?.Setup' />
          <!-- <mp-button type="danger" link @click="onMenuClick(scope.row, EquipmentGroupMenuEnumType.remove)">删除</mp-button> -->
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
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { IUser } from '@/store/modules/user/types';
// import { GripperTypeEnumList, GripperTypeEnum } from '@/store/modules/resource/EquipmentGroupTypeClass/GripperSetupClass';

const props = defineProps<{
  EquipmentGroupData: Required<EquipmentGroupTypeClass>
  MaterialTypeGroup: IMaterialTypeGroupItemType[]
  localPermission?: IUser['PermissionList']['PermissionManageEquipmentGroup']['Obj']
}>();

const emit = defineEmits(['menuClick']);

const formatListName = (id, list, options = { key: 'Name', value: 'ID' }) => getNameByIDAndList(id, list, options);
// const formatSizeLimit = (it: EquipmentGroupItemType) => {
//   const {
//     MinWidth, MaxWidth, MinLength, MaxLength,
//   } = it;

//   const arr: string[] = [];

//   let str1 = '';
//   if (typeof MinWidth === 'number' && typeof MinLength === 'number') {
//     if (MinWidth === -1 || MinLength === -1) {
//       str1 += `最小：${MinLength === -1 ? '无限大' : `${MinLength}mm`}×${MinWidth === -1 ? '无限大' : `${MinWidth}mm`}`;
//     } else {
//       str1 += `最小：${MinLength}×${MinWidth}mm`;
//     }
//   }
//   arr.push(str1);

//   let str2 = '';
//   if (typeof MaxWidth === 'number' && typeof MaxLength === 'number') {
//     if (MaxWidth === -1 || MaxLength === -1) {
//       str2 += `最大：${MaxLength === -1 ? '无限大' : `${MaxLength}mm`}×${MaxWidth === -1 ? '无限大' : `${MaxWidth}mm`}`;
//     } else {
//       str2 += `最大：${MaxLength}×${MaxWidth}mm`;
//     }
//   }
//   arr.push(str2);

//   return arr.filter(it => it).join('；');
// };
const formatMaterialLimit = (item: EquipmentGroupItemType) => {
  const list = getMaterialConstraintsListWithNames(item.MaterialConstraints, props.MaterialTypeGroup);
  return list
    .map(it => (it.LimitNumber ? `${it.MaterialTypeName}（${it.LimitNumber}条）` : `${it.MaterialTypeName}`))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .join('、');
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
