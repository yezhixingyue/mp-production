<template>
  <div class="cascader-by-area">
    <span class="cascader-by-area-label">区域：</span>
    <el-cascader
    class="show-line"
      v-model="value"
      :options="DistrictTreeList"
      :props="props"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useCommonStore } from '@/store/modules/common/index';
import { ref, onMounted } from 'vue';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);
const value = ref([]);

const props = {
  expandTrigger: 'hover',
  label: 'Name',
  value: 'Name',
  checkStrictly: true,
  // checkStrictly: true,
};

const handleChange = (value) => {
  console.log(DistrictTreeList, 'DistrictTreeList');

  console.log(value);
};

onMounted(() => {
  if (!commonStore.DistrictTreeList.length) {
    commonStore.getDistrictList();
  }
});
</script>

<style lang='scss'>
  @import "@/assets/css/var.scss";
  .cascader-by-area{
    .cascader-by-area-label{
      font-size: 14px;
      color: #2c3e50;
      font-weight: 600;
    }
    .el-cascader{
      width: 240px;
    }
    .show-line {
      border-radius: 0;
      .el-input__wrapper{
        box-shadow: 0px 1px 0px var(--el-input-border-color)!important;
        border-radius: 0;
      }
      .el-input__wrapper:hover {
        box-shadow: none;
        box-shadow: 0px 1px 0px var(--el-input-hover-border-color)!important;
      }
      &.el-cascader .el-input.is-focus .el-input__wrapper{
        box-shadow: 0px 1px 0px var(--el-input-focus-border-color) !important;
      }
      &.el-cascader .el-input__wrapper.is-focus{
        box-shadow: none !important;
        box-shadow: 0px 1px 0px var(--el-input-focus-border-color)!important;
      }
    }
  }
</style>
