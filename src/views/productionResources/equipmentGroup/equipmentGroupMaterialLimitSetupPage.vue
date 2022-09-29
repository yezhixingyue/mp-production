<template>
  <div class="group-material-limit-setup-page">
    <ConstraintSetupPageComp class="content" :PropertyList="PropertyList" :condition="MaterialTypeLimitData.curConditionItem" @submit="submit">
      <template #header>
        <Header :EquipmentGroupData="EquipmentGroupData" :MaterialTypeLimitData="MaterialTypeLimitData" />
      </template>
    </ConstraintSetupPageComp>
  </div>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/EquipmentGroup/Constraint/ConstraintHeader.vue';
import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import api from '@/api';
import { computed } from 'vue';
import { ConditionItemClass } from '@/components/common/ConstraintsComps/ConditionSetupPanel/ConditionItemClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';

const store = useResourceStore();
const { EquipmentGroupData, MaterialTypeLimitData } = storeToRefs(store);

const PropertyList = computed(() => { // 当前物料类型属性列表
  if (!MaterialTypeLimitData.value.curMaterialTypeLimitItemTable) return [];
  const list = MaterialTypeLimitData.value.PropertyList;
  const id = MaterialTypeLimitData.value.curMaterialTypeLimitItemTable.MaterialTypeID;
  return list.filter(it => it.MaterialType?.ID === id);
});

const submit = async (e: ConditionItemClass) => {
  if (!MaterialTypeLimitData.value.curMaterialTypeLimitItemTable) return;
  const temp = { ...e, GroupMaterialTypeID: MaterialTypeLimitData.value.curMaterialTypeLimitItemTable.ID };
  const resp = await api.getEquipmentGroupMaterialTypeConditionLimitSave(temp).catch(() => null);
  if (resp?.data.isSuccess) {
    const isEdit = !!temp.ID;
    const cb = () => {
      MaterialTypeLimitData.value.handlerConditionItemChange({
        conditonItem: { ...temp, ID: +resp.data.Data },
        isEdit,
        isRemove: false,
      });
      // 处理数据变动
      getGoBackFun();
    };

    MpMessage.success({
      title: isEdit ? '编辑成功' : '添加成功',
      onOk: cb,
      onCancel: cb,
    });
  }
};

</script>

<script lang='ts'>
export default {
  name: 'equipmentGroupMaterialLimitSetupPage',
};
</script>

<style scoped lang='scss'>
.group-material-limit-setup-page {
  background-color: #fff;
  height: 100%;
  .content {
    width: 920px;
  }
}
</style>
