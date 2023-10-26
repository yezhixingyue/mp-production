<template>
  <main>
    <el-empty description="暂无数据" v-if="!WorkID && !tabLoading" />
    <el-table v-else-if="WorkID" :data="localList" stripe border class="row-ft-12 table">
      <mp-table-column width="200px" prop="Name" label="组名称" />
      <mp-table-column width="280px" prop="Type" label="设备/工厂组">
        <template #default="scope:any">
          <span class="is-gray" v-if="typeof scope.row._EquipmentsContent === 'string'">{{scope.row._EquipmentsContent}}</span>
          <template v-else>
            <template v-for="(it, i) in scope.row._EquipmentsContent" :key="it.label">
              <em>{{it.label}}</em>：{{it.content}}
              <template v-if="i < scope.row._EquipmentsContent.length - 1">；</template>
            </template>
          </template>
        </template>
      </mp-table-column>
      <mp-table-column width="180px" prop="Type" label="物料来源">
        <template #default="scope:any">
          <span class="is-gray" v-if="typeof scope.row._MaterialsContent === 'string'">{{scope.row._MaterialsContent}}</span>
          <template v-else>
            <template v-for="(it, i) in scope.row._MaterialsContent" :key="it.label">
              <em>{{it.label}}</em>：{{it.content}}
              <template v-if="i < scope.row._MaterialsContent.length - 1">；</template>
            </template>
          </template>
        </template>
      </mp-table-column>
      <mp-table-column width="285px" label="操作">
        <template #default="scope:any" v-if="localPermission?.Setup">
          <mp-button type="primary" class="ft-12" :disabled="!(props.ClassEquipmentGroups?.length)"
           link @click="onEquipmentClick(scope.row)">选择设备/工厂</mp-button>
          <mp-button type="primary" class="ft-12" :disabled="!(props.MaterialSourcesData?.length)"
           link @click="onMakingGroupSourceClick(scope.row)">物料来源</mp-button>
          <mp-button type="primary" class="ft-12" link @click="onEditClick(scope.row)">编辑</mp-button>
          <mp-button type="danger" class="ft-12" link @click="onRemoveClick(scope.row)">删除</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span v-show="!props.loading" class="ft-12">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IClassEquipmentGroups, IMaterialSources } from '@/store/modules/productionSetting/types';
import { MaterialSourceTypeEnumObj } from '@/views/productionSetting/js/enums';
import { computed } from 'vue';
import { IUser } from '@/store/modules/user/types';
import { IPlateMakingGroup, IPlateMakingGroupSource } from '../../js/types';

const props = defineProps<{
  list: IPlateMakingGroup[]
  loading: boolean
  tabLoading: boolean
  WorkID: string
  MaterialSourcesData: null | IPlateMakingGroupSource[]
  ClassEquipmentGroups: null | IClassEquipmentGroups[]
  localPermission: IUser['PermissionList']['PermissionManagePlateMakeGroup']['Obj'] | undefined
}>();

const emit = defineEmits(['remove', 'edit', 'makingGroupSource', 'equipment']);

const formatMaterials = (list: IMaterialSources[]) => {
  if (props.MaterialSourcesData && props.MaterialSourcesData.length > 0) {
    const arr = props.MaterialSourcesData.map(it => {
      const t = list.find(_it => _it.MaterialTypeID === it.RelationID);
      const temp = {
        label: it.RelationName,
        content: t ? getEnumNameByID(t.SourceType, MaterialSourceTypeEnumObj) : '未设置',
      };
      return temp;
    });
    return arr;
  }
  return '暂无物料';
};

const formatEquipment = (Equipments: { ID: string }[]) => {
  if (props.ClassEquipmentGroups && props.ClassEquipmentGroups.length > 0) {
    if (Equipments.length === 0) return '未设置';
    const ids = Equipments.map(it => it.ID);
    const arr:{ label: string, content: string }[] = [];
    props.ClassEquipmentGroups.forEach(cla => {
      cla.EquipmentGroups.forEach(group => {
        const Equipments = group.Equipments.filter(equ => ids.includes(equ.ID));
        if (Equipments.length > 0) {
          const content = Equipments.map(it => it.Name).join('/');
          const label = group.GroupName;
          arr.push({ label, content });
        }
      });
    });
    if (arr.length === 0) return '未设置';
    return arr;
  }
  return '暂无设备';
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  _MaterialsContent: formatMaterials(it.Materials),
  _EquipmentsContent: formatEquipment(it.Equipments),
})));

const onEquipmentClick = (it) => {
  emit('equipment', it);
};

const onMakingGroupSourceClick = (it) => {
  emit('makingGroupSource', it);
};

const onEditClick = (it) => {
  emit('edit', it);
};

const onRemoveClick = (it: IPlateMakingGroup) => {
  MpMessage.warn({
    title: '确定删除该制版组吗',
    msg: `名称：[ ${it.Name} ]`,
    onOk: () => {
      emit('remove', it);
    },
  });
};
</script>

<style scoped lang='scss'>
.table {
  width: 945px;
  height: 100%;
}
</style>
