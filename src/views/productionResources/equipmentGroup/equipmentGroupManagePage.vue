<template>
  <section class="equipment-group-list-page-wrap">
    <Header @add="onItemSetupClick" />
    <Main :EquipmentGroupData="EquipmentGroupData" :MaterialTypeGroup="MaterialTypeGroup" @menuClick="onMenuClick" />
    <Footer :condition="EquipmentGroupData.condition" :total="EquipmentGroupData.DataNumber" :getList="getList" />
    <ItemSetupDialog v-model:visible="visible" :EquipmentGroupData="EquipmentGroupData" @submit="handleItemSetupSubmit" />
    <SizeLimitDialog v-model:visible="sizeLimitVisible" :EquipmentGroupData="EquipmentGroupData" @submit="handleSizeLimitSubmit" />
    <ColorLimitDialog v-model:visible="colorLimitVisible" :EquipmentGroupData="EquipmentGroupData" @submit="handleColorLimitSubmit" />
  </section>
</template>

<script setup lang='ts'>
import Header from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupListHeader.vue';
import Main from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupListMain.vue';
import Footer from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupListFooter.vue';
import ItemSetupDialog from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupItemSetupDialog.vue';
import SizeLimitDialog from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupSizeLimitDialog.vue';
import ColorLimitDialog from '@/components/productionResources/EquipmentGroup/List/EquipmentGroupColorLimitDialog.vue';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import { EquipmentGroupItemClass, EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { onMounted, ref } from 'vue';
import { EquipmentGroupMenuEnumType } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { GroupSizeLimitClass } from '@/store/modules/resource/EquipmentGroupTypeClass/GroupSizeLimitClass';
import { GroupColorLimitClass } from '@/store/modules/resource/EquipmentGroupTypeClass/GroupColorLimitClass';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useResourceStore();
const { EquipmentGroupData, MaterialTypeGroup } = storeToRefs(store);

/** 编辑|新增相关
---------------------------- */
const visible = ref(false);

const onItemSetupClick = (e: EquipmentGroupItemType | null) => {
  EquipmentGroupData.value.setCurEditItem(e);
  visible.value = true;
};
const handleItemSetupSubmit = (item: EquipmentGroupItemClass) => { // 添加 和 编辑
  const closeDialogFunc = () => {
    visible.value = false;
  };
  EquipmentGroupData.value.save(item, closeDialogFunc);
};

/** 尺寸限制相关
---------------------------- */
const sizeLimitVisible = ref(false);

const handleSizeLimitSubmit = (e: GroupSizeLimitClass) => {
  const closeDialogFunc = () => {
    sizeLimitVisible.value = false;
  };
  EquipmentGroupData.value.setSizeLimit(e, closeDialogFunc);
};

/** 印色数量限制相关
---------------------------- */
const colorLimitVisible = ref(false);

const handleColorLimitSubmit = (e: GroupColorLimitClass) => {
  const closeDialogFunc = () => {
    colorLimitVisible.value = false;
  };
  EquipmentGroupData.value.setColorLimit(e, closeDialogFunc);
};

/** 按钮点击事件
---------------------------- */
const onMenuClick = (item: EquipmentGroupItemType, type: EquipmentGroupMenuEnumType) => {
  if (type !== EquipmentGroupMenuEnumType.edit && type !== EquipmentGroupMenuEnumType.remove) {
    EquipmentGroupData.value.setCurEditItem(item);
  }

  switch (type) {
    case EquipmentGroupMenuEnumType.edit:
      onItemSetupClick(item);
      break;
    case EquipmentGroupMenuEnumType.remove:
      EquipmentGroupData.value.remove(item);
      break;
    case EquipmentGroupMenuEnumType.size:
      // 尺寸限制
      sizeLimitVisible.value = true;
      break;
    case EquipmentGroupMenuEnumType.material:
      // 物料限制
      router.push({ name: 'equipmentGroupMaterialLimitList' });
      break;
    case EquipmentGroupMenuEnumType.color:
      // 印色数量限制
      colorLimitVisible.value = true;
      break;
    default:
      break;
  }
};

const getList = (e) => EquipmentGroupData.value.getList(e);

onMounted(() => {
  EquipmentGroupData.value.fetchRequiredData();
  store.getMaterialTypeGroup();
});

</script>

<script lang='ts'>
export default {
  name: 'equipmentGroupManagePage',
};
</script>

<style scoped lang='scss'>
.equipment-group-list-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    height: 70px;
    margin-bottom: 10px;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
    }
  }
  > main {
    flex: 1;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      .el-button.is-link {
        font-size: 12px;
      }
      .el-button + .el-button {
        margin-left: 15px;
      }
    }
  }
  > footer {
    height: 50px;
  }

  > header, > footer {
    flex: none;
    display: flex;
    align-items: center;
  }
  > header, > footer, > main {
    background-color: #fff;
  }
}
</style>
