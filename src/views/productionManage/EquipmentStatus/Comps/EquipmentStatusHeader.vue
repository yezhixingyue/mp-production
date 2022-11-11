<template>
  <header class="header">
    <!-- 类别 -->
    <div class="menu">
      <span v-for="it in props.classList" :key="it.ID" :class="{active:it.ID===props.modelValue}" @click="onClick(it)">{{it.Name}}</span>
    </div>

    <!-- 图例 -->
    <div class="legend">
      <h4>图例</h4>
      <!-- 设备状态图例 -->
      <div>
        <span v-for="it in EquipmentStatusEnumList" :key="it.ID">
          <i :style="`background-color:${it.Color}`"></i> {{it.Name}}
        </span>
      </div>
      <!-- 任务状态图例 -->
      <div class="task">
        <span v-for="it in EquipmentTaskStatusEnumList" :key="it.ID">
          <i :style="`background-color:${it.Color}`"></i> {{it.Name}}
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang='ts'>
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { EquipmentStatusEnumList, EquipmentTaskStatusEnumList } from '../js/EnumList';

const props = defineProps<{
  modelValue: number | ''
  classList: EquipmentClassificationListItem[]
}>();

const emit = defineEmits(['update:modelValue']);

const onClick = (it: EquipmentClassificationListItem) => {
  if (it.ID === props.modelValue) return;
  emit('update:modelValue', it.ID);
};

</script>

<style scoped lang='scss'>
.header {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 20px;
  box-sizing: border-box;
  padding-top: 0;
  .menu {
    flex: none;
    white-space: wrap;
    max-width: 100%;
    margin-right: 43px;
    margin-top: 15px;
    > span {
      display: inline-block;
      line-height: 28px;
      padding: 0 17px;
      box-shadow: 0 0 0 1px #e8e8e8;
      cursor: pointer;
      background-color: #f5f5f5;
      color: #444;
      transition: 0.15s ease-in-out;
      position: relative;
      &:hover {
        background-color: #eee;
      }
      &.active {
        color: #26bcf9;
        background-color: #fff;
        box-shadow: 0 0 0 1px #26bcf9;
        z-index: 2;
      }
    }
  }
  .legend {
    flex: 1;
    display: flex;
    white-space: nowrap;
    // justify-content: flex-end;
    margin-top: 15px;
    line-height: 28px;
    padding-right: 20px;
    // overflow: hidden;
    // width: 1200px;
    h4 {
      margin-right: 20px;
    }
    > div {
      max-width: 350px;
      display: flex;
      flex: 1;
      justify-content: space-between;
      > span {
        i {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          vertical-align: -2px;
          margin-right: 4px;
        }
        // margin-right: 25px;
      }
      &.task {
        padding-left: 70px;
        max-width: 570px;
        > span {
          i {
            width: 56px;
            border-radius: 0;
            height: 7px;
            vertical-align: 1px;
            margin-right: 6px;
          }
          // margin-right: 50px;
          // &:nth-of-type(3) {
          //   margin-right: 36px;
          // }
          // &:last-of-type {
          //   margin-right: 0;
          // }
        }
      }
    }
  }
}
</style>
