<template>
  <ul class="step-wrap">
    <li v-for="it in localStepList" :key="it.ID" :class="{active: it.active, completed: it.completed}">
      <span class="index">
        <template v-if="!it.completed">{{it.ID}}</template>
        <el-icon v-else><Select /></el-icon>
      </span>
      <span class="label">{{it.Name}}</span>
      <hr />
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps<{
  step: number | string
  stepList: { ID: number | string, Name: string }[]
}>();

const localStepList = computed(() => props.stepList.map((it, i) => ({
  ...it,
  active: it.ID === props.step,
  completed: props.stepList.findIndex(_it => _it.ID === props.step) > i,
})));

</script>

<style scoped lang='scss'>
.step-wrap {
  display: flex;
  justify-content: center;
  height: 55px;
  font-size: 14px;
  background-color: rgba($color: #26BCF9, $alpha: 0.1);
  white-space: nowrap;
  > li {
    display: flex;
    align-items: center;
    .index {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      color: #d4d4d4;
      border: 1px solid #d4d4d4;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 6px;
      position: relative;
      top: -1px;
      user-select: none;
    }
    .label {
      font-weight: 700;
      color: #888;
    }
    hr {
      width: 195px;
      margin: 0 10px;
      border: none;
      border-top: 1px solid #D4D4D4;
    }
    &:last-of-type {
      hr {
        display: none;
      }
    }
    &.active {
      .index {
        color: #fff;
        background-color: #26BCF9;
        border-color: #26BCF9;
      }
      .label {
        color: #444;
      }
    }
    &.completed {
      .index {
        color: #fff;
        background-color: #52C41A;
        border-color: #52C41A;
      }
    }
  }
}
</style>
