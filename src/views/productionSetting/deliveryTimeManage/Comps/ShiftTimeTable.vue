<template>
  <table class="list">
    <tbody>
      <tr v-for="(it, i) in tableList" :key="it.key">
        <td :title="it.label" class="label">{{it.label}}</td>
        <td :title="it.content" class="content">{{it.content}}</td>
        <td class="btns">
          <mp-button type="primary" link @click="onEditClick(i)">编辑</mp-button>
          <mp-button type="danger" link @click="onRemoveClick(i)">删除</mp-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { computed } from 'vue';
import { IShiftRowItem } from '../types';
import { ShiftItemClass } from './ShiftTimeSetupDialog/ShiftItemClass';

const props = defineProps<{
  ShiftTimeList: IShiftRowItem[]
}>();

const emit = defineEmits(['edit', 'remove']);

const tableList = computed(() => ShiftItemClass.getShiftTimeContentList(props.ShiftTimeList));

const onEditClick = (index: number) => {
  emit('edit', index);
};

const onRemoveClick = (index: number) => {
  MpMessage.warn({
    title: '确定删除该条记录吗？',
    msg: `正在删除第 [ ${index + 1} ] 条数据`,
    onOk: () => {
      emit('remove', index);
    },
  });
};

</script>

<style scoped lang='scss'>
.list {
  border-collapse: collapse;
  border: 1px solid #DCDFE6;
  border-bottom: none;
  tr {
    height: 40px;
    transition: background-color 0.1s ease-in-out;
    &:hover {
      background-color: lighten($color: #26bcf9, $amount: 42);
    }
    td {
      border-bottom: 1px solid #DCDFE6;
      line-height: 20px;
      padding: 10px;
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      button {
        font-size: inherit;
      }
    }
  }
}
.label {
  min-width: 220px;
  max-width: 400px;
}
.content {
  min-width: 200px;
  max-width: 400px;
}
.btns {
  width: 120px;
  text-align: center;
  padding-right: 20px;
}
</style>
