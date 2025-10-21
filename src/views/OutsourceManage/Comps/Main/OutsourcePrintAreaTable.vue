<template>
  <main>
    <table>
      <thead>
        <tr>
          <th style="width: 25%;">物料信息</th>
          <th style="width: 18%;">{{ curRow._PrintMaterialSizeTitle }}</th>
          <th style="width: 18%;">返货数量</th>
          <th style="width: 11%;">申放</th>
          <th >外协价格</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div style="font-size: 0.85em;">{{ curRow._Material || '-' }}</div>
          </td>
          <td>
            <div>{{ curRow._Size || '-' }}</div>
          </td>
          <td>{{ curRow._Number || '-' }}</td>
          <td>{{ curRow._Wastage || '-' }}</td>
          <td>{{ `${curRow._ExternalSubmitParams.Amount}`.replace(/(?=(\B)(\d{3})+$)/g, ',') }}元</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th style="width: 18%;">工序名称</th>
          <th style="width: 54%;">加工要求</th>
          <th >返货时间</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><div>{{ curRow._WorkingName }}</div></td>
          <!-- <td><div style="font-size: 0.85em;">{{ [curRow._AssistText, curRow._SpecialColorText].filter(it => it).join('；') || '-' }}</div></td> -->
          <td><div style="font-size: 0.85em;">{{ curRow._AssistText || '-' }}</div></td>
          <td>{{ curRow._ExternalSubmitParams.WishFinishTime?.split('T')[0] }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup lang='ts'>
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';

defineProps<{
  curRow: ReturnType<typeof getLocalTaskList>[number]
}>();
</script>

<style scoped lang='scss'>
</style>
