<template>
  <el-table :data="localList" border stripe class="table-wrap" @selection-change="onSelectionChange" ref="oTableRef">
    <el-table-column type="selection" width="42" :selectable="(row: IDigitalOrderPlateInfo) => row.Status === DigitalImpositionStatusEnum.HaveScheduling" />
    <mp-table-column width="110px" prop="Code" label="大版ID" />
    <mp-table-column width="125px" prop="OrderCode" label="订单号" />
    <mp-table-column min-width="120px" prop="_Template" label="尺寸规格" />
    <mp-table-column min-width="120px" prop="Material" label="物料" />
    <mp-table-column min-width="120px" prop="Equipment" label="印刷机" />
    <mp-table-column width="100px" prop="_Number" label="数量"></mp-table-column>
    <mp-table-column width="140px" prop="_CreateTime" label="同步时间" />
    <mp-table-column width="140px" prop="_ImpositionTime" label="拼版时间" />
    <mp-table-column width="100px" prop="_StatusText" label="状态" />
    <mp-table-column width="100px" prop="_ImpositionType" label="拼版方式" />
    <mp-table-column width="100px" prop="Operator" label="拼版人员" />
    <mp-table-column min-width="120px" prop="Line" label="生产线" />
    <mp-table-column min-width="120px" prop="Error" label="错误" />
    <template #empty>
      <span class="ft-12" v-show="!localManageData.loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { ElTable } from 'element-plus';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ManageDigitalListClass } from '../js/ManageDigitalListClass';
import { IDigitalOrderPlateInfo } from '../js/types';
import { DigitalImpositionStatusEnumList, DigitalImpositionStatusEnum, DigitalImpositionTypeEnumList } from '../js/enum';

const props = defineProps<{
  localManageData: ManageDigitalListClass
}>();

const oTableRef = ref<InstanceType<typeof ElTable>>();

const localList = computed(() => props.localManageData.list.map(it => ({
  ...it,
  _Number: typeof it.Number === 'number' ? `${it.Number}${it.Unit || ''}` : '',
  _Template: [it.Template, it.TemplateSize].filter(it => it).join(' '),
  _StatusText: getEnumNameByID(it.Status, DigitalImpositionStatusEnumList),
  _ImpositionType: getEnumNameByID(it.ImpositionType, DigitalImpositionTypeEnumList),
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  _ImpositionTime: format2MiddleLangTypeDateFunc2(it.ImpositionTime),
})));

const onSelectionChange = async (val: IDigitalOrderPlateInfo[]) => {
  props.localManageData.setSelection(val);
};
</script>

<style scoped lang='scss'>
.table-wrap {
  height: 100%;
  :deep(th.content.is-leaf.el-table__cell) {
    text-align: left;
    padding-left: 10px;
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    .cell {
      padding: 0 8px;
    }

    button {
      font-size: 12px;
    }

    &.content {
      text-align: left;
      padding-left: 12px;
      color: #585858;
    }

    --el-fill-color-light: #eee;
  }
}
</style>
