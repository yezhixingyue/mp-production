<template>
  <table class="check-list-table" >
    <tbody>
      <tr v-for="chunk in ChunkList" :key="chunk.ID">
        <td class="check">
          <el-checkbox v-model="chunk.checked" />
        </td>
        <td style="width: 70px;">
          <span>{{ chunk.Order?.ServerName}}</span>
        </td>
        <td>
          <span style="width: 70px;text-align: center;">{{ chunk.Order?.OrderID }}</span>
        </td>
        <td>
          <span style="width: 160px;text-align: center;">{{ chunk.Name }}</span>
        </td>
        <td>
          <span style="width: 120px;text-align: center;">{{ chunk.Size }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang='ts'>
import { IRevocationChunk4RuleForm } from '../../../../js/ruleFormType';

defineProps<{
  ChunkList: IRevocationChunk4RuleForm[]
}>();
</script>

<style scoped lang='scss'>
.check-list-table {
  width: 100%;
  border-collapse: collapse;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  margin-top: 10px;
  margin-bottom: 20px;
  tr {
    td {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      font-size: 12px;
      height: 32px;
      &.check {
        text-align: center;
        width: 40px;
      }

      span {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
