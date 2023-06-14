<!--  -->
<template>
  <section class="mp-erp-home-page-wrap">
    <header>
      <svg t="1619572986782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8184" width="32" height="32">
        <path d="M849.92 51.2H174.08C106.24 51.2 51.2 102.72 51.2 166.528v690.944c0 63.68 54.848 115.328 122.88 115.328h675.84c67.84 0 122.88-51.52
         122.88-115.328V166.528C972.8 102.848 917.952 51.2 849.92 51.2z"
         fill="#428dfa" p-id="8185" data-spm-anchor-id="a313x.7781069.0.i11" class="selected"></path>
         <path d="M538.496 497.28H290.304V292.544H219.52v477.76h70.848v-204.8h248.192v204.8h70.912V292.48H538.496zM715.776
          477.696h70.912v292.608h-70.912V477.696zM715.776 292.544h70.912v102.4h-70.912v-102.4z"
          fill="#ffffff" p-id="8186" data-spm-anchor-id="a313x.7781069.0.i8" class="selected"></path>
      </svg>
      <span>你好，</span>
      <span>欢迎使用凌顶揽众生产管理系统</span>
      <span v-if="dateString">，今天是{{dateString}}，{{weekString}}</span>
      <span>，开始今天的工作吧！</span>
      <!-- <i>!</i> -->
    </header>
  </section>
</template>

<script lang='ts'>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    // console.log('setup');
    const dateString = ref('');
    const weekString = ref('');
    const weekTextList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    function getCurDate() {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const w = date.getDay();
      dateString.value = `${year}年${month}月${day}日`;
      weekString.value = weekTextList[w];
    }
    const router = useRouter();

    onMounted(() => {
      getCurDate();
      if (process.env.VUE_APP_TARGET === 'My Order App') { // 跳转页面
        router.replace('/orderAppRoutes');
      }
    });
    return {
      dateString,
      weekString,
      weekTextList,
    };
  },
};
</script>
<style lang='scss' scoped>
.mp-erp-home-page-wrap {
  // width: calc(100vw - 180px);
  > header {
    display: flex;
    align-items: center;
    padding: 10px 30px;
    white-space: nowrap;
    > svg {
      margin-right: 10px;
    }
    > span {
      font-size: 14px;
      color: #585858;
    }
    > i {
      margin-left: 6px;
      font-size: 16px;
      font-weight: 700;
    }
  }
}
</style>
