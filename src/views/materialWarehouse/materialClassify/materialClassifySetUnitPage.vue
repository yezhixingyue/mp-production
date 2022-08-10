<!--  -->
<template>
  <div>
   物料分类 - 出入库单位
   <input type="text" v-model="bbb">
   <button @click="toTest">测试</button>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'materialClassifySetUnitPage',
  components: {
  },
  setup() {
    const router = useRouter();
    const bbb = ref('');
    function toTest() {
      router.push('/testLayout');
    }
    return {
      bbb,
      toTest,
    };
  },
};
</script>
<style lang='scss'>
</style>
