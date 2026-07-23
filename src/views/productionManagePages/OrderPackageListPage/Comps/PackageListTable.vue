<template>
  <main>
    <el-table :data="packageList" stripe border class="row-ft-12">
      <mp-table-column min-width="100px" prop="Order.OrderCode" label="订单号"></mp-table-column>
      <mp-table-column min-width="120px" prop="ID" label="包裹号"></mp-table-column>
      <mp-table-column min-width="110px" prop="_JoinDate" label="打包时间">
        <template #default="scope:any">
          {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="100px" prop='Weight' label="重量（kg）"></mp-table-column>
      <mp-table-column min-width="170px" prop="_gender" label="产品">
        <template #default="scope:any">
          {{[scope.row.Order.FirstLevel, scope.row.Order.SecondLevel, scope.row.Order.ProductName].filter(it => it).join(' - ')}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="110px" prop="_JoinDate" label="打包时间">
        <template #default="scope:any">
          {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
        </template>
      </mp-table-column>
      <template #empty>
        <span v-show="!props.loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IPackageList } from '@/views/ChangeLabelPage/types';

const props = withDefaults(defineProps<{
  packageList: IPackageList[]
  loading?: boolean
}>(), {
  loading: false,
});
</script>
