<template>
  <div class="pack-page-comp">
    <button @click="print">打印</button>
  </div>
</template>
<script setup lang="ts">
import lodopPrint from '@/assets/js/lodopPrint/index';
import {
  reactive, computed, watch,
} from 'vue';

const print = () => {
  [{ PackageID: '111111' },
    // { PackageID: '222222' },
    // { PackageID: '333333' },
  ].forEach(it => {
    lodopPrint(it);
  });
};
</script>
<style lang="scss" scoped>
  .pack-page-comp{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 201;
  }
</style>
