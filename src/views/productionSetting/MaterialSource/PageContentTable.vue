<template>
  <p class="mp-common-title-wrap black" v-show="props.title">{{props.title}}：</p>
  <el-table border fit stripe :data="tableList" style="width: 100%">
    <el-table-column prop="MaterialTypeID" label="资源包" width="210">
      <template #default="scope:any">
        <span class="title" :title="scope.row._MaterialTypeGroup?.Name">{{scope.row._MaterialTypeGroup?.Name}}
          <template v-if="scope.row._MaterialTypeGroup?.IsPlateMaterial">(版材)</template>
        </span>
      </template>
    </el-table-column>
    <el-table-column width="130">
      <template #default="scope:any">
        <el-checkbox v-if="scope.row._MaterialTypeGroup?.Feature === resourceBundleFeatureEnumObj.semifinished.ID
         && !(scope.row._MaterialTypeGroup?.IsPlateMaterial && HideByIsPlateMaterial)"
          v-model="scope.row.NeedResource" label="必须资源"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column width="170">
      <template #default="scope:any">
        <el-checkbox v-model="scope.row.FactoryProvide"
         v-show="!(scope.row._MaterialTypeGroup?.IsPlateMaterial && HideByIsPlateMaterial)" label="如外协则外协厂自备"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column width="145">
      <template #default="scope:any">
        <el-checkbox
          v-if="scope.row._MaterialTypeGroup?.Feature === resourceBundleFeatureEnumObj.semifinished.ID
          && !(scope.row._MaterialTypeGroup?.IsPlateMaterial && HideByIsPlateMaterial)"
          :disabled="scope.row.SourceType !== MaterialSourceTypeEnum.otherPrcess && scope.row.SourceType !== '' "
          v-model="scope.row.AllowSourceLine" label="可来自其他生产线"></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column min-width="360">
      <template #default="scope:any">
        <span class="source" v-show="!(scope.row._MaterialTypeGroup?.IsPlateMaterial && HideByIsPlateMaterial)">
          <el-radio-group :class="{'other-line':scope.row._MaterialTypeGroup?.Feature !== resourceBundleFeatureEnumObj.semifinished.ID}"
            v-model="scope.row.SourceType">
            <!-- <el-radio :label="MaterialSourceTypeEnum.otherLine"
              v-if="scope.row._MaterialTypeGroup?.Feature === resourceBundleFeatureEnumObj.semifinished.ID">其他生产线</el-radio> -->
            <el-radio :label="MaterialSourceTypeEnum.outOfStorage" :disabled="scope.row.AllowSourceLine">预出库</el-radio>
            <el-radio :label="MaterialSourceTypeEnum.picking" :disabled="scope.row.AllowSourceLine">领料</el-radio>
            <!-- <el-radio :label="MaterialSourceTypeEnum.plateMaking" v-if="hasPlateMakingWork">制版工序</el-radio> -->
            <el-radio :label="MaterialSourceTypeEnum.otherPrcess" v-if="!withoutOtherPrcess">其他工序</el-radio>
          </el-radio-group>
          <template v-if="scope.row.SourceType === MaterialSourceTypeEnum.otherPrcess && !withoutOtherPrcess">
            <div class="Process-list" v-if="scope.row.SourceWorkIDS && scope.row.SourceWorkIDS.length"
              :title="scope.row.SourceWorkIDS.map(it => getProcessName(it)).join('\r\n或 ')">
              <template v-for="(item,i) in scope.row.SourceWorkIDS" :key="item">
                {{i === 0 ? '': ' 或 '}}
                <span>
                  {{getProcessName(item)}}
                </span>
              </template>
            </div>
            <mp-button link type="primary" class="ft-12" @click="selectProcess(scope.row)">
              选择工序
            </mp-button>
          </template>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang='ts'>
import { IMaterialSources, MaterialTypeGroupType } from '@/store/modules/productionSetting/types';
import { resourceBundleFeatureEnumObj } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MaterialSourceTypeEnum } from '../js/enums';
import { IWorkingProcedureSearch } from '../PlateMakingGroupView/js/types';

export interface ITableItem extends IMaterialSources {
  _MaterialTypeGroup?: MaterialTypeGroupType
}

const props = defineProps<{
  tableList: ITableItem[]
  withoutOtherPrcess?: boolean
  WorkingProcedureList: IWorkingProcedureSearch[]
  title: string
  hasPlateMakingWork?: boolean
  /** 是否在是版材的情况下隐藏设置项 */
  HideByIsPlateMaterial?: boolean
}>();

const emit = defineEmits(['select']);

const getProcessName = (ID) => props.WorkingProcedureList.find(it => it.ID === ID)?.Name;

const selectProcess = (it) => {
  emit('select', it);
};

</script>

<style scoped lang='scss'>
.el-table{
  .source{
    display: flex;
    line-height: 32px;
    .el-radio-group{
      margin-left: 16px;
      flex-wrap: nowrap;
    }
    // .other-line {
    //   margin-left: 20px;
    // }
    .Process-list{
      padding: 0 20px;
      padding-right: 0;
      max-width: calc(100% - 63px - 238px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 32px;
      color: #F4A307;
      span{
        color: #444;
      }
    }
    .el-button{
      margin-left: 20px;
    }
  }
  :deep(.el-table__body .el-table__cell) {
    text-align: left !important;
  }
  :deep(.el-table__header-wrapper) {
    display: none;
    tr th.el-table__cell::after {
      display: none;
    }
  }

  .title {
    margin-left: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.mp-common-title-wrap {
  // padding-left: 20px;
  padding-bottom: 10px;
  padding-top: 35px;
}
</style>
