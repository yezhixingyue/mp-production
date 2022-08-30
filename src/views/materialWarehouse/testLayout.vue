<!-- 侧边栏 -->
<template>
  <!-- <div class="mp-erp-layout-side-bar-comp-wrap">
    测试组件<br>
    <input type="text" v-model="a">
    <br>
  </div> -->
    <el-button @click="goback">返回</el-button>
  <TopMiddleBottomConstruction>
    a
    <template v-slot:header>
    <div>header</div>
    </template>
    <template v-slot:main>
      <div>main</div>
    </template>
    <template v-slot:footer>
    <div>footer</div>
    </template>
  </TopMiddleBottomConstruction>
</template>

<script lang='ts'>
import { ref } from 'vue';
import ccc from '@/router';
import { useUserStore } from '@/store/modules/user';
import TopMiddleBottomConstruction from '@/components/common/TopMiddleBottomConstruction.vue';

export default {
  name: 'testLayoutPage',
  components: {
    TopMiddleBottomConstruction,
  },
  setup() {
    const a = ref('');
    const userStore = useUserStore();
    console.log(userStore);

    function goback() {
      // eslint-disable-next-line import/no-named-as-default-member
      ccc.getGoBackFun();
    }
    return {
      goback,
      a,
    };
  },
};
</script>
<style lang='scss'>
</style>
