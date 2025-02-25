<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="130px" prop="ServerName" label="销售端" />
      <mp-table-column width="120px" prop="ChunkID" label="块ID" />
      <mp-table-column width="110px" prop="ChunkCode" label="块编号" />
      <mp-table-column width="100px" prop="PlateCode" label="所在大版ID" />
      <mp-table-column width="85px" prop="PlateIndex" label="套数序号" />
      <mp-table-column min-width="170px" prop="Material" label="物料" />
      <mp-table-column min-width="140px" prop="Size" label="尺寸" />
      <mp-table-column width="110px" prop="_Number" label="数量" />
      <mp-table-column width="130px" prop="Line" label="生产线" />
      <mp-table-column width="125px" prop="_ImpositionTime" label="拼版时间" />
      <mp-table-column width="130px" prop="Position" label="当前位置" />
      <mp-table-column width="110px" prop="_StatusText" label="状态" />
      <mp-table-column width="228px" label="操作" class-name="ctrl">
        <template #default="scope:any">
          <mp-button type="primary" class="ft-12" link @click="onProcessClick(scope.row)">生产流程</mp-button>
          <mp-button type="primary" class="ft-12" link :disabled="!scope.row.FrontThumbil" @click="onThumbnailClick(scope.row)">查看缩略图</mp-button>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
    <NodePicDialog v-model:visible="processVisible" :item="curRow" :targetType="ReportModeEnum.block" />
    <PictureDisplayDialog v-model:visible="ThumbnailVisible" :title="`缩略图：${curRow?.ChunkCode || ''} (${curRow?.ChunkID || ''})`" :picSrcList="ThumbnailList" />
  </main>
</template>

<script setup lang='ts'>
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { computed, ref } from 'vue';
import PictureDisplayDialog from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/PictureDisplayDialog.vue';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { ChunkStatusEnumList } from '../js/EnumList';
import { IManageChunkInfo } from '../js/type';

const props = defineProps<{
  list: IManageChunkInfo[]
  loading: boolean
}>();

const localList = computed(() => {
  const list = props.list.map(it => ({
    ...it,
    _Number: it.Number || it.Number === 0 ? `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit || ''}` : '',
    _StatusText: getEnumNameByID(it.Status, ChunkStatusEnumList) || '',
    _ImpositionTime: format2MiddleLangTypeDateFunc2(it.ImpositionTime),
  }));

  return list;
});

/** 当前设置对象条目 弹窗共用 */
const curRow = ref<null | typeof localList.value[number]>(null);

/** 生产流程 */
const processVisible = ref(false);
const onProcessClick = (item: typeof localList.value[number]) => { // 生产流程
  curRow.value = item;
  processVisible.value = true;
};

const ThumbnailVisible = ref(false);
const ThumbnailList = ref<string[]>([]);
const onThumbnailClick = (item: typeof localList.value[number]) => { // 查看缩略图
  curRow.value = item;
  ThumbnailList.value = [item.FrontThumbil, item.BackThumbil].filter(it => it);
  ThumbnailVisible.value = true;
};

</script>

<style scoped lang='scss'>
.table-wrap {
  :deep(td.ctrl) {
    .cell {
      .el-button + .el-button {
        margin-left: 30px;
      }
    }
  }

  :deep(.el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell) {
    height: 44px;

    .cell {
      padding: 0 6px;
    }
  }
}
</style>
