<template>
  <section class="page-wrap">
    <div class="input-box">
      <h2>外协加工入库</h2>
      <div class="search">
        <span class="title">ID：</span>
        <el-input class="input" v-model.trim="inputValue" maxlength="10" @keydown.enter="search" ref="oInp"></el-input>
        <mp-button class="button" type="primary" @click="search"><el-icon><Search /></el-icon></mp-button>
      </div>
    </div>
    <HandleResultDialog v-model:visible="visible" :result="localExternalReportHandleClass.result"
     @submit="confirm" @setQuestion="setQuestion" @close="setFocus"/>
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import HandleResultDialog from './Comps/HandleResultDialog/HandleResultDialog.vue';
import { ExternalReportHandleClass } from './js/ExternalReportHandleClass';

const inputValue = ref('');
const visible = ref(false);
const oInp = ref<InstanceType<typeof HTMLInputElement>>();
const localExternalReportHandleClass = new ExternalReportHandleClass();

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

  const bool = await localExternalReportHandleClass.search(inputValue.value, setFocus);

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
  localExternalReportHandleClass.confirm(cb);
};

const setQuestion = (remark: string) => {
  const cb = () => {
    visible.value = false;
    setFocus();
  };
  localExternalReportHandleClass.setQuestion(cb, remark);
};

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
      color: #444;
      font-size: 30px;
      margin-bottom: 80px;
      text-align: center;
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
