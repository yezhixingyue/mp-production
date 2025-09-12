<template>
  <ul v-if="taskDetail">
    <li
      style="display: grid;grid-template-rows: auto;grid-template-columns: 3.846em 1fr;text-align: center;margin-top: 0.5em;">
      <div class="aside-title" style="padding: 0.4em;border: 1px solid #EBEEF5;background-color: #f5f5f5;
        display: flex;align-items: center;justify-content: center; border-right: none;position: relative;">
        <span style="font-size: 1.077em">订单信息</span>
      </div>
      <table style="table-layout: auto;border-collapse: collapse;text-align: center;">
        <thead style="font-size: 1.077em;">
          <tr style="height: 2.8em;">
            <th style="border: 1px solid #EBEEF5;">订单号</th>
            <th style="border: 1px solid #EBEEF5;">产品名称</th>
            <th style="border: 1px solid #EBEEF5;">尺寸</th>
            <th style="border: 1px solid #EBEEF5;">款数</th>
            <th style="border: 1px solid #EBEEF5;">每款数量</th>
          </tr>
        </thead>
        <tbody style="font-size: 0.923em;">
          <tr style="height: 3.5em;">
            <td style="border: 1px solid #EBEEF5;width: 10em;">
              <span>{{ taskDetail.OrderInfo.OrderID }}</span>
            </td>
            <td style="border: 1px solid #EBEEF5;width: calc(100% - 36.5em)">
              <span>{{ taskDetail.OrderInfo.ProductName }}</span>
            </td>
            <td style="border: 1px solid #EBEEF5;width: 12.5em;">
              <span>{{ taskDetail.OrderInfo.Size }}</span>
            </td>
            <td style="border: 1px solid #EBEEF5;width: 6em;">
              <span>{{ taskDetail.OrderInfo.KindCount }}</span>
            </td>
            <td style="border: 1px solid #EBEEF5;width: 8em;">
              <span>{{ taskDetail.OrderInfo.Number }}{{ taskDetail.OrderInfo.Unit || '' }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </li>

    <li style="display: grid;grid-template-rows: auto;grid-template-columns: 3.846em 1fr;">
      <div class="aside-title" style="padding: 0.4em;border: 1px solid #EBEEF5;background-color: #f5f5f5;
        display: flex;align-items: center;justify-content: center; text-align: center;border-right: none;border-top: none;">
        <span style="font-size: 1.077em">生产内容</span>
      </div>
      <div style="font-size: 0.923em;border: 1px solid #EBEEF5;border-top: none;text-indent: 1em;padding: 0.5em;">
        <span style="height: 5em;line-height: 1.25em;
        overflow: hidden;text-overflow: ellipsis;display: -webkit-box;line-clamp: 4;-webkit-box-orient: vertical">{{ taskDetail.OrderInfo.Content }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { IUnionTaskDetail } from '../../types/type';

defineProps<{
  taskDetail: null | IUnionTaskDetail
}>();
</script>

<style scoped lang='scss'></style>
