<template>
  <section class="reprint-wrap">
    <header>补打出货标签</header>
    <main>
      <!-- 搜索输入框 -->
      <SearchBox ref="oSearchBox" v-model="localData.keywords" @search="onSearchClick" />

      <!-- 显示区域 -->
      <div class="area" v-if="localData.result.code">
        <h2 class="code">{{ localData.result.code }}</h2>

        <ul v-if="localData.result.data">
          <li>
            <span>客户编号：</span>
            <span>{{ localData.result.data.OrderInfo.CustomerSN }}</span>
          </li>
          <li>
            <span>客户名称：</span>
            <span>{{ localData.result.data.OrderInfo.CustomerName }}</span>
          </li>
          <li>
            <span>文件内容：</span>
            <span>{{ localData.result.data.OrderInfo.Content }}</span>
          </li>
          <li>
            <span>产品名称：</span>
            <span>{{ localData.result.data.OrderInfo.ProductName }}</span>
          </li>
          <li>
            <span>数量款数：</span>
            <h4>{{ localData.result.data.OrderInfo.Number }}{{ localData.result.data.OrderInfo.Unit }}{{ localData.result.data.OrderInfo.KindCount }}款</h4>
          </li>
        </ul>

        <div class="print">
          <el-input v-model="localData.result.count" ref="oInput" placeholder="请输入补打张数" maxlength="3" @keyup.enter="onPrint" size="large"></el-input>
          <mp-button class="btn" @click="onPrint" type="primary" size="large">
            <i class="iconfont icon-dayin mr-2"></i>
            <span>打印</span>
          </mp-button>
        </div>
      </div>

      <!-- 打印组件 -->
      <PrintDialog :result="localData.result" ref="oPrintDialog" />
    </main>
  </section>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { InputInstance } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import SearchBox from './components/SearchBox.vue';
import PrintDialog from './components/PrintDialog.vue';
import { ManageTagRePrintClass } from './js/ManageTagRePrintClass';

const localData = ref(new ManageTagRePrintClass());

const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();

const oSearchBox = ref<InstanceType<typeof SearchBox>>();

const oInput = ref<InputInstance>();

const onSearchClick = async (oElInput) => {
  await localData.value.search(oElInput);

  await nextTick();

  oInput.value?.focus();
};

const onPrint = async () => {
  if (!oPrintDialog.value || !localData.value.validatePrint()) return;

  if (!/^\d+$/.test(localData.value.result.count) || !(Number(localData.value.result.count) > 0)) {
    MpMessage.error('打印失败', '补打数量输入不正确');
    return;
  }

  localData.value.result.QRCodeSrc = (await getQRCodeSrc(localData.value.result.code, 130)) || '';

  oPrintDialog.value.print();

  oSearchBox.value?.setFocus();
};

onMounted(() => {
  oSearchBox.value?.setFocus();
});
</script>

<script lang="ts">
export default {
  name: 'TagRePrintPage',
};
</script>

<style scoped lang='scss'>
.reprint-wrap {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;

  > header {
    flex: none;
    height: 75px;
    background: #E9F8FE;
    text-align: center;
    font-weight: 700;
    font-size: 20px;
    color: #000;
    line-height: 75px;
  }
  > main {
    width: 472px;
    margin: 60px auto 0;
    flex: 0 1 auto;
    // overflow: hidden;

    .area {
      .code {
        color: #FF3E6A;
        font-size: 41px;
        letter-spacing: 2px;
        margin-top: 16px;
        white-space: nowrap;
      }

      > ul {
        padding-top: 14px;
        li {
          color: #444;
          font-size: 14px;
          padding: 10px 0;
          line-height: 18px;

          display: flex;

          h4 {
            font-size: 22px;
          }

          > span:first-of-type {
            flex: none;
          }
        }
      }

      .print {
        margin: 40px auto 0;
        width: 260px;

        display: flex;
        --el-border-radius-base: 0;

        * {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
