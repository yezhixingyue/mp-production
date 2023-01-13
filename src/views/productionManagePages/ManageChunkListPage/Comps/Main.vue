<template>
  <main>
    <el-table :data="localList" border stripe class="table-wrap">
      <mp-table-column width="130px" prop="ServerName" label="销售端" />
      <mp-table-column width="100px" prop="ChunkID" label="块ID" />
      <mp-table-column width="100px" prop="ChunkCode" label="块编号" />
      <mp-table-column width="100px" prop="PlateCode" label="所在大版ID" />
      <mp-table-column min-width="160px" prop="Material" label="物料" />
      <mp-table-column min-width="140px" prop="Size" label="尺寸" />
      <mp-table-column width="110px" prop="_Number" label="数量" />
      <mp-table-column width="130px" prop="Line" label="生产线" />
      <mp-table-column width="130px" prop="_Position" label="当前位置" />
      <mp-table-column width="110px" prop="_StatusText" label="状态" />
      <mp-table-column width="280px" label="操作" class-name="ctrl">
        <template #default="scope">
        <mp-button type="primary" class="ft-12" link @click="onProcessClick(scope.row, scope.$index)">生产流程</mp-button>
        <mp-button type="primary" class="ft-12" link @click="onThumbnailClick(scope.row, scope.$index)">查看缩略图</mp-button>
      </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { getEnumNameByIDAndEnumList } from '@/assets/js/utils/getListByEnums';
import { computed } from 'vue';
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
    _Position: it.Equipment ? [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') : '',
    _StatusText: getEnumNameByIDAndEnumList(it.Status, ChunkStatusEnumList) || '',
  }));

  return list;
});

const onProcessClick = (item: IManageChunkInfo, index: number) => { // 生产流程
  console.log('onProcessClick', item, index);
};

const onThumbnailClick = (item: IManageChunkInfo, index: number) => { // 查看缩略图
  console.log('onThumbnailClick', item, index);
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
  }
}
</style>
