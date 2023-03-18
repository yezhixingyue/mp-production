<template>
  <li class="info-item-wrap">
    <p class="mp-common-title-wrap black">{{ tableItem.title }}</p>
    <table>
      <tbody>
        <tr v-for="(it, i) in tableItem.list" :key="i">
          <td class="title">{{ it.label }}：</td>
          <td class="content" :class="{'is-blue-span': !!it.haveEvent}" @click="onClick(it.haveEvent)">{{ it.value }}</td>
        </tr>
      </tbody>
    </table>
  </li>
</template>

<script setup lang='ts'>
import { IExceptionLeftDisplayList } from './util';

defineProps<{
  tableItem: IExceptionLeftDisplayList
}>();

const emit = defineEmits(['menuclick']);

const onClick = (label) => {
  emit('menuclick', label);
};
</script>

<style scoped lang='scss'>
.info-item-wrap {
  > p {
    margin-bottom: 14px;
  }
  > table {
    border-collapse: collapse;
    > tbody {
      > tr {
        td {
          border: 1px solid #e5e5e5;
          font-size: 13px;
          line-height: 16px;
          padding: 12px 0;
          &.title {
            width: 105px;
            text-align: right;
            font-weight: 700;
            padding-right: 5px;
          }
          &.content {
            width: 260px;
            padding: 8px 20px;
          }
        }
      }
    }
  }

  & + .info-item-wrap {
    margin-top: 20px;
  }
}
</style>
