<template>
  <!-- 有default和header -->
  <el-table-column v-bind="$attrs" class="mp-button" align="center" :show-overflow-tooltip="true" v-if="slotDefault&&slotHeader">
    <template #default="scope:any">
      <slot name="default" :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
    </template>
    <template #header="scope:any">
      <slot name="header" :column="scope.column" :$index="scope.$index"></slot>
    </template>
  </el-table-column>
  <!-- 只有default -->
  <el-table-column v-bind="$attrs" class="mp-button" align="center" :show-overflow-tooltip="true" v-else-if="slotDefault">
    <template #default="scope:any">
      <slot name="default" :row="scope.row" :column="scope.column" :$index="scope.$index"></slot>
    </template>
  </el-table-column>
  <!-- 只有header -->
  <el-table-column v-bind="$attrs" class="mp-button" align="center" :show-overflow-tooltip="true" v-else-if="slotHeader">
    <template #header="scope:any">
      <slot name="header" :column="scope.column" :$index="scope.$index"></slot>
    </template>
  </el-table-column>
  <!-- 没有default 和 header -->
  <el-table-column v-bind="$attrs" class="mp-button" align="center" :show-overflow-tooltip="true" v-else></el-table-column>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';

const slotDefault = !!useSlots().default; // 判断default是否有传值
const slotHeader = !!useSlots().header; // 判断header是否有传值
</script>
<style scoped lang="scss">
</style>
