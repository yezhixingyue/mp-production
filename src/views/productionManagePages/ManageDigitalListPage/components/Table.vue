<template>
  <el-table :data="localList" border stripe class="table-wrap" @selection-change="onSelectionChange" ref="oTableRef">
    <el-table-column type="selection" width="30" v-if="Permission?.Obj.Print || Permission?.Obj.Preview"
     :selectable="(row: (typeof localList)[number]) => row._Printable" />
    <mp-table-column width="65px" prop="Code" label="大版ID" />
    <mp-table-column width="85px" prop="OrderCode" label="订单号" />
    <mp-table-column min-width="75px" prop="SemiFinished" label="半成品" />
    <mp-table-column width="90px" prop="_Template" label="模板规格" />
    <mp-table-column min-width="100px" prop="Material" label="物料" />
    <mp-table-column min-width="100px" prop="Equipment" label="印刷机" />
    <mp-table-column width="80px" prop="_Number" label="份数" />
    <mp-table-column width="48px" prop="_PrintSideText" label="单双面" />
    <mp-table-column width="80px" prop="FileSize" label="拼版尺寸" />
    <mp-table-column width="80px" prop="MaterialSize" label="用料尺寸" />
    <mp-table-column width="75px" prop="MaterialNumber" label="用料数量" />
    <mp-table-column width="108px" prop="_CreateTime" label="同步时间" />
    <mp-table-column width="108px" prop="_ImpositionTime" label="拼版时间" />
    <mp-table-column width="50px" prop="_StatusText" label="状态" />
    <mp-table-column width="108px" prop="_LastPrintTime" label="最后打印时间" />
    <mp-table-column width="60px" prop="_ImpositionType" label="拼版方式" />
    <mp-table-column width="60px" prop="Operator" label="拼版人员" />
    <mp-table-column min-width="90px" prop="Line" label="生产线" />
    <mp-table-column min-width="65px" prop="Error" label="错误" />
    <mp-table-column width="105px" label="操作" class-name="ctrl" v-if="Permission?.Obj.FileRetransfer || Permission?.Obj.DownloadFile">
      <template #default="scope:any">
        <mp-button type="primary" class="ft-12" v-if="Permission?.Obj.FileRetransfer"
         :disabled="!scope.row._Exportable" link @click="onExportClick(scope.row)">导出</mp-button>
        <mp-button type="primary" class="ft-12" v-if="Permission?.Obj.DownloadFile"
         :disabled="!scope.row.FilePath || !scope.row._Downloadable" link @click="onDownloadClick(scope.row)">下载</mp-button>
        <mp-button type="primary" class="ft-12" v-if="Permission?.Obj.Revocation"
         :disabled="!scope.row._Revocable" link @click="onRevocationClick(scope.row)">撤销</mp-button>
      </template>
    </mp-table-column>
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
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IUser } from '@/store/modules/user/types';
import { ManageDigitalListClass } from '../js/ManageDigitalListClass';
import { IDigitalOrderPlateInfo } from '../js/types';
import { DigitalImpositionStatusEnumList, DigitalImpositionTypeEnumList } from '../js/enum';
import { PrintSideEnumList } from '../../ManualOrderHandlerPage/js/enums';

const props = defineProps<{
  localManageData: ManageDigitalListClass
  Permission: IUser['PermissionList']['PermissionManageDigitalPlate'] | undefined
}>();

const oTableRef = ref<InstanceType<typeof ElTable>>();

const localList = computed(() => props.localManageData.list.map(it => {
  const printableStatuses = DigitalImpositionStatusEnumList.filter(it => it.printable).map(it => it.ID); // 可打印状态
  const downloadableStatuses = DigitalImpositionStatusEnumList.filter(it => it.downloadable).map(it => it.ID); // 可下载状态
  const exportableStatuses = DigitalImpositionStatusEnumList.filter(it => it.exportable).map(it => it.ID); // 可导出状态
  const revocableStatuses = DigitalImpositionStatusEnumList.filter(it => it.revocable).map(it => it.ID); // 可撤销
  return {
    ...it,
    _Template: [it.TemplateSize].filter(it => it).join(' '),
    _StatusText: getEnumNameByID(it.Status, DigitalImpositionStatusEnumList),
    _ImpositionType: getEnumNameByID(it.ImpositionType, DigitalImpositionTypeEnumList),
    _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
    _ImpositionTime: format2MiddleLangTypeDateFunc2(it.ImpositionTime),
    _Printable: printableStatuses.includes(it.Status),
    _PrintSideText: getEnumNameByID(it.PrintSide, PrintSideEnumList),
    _Downloadable: downloadableStatuses.includes(it.Status),
    _Exportable: exportableStatuses.includes(it.Status),
    _Revocable: revocableStatuses.includes(it.Status),
    _LastPrintTime: format2MiddleLangTypeDateFunc2(it.LastPrintTime),
    _Number: typeof it.Number === 'number' ? (it.AppendFilePath ? `${it.Number - 1}${it.Unit} + 1${it.Unit}` : `${it.Number}${it.Unit}`) : '',
  };
}));

const onSelectionChange = async (val: IDigitalOrderPlateInfo[]) => {
  props.localManageData.setSelection(val);
};

const onExportClick = (item: IDigitalOrderPlateInfo) => {
  MpMessage.warn('确定导出该大版吗 ?', `大版ID：[${item.Code}]`, () => {
    props.localManageData.getPlateFileRetransfer(item.OrderID);
  });
};

const onDownloadClick = (item: IDigitalOrderPlateInfo) => {
  MpMessage.warn('确定下载该大版文件吗 ?', `大版ID：[${item.Code}]`, () => {
    if (item.FilePath) props.localManageData.download(item.FilePath);
    if (item.AppendFilePath) props.localManageData.download(item.AppendFilePath);
  });
};

const onRevocationClick = (item: IDigitalOrderPlateInfo) => { // 撤销
  props.localManageData.revocationData.open(item);
};

</script>

<style scoped lang='scss'>
.table-wrap {
  height: 100%;
  :deep(.cell) {
    padding: 0 2px;
  }
  :deep(th.content.is-leaf.el-table__cell) {
    text-align: left;
    padding-left: 10px;
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    button {
      font-size: 12px;

      &.el-button+.el-button {
        margin-left: 4px;
      }
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
