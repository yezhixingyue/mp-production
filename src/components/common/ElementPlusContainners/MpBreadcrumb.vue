<template>
  <el-breadcrumb :separator-icon="ArrowRight" class="mp-breadcrumb">
    <el-breadcrumb-item
      v-for="it in props.list"
      :key="it.name"
      :to="it.to"
      :replace="typeof it.replace === 'boolean' ? it.replace : true"
      >
      {{it.name}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang='ts'>
import { ArrowRight } from '@element-plus/icons-vue';
import { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  list: { to?: RouteLocationRaw, name: string, replace?: boolean }[]
}>();

</script>

<style lang='scss'>
.mp-breadcrumb {
  .el-breadcrumb__item {
    font-size: 12px;
    line-height: 16px;
    .el-breadcrumb__inner {
      color: #444 !important;
      font-weight: 700 !important;
      font-size: 13px;
      &.is-link {
        color: #26BCF9 !important;
        font-weight: 400 !important;
        font-size: 12px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .el-icon.el-breadcrumb__separator {
      font-size: 13px;
      position: relative;
      top: -0.5px;
    }
    &:nth-last-child(2) {
      .el-icon.el-breadcrumb__separator {
        color: #444;
      }
    }
  }
}
</style>
