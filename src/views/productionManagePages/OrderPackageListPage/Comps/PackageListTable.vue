<template>
  <main>
    <el-table :data="packageList" stripe border class="row-ft-12">
      <mp-table-column min-width="120px" prop="ID" label="包裹号"></mp-table-column>
      <mp-table-column min-width="100px" prop="Order.OrderCode" label="订单号"></mp-table-column>
      <mp-table-column min-width="100px" prop="Order.Customer.CustomerSN" label="客户编号"></mp-table-column>
      <mp-table-column min-width="100px" prop="Order.Customer.CustomerName" label="客户"></mp-table-column>
      <mp-table-column min-width="150px" prop="Order.OrderCode" label="产品名称">
        <template #default="scope:any">
          {{[scope.row.Order.FirstLevel, scope.row.Order.SecondLevel, scope.row.Order.ProductName].filter(it => it).join(' - ')}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="80px" prop="Order.Number" label="数量">
        <template #default="scope:any">
          {{scope.row.Order.Number}}{{scope.row.Order.Unit}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="80px" prop='Weight' label="重量">
        <template #default="scope:any">
          {{scope.row.Weight}}kg
        </template>
      </mp-table-column>
      <mp-table-column min-width="80px" prop="TotalAmount" label="金额">
        <template #default="scope:any">
          {{scope.row.TotalAmount}}元
        </template>
      </mp-table-column>
      <mp-table-column min-width="80px" prop="PaidCashAmount" label="已付金额">
        <template #default="scope:any">
          {{scope.row.PaidCashAmount}}元
        </template>
      </mp-table-column>
      <mp-table-column min-width="80px" prop="UnpaidAmount" label="未付金额">
        <template #default="scope:any">
          {{scope.row.UnpaidAmount}}元
        </template>
      </mp-table-column>
      <mp-table-column min-width="100px" prop="Order.Address.ExpressText" label="配送方式"></mp-table-column>
      <mp-table-column min-width="180px" prop="Order.OrderCode" label="收件地址">
        <template #default="scope:any">
          {{[scope.row.Order.Address.Address.ExpressArea.RegionalName,
          scope.row.Order.Address.Address.ExpressArea.CityName,
          scope.row.Order.Address.Address.ExpressArea.CountyName,
          scope.row.Order.Address.Address.AddressDetail,
          ].filter(it => it).join(' ')}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="90px" prop="_JoinDate" label="包裹状态">
        <template #default="scope:any">
          <template v-if="scope.row.Status === 0">已打印</template>
          <template v-if="scope.row.Status === 1">已揽收</template>
          <template v-if="scope.row.Status === 255">已取消</template>
        </template>
      </mp-table-column>
      <mp-table-column min-width="110px" prop="_JoinDate" label="打包时间">
        <template #default="scope:any">
          {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
        </template>
      </mp-table-column>
      <mp-table-column min-width="100px" prop='Printer' label="打包人"></mp-table-column>
      <!-- <mp-table-column min-width="170px" prop="_gender" label="产品">
        <template #default="scope:any">
          {{[scope.row.Order.FirstLevel, scope.row.Order.SecondLevel, scope.row.Order.ProductName].filter(it => it).join(' - ')}}
        </template>
      </mp-table-column> -->
      <mp-table-column min-width="110px" prop="_JoinDate" label="下单时间">
        <template #default="scope:any">
          {{format2MiddleLangTypeDateFunc2(scope.row.Order.CreateTime)}}
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
