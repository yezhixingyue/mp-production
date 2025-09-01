<template>
  <section class="put-out-page" >
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="onSaveClick(null)">+ 添加条件</mp-button>
        <mp-button class="blue" v-if="EquipmentData" @click="visible=true" :disabled="EquipmentData.EquipmentList.length <= 1">
          <i class="iconfont icon-daoru"></i> 导入条件</mp-button>
        <span class="is-blue-span ml-25" @click="oldVisible=true">查看旧版本数据</span>
        <span class="tips-box"><el-icon><WarningFilled /></el-icon> 匹配一条作为申放设置</span>
      </div>
    </header>
    <main>
      <ListTable :tableList="localTableList" @rowRemove="onRemoveClick" @rowSave="onSaveClick" />

      <ImportDialog v-model:visible="visible" v-if="EquipmentData && typeof FormulaUseModule === 'number' && WorkingID"
        :EquipmentData="EquipmentData" :FormulaUseModule="FormulaUseModule" :WorkingID="WorkingID"
        :PropertyList="PropertyList"
        @success="handleImportSuccess" />

      <!-- 旧数据 -->
      <OldDataDisplayDialog v-model:visible="oldVisible" v-if="EquipmentData" :EquipmentData="EquipmentData" :PropertyList="PropertyList" />
    </main>
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { getGoBackFun } from '@/router';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { computed, ref } from 'vue';
import { TransformConstraintTableItemType, transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { UseModuleEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import ListTable from './ListTable.vue';
import { PutOutConditionItemType } from '../js/PutOutConditionItemClass';
import ImportDialog from './ImportDialog.vue';
import { EquipmentListType } from '../js/types';
import OldDataDisplayDialog from './OldDataDisplayDialog.vue';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  list: PutOutConditionItemType[],
  PropertyList: PropertyListItemType[],
  FormulaUseModule?: UseModuleEnum
  WorkingID?: string
  EquipmentData?: { curEquipID: null | string; EquipmentList: EquipmentListType[] } | null
}>();

const emit = defineEmits(['save', 'remove', 'imported']);

const localTableList = computed(() => transformConstraintTableList({
  tableList: props.list,
  PropertyList: props.PropertyList,
}));

const onSaveClick = (it: TransformConstraintTableItemType<PutOutConditionItemType> | null) => {
  emit('save', it);
};

const onRemoveClick = (it: TransformConstraintTableItemType<PutOutConditionItemType> | null) => {
  emit('remove', it);
};

const visible = ref(false);
const oldVisible = ref(false);

const handleImportSuccess = (newConditionList: PutOutConditionItemType[]) => {
  emit('imported', newConditionList);
};

</script>

<style lang='scss'>
@import '@/assets/css/var.scss';

$row-hover-bg-color: lighten($color: #d8effc, $amount: 6);
$row-hover-border-color: #d6effc;
$row-active-bg-color: lighten($color: #d8effc, $amount: 6);
$row-active-border-color: darken($color: #d8effc, $amount: 15);

.put-out-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
    .header-top{
      margin-top: 20px;
      .tips-box {
        margin-left: 20px;
        i {
          vertical-align: -2px;
        }
      }

      .iconfont {
        font-size: 15px;
      }
    }
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
  .add-equipment-dialog{
    .one-list{
      min-height: 350px;
      p{
        font-size: 14px;
        font-weight: 700;
        padding: 10px 0;
      }
      .one{
        padding-left: 1em;
      }
      .tow{
        padding-left: 2em;
      }
      .checkbox{
        padding-left: 3em;
      }
    }
  }
}
</style>
