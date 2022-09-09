<template>
  <div>
    物料分类管理列表页面
    <el-select v-model="value" filterable placeholder="Select"
    no-data-text="无数据">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue';

export default {
  name: 'materialClassifyManagePage',
  setup() {
    const value = ref('');
    const options = [
      {
        value: 'Option1',
        label: 'Option1',
      },
      {
        value: 'Option2',
        label: 'Option2',
      },
      {
        value: 'Option3',
        label: 'Option3',
      },
      {
        value: 'Option4',
        label: 'Option4',
      },
      {
        value: 'Option5',
        label: 'Option5',
      },
    ];
    return {
      value,
      options,
    };
  },
};
</script>
<style lang='scss'>
</style>
