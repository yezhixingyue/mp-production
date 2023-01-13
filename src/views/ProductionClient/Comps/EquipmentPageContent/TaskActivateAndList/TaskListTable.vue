<template>
  <main>
    <el-table :data="localTaskList" border stripe class="table-wrap">
      <mp-table-column width="150px" prop="Code" label="任务编号" />
      <mp-table-column width="170px" prop="_TargetID" label="编号" />
      <mp-table-column width="100px" prop="_ProcessTimes" label="加工次数" />
      <mp-table-column min-width="200px" prop="_AssistText" label="辅助信息" class-name="is-pink" />
      <mp-table-column min-width="180px" prop="_Material" label="物料" />
      <mp-table-column width="110px" prop="_Number" label="数量" />
      <mp-table-column width="100px" prop="_StatusText" label="状态" />
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无{{ isError ? '待转移' : '' }}任务</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getEnumNameByIDAndEnumList } from '@/assets/js/utils/getListByEnums';
import { ProductiveTaskStatusEnumList } from '@/views/ProductionClient/assets/js/enum';
import { IEquipmentTaskInfo } from '@/views/ProductionClient/assets/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { computed } from 'vue';
import { getTaskDisplayInfo } from '../CurTaskPanel';

const props = withDefaults(defineProps<{
  TaskList: IEquipmentTaskInfo[]
  loading?: boolean
  isError?: boolean
}>(), {
  loading: false,
  isError: false,
});

const localTaskList = computed(() => {
  const list = props.TaskList.map(it => {
    let _TargetID = '';
    let _Material = '';

    switch (it.Working.ReportMode) {
      case ReportModeEnum.board:
        _TargetID = `${it.Working.PlateInfo?.Code || ''}（大版）`;
        _Material = it.Working.PlateInfo?.Material || '';
        break;

      case ReportModeEnum.order:
        _TargetID = `${it.Working.OrderInfo?.ID || ''}（订单）`;
        break;

      case ReportModeEnum.block:
        _TargetID = `${it.Working.OrderInfo?.ID || ''} ${it.Working.ChunkInfo?.Name}（块）`;
        _Material = it.Working.PlateInfo?.Material || '';
        break;

      default:
        break;
    }

    const _ProcessTimes = it.Index ? `第${it.Index}次` : '';
    const _AssistText = it.Working.AssistList.filter(it => it.Type === AssistInfoTypeEnum.text).map(it => it.Content).filter(Content => Content).join('；');

    const info = getTaskDisplayInfo(it);

    const _Number = `${it.UnFinishNumber}${info.Unit}`;

    const _StatusText = props.isError ? '待转移' : getEnumNameByIDAndEnumList(it.Status, ProductiveTaskStatusEnumList);

    return {
      ...it,
      _TargetID,
      _ProcessTimes, // 是第几次加工次数
      _AssistText, // 辅助文字信息
      _Material,
      _Number,
      _StatusText,
    };
  });

  return list;
});
</script>

<style scoped lang='scss'>
.table-wrap {
  margin-top: 25px;
  :deep(.el-table__header-wrapper) {
    display: none;
    th > .cell {
      font-size: 15px;
    }
  }
  :deep(td.is-pink) {
    .cell {
      color: #ff0000;
      padding: 0 6px;
    }
  }
  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;
  }
}
</style>
