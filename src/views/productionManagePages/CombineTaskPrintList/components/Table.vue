<template>
  <el-table :data="localList" border stripe class="table-wrap">
    <!-- <mp-table-column width="65px" prop="_Index" label="序号" /> -->
    <mp-table-column width="110px" prop="Code" label="组合任务ID" />
    <mp-table-column min-width="100px" prop="Equipment.Name" label="设备名称" />
    <mp-table-column width="200px" prop="WorkingName" label="工序" />
    <mp-table-column width="110px" prop="OrderInfo.OrderID" label="订单号" />
    <mp-table-column width="200px" prop="OrderInfo.Content" label="内容" />
    <mp-table-column width="130px" prop="_Number" label="数量" />
    <mp-table-column width="160px" prop="_ImpositionRemark" label="拼版情况" />
    <mp-table-column width="150px" prop="_ResourceRemark" label="所需生产资源" />
    <mp-table-column width="130px" prop="_WishFinishTime" label="任务工期时间" />
    <mp-table-column width="85px" label="跟进">
      <template #default="scope:{ row: IUnionTaskTrackInfo }">
        <i v-if="scope.row.HaveTracked" class="iconfont icon-genjinduigou ft-11 ml-2" ></i>
        <i v-else-if="!scope.row.ImpositionRemark" class="iconfont icon-genjincuowu ft-14" style="color: #ff0000;"></i>
        <i v-else class="iconfont icon-weigenjin ft-2" style="font-size: 1.5px;color: #cbcbcb;margin-right: 4px;"></i>
      </template>
    </mp-table-column>
    <mp-table-column width="165px" label="操作" class-name="ctrl" v-if="Permission?.Obj.QueryWorkOrder">
      <template #default="scope:{ row: IUnionTaskTrackInfo }">
        <mp-button class="ft-12" :disabled="!!scope.row.ImpositionRemark" link @click="onViewClick(scope.row)">
          <i class="icon-chakan iconfont" style="font-size: 16px;" :class="{'is-blue': !scope.row.ImpositionRemark}"></i>
          <span>查看工单</span>
        </mp-button>
      </template>
    </mp-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { ElTable } from 'element-plus';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IUser } from '@/store/modules/user/types';
import { IUnionTaskTrackInfo } from '../types/type';

const props = defineProps<{
  list: IUnionTaskTrackInfo[]
  loading: boolean
  Permission: IUser['PermissionList']['PermissionManageUnionTask'] | undefined
}>();

const emit = defineEmits(['view']);

const localList = computed(() => props.list.map((it) => ({
  ...it,
  // _Index: i + 1,
  _ImpositionRemark: it.ImpositionRemark || '已完成',
  _ResourceRemark: it.ResourceRemark || '-',
  _WishFinishTime: format2MiddleLangTypeDateFunc2(it.WishFinishTime),
  _Number: it.OrderInfo ? `${it.OrderInfo.Number}${it.OrderInfo.Unit} ${it.OrderInfo.KindCount}款` : '',
})));

const onViewClick = (row: IUnionTaskTrackInfo) => { // 查看工单
  emit('view', row);
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
        margin-left: 6px;
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
