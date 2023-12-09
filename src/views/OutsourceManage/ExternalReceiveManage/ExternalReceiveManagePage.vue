<template>
  <section class="page-wrap">
    <div class="input-box">
      <h2 :class="{'is-pink': !isInstored}">外协加工{{ isInstored ? '入库' : '出库' }}</h2>
      <div class="search">
        <span class="title">外协任务ID：</span>
        <el-input class="input" v-model.trim="inputValue" maxlength="10" :class="{pink: !isInstored}" @keydown.enter="search" ref="oInp"></el-input>
        <mp-button class="button" :type="isInstored ? 'primary' : 'danger'" @click="search"><el-icon><Search /></el-icon></mp-button>
      </div>
    </div>
    <HandleResultDialog v-model:visible="visible" :result="localExternalReportHandleClass.result" :isInstored="isInstored"
     @submit="confirm" @setQuestion="setQuestion" @close="setFocus"/>
  </section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HandleResultDialog from './Comps/HandleResultDialog/HandleResultDialog.vue';
import { ExternalReportHandleClass } from './js/ExternalReportHandleClass';

const route = useRoute();

const inputValue = ref('');
const visible = ref(false);
const oInp = ref<InstanceType<typeof HTMLInputElement>>();
const localExternalReportHandleClass = ref(new ExternalReportHandleClass(route.params.type === 'Instored'));

/** 是否为外协加工入库，否则为出库 */
const isInstored = computed(() => localExternalReportHandleClass.value.isInstored);

const setFocus = () => {
  if (oInp.value) oInp.value.focus();
};

const search = async (e: MouseEvent) => {
  // 0. 令触发事件的dom失去焦点
  if (e.target) {
    (e.target as HTMLElement).blur();
  }

  // 1. 校验输入内容是否合法

  // 2. 调用接口获取响应结果

  // 3. 打开弹窗 根据响应结果展示不同内容

  const bool = await localExternalReportHandleClass.value.search(inputValue.value, setFocus);

  if (bool) {
    visible.value = true;
    inputValue.value = '';
  }
};

const confirm = () => {
  const cb = () => {
    visible.value = false;
    setFocus();
  };
  localExternalReportHandleClass.value.confirm(cb);
};

const setQuestion = (remark: string) => {
  const cb = () => {
    visible.value = false;
    setFocus();
  };
  localExternalReportHandleClass.value.setQuestion(cb, remark);
};

onMounted(() => {
  if (!isInstored.value) {
    document.title = '外协出库 - 凌顶揽众生产管理系统';
  }
});

</script>

<script lang="ts">
export default {
  name: 'ExternalReceiveManagePage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .input-box {
    padding-bottom: 10vh;
    > h2 {
      font-size: 30px;
      margin-bottom: 80px;
      text-align: center;
      &:not(.is-pink) {
        color: #444;
      }
    }

    > .search {
      display: flex;
      align-items: center;
      font-weight: 700;
      font-size: 19px;
      --el-component-size: 44px;
      --el-border-radius-base: 2px;
      --el-text-color-regular: #000;

      .title {
        color: var(--el-text-color-regular);
      }

      .input {
        width: 338px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-right: -1px;
        font-size: 19px;

        &.pink {
          --el-input-focus-border-color: #ff3769;
        }
      }

      .button {
        width: 70px;
        height: 44px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        z-index: 2;
        font-size: 30px;
      }
    }

  }
}
</style>
