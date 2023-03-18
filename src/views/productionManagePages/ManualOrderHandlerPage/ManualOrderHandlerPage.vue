<template>
  <section class="page-wrap" v-if="ManualOrderHandlerPageData">
    <Header :step="ManualOrderHandlerPageData.curStep" :stepList="ManualOrderHandlerPageData.stepList" />
    <main>
      <!-- 第一步：填写订单信息 -->
      <FirstStepPanel v-if="(ManualOrderHandlerPageData.curStep === PlaceStepEnum.First)" />
      <!-- 第二步：设置生产工序 -->
      <SecondStepPanel v-if="(ManualOrderHandlerPageData.curStep === PlaceStepEnum.Second)" />
      <!-- 第三步：展示配置信息及价格设置 -->
      <ThirdStepPanel v-if="(ManualOrderHandlerPageData.curStep === PlaceStepEnum.Third)" />
      <!-- 第四步：下单成功 -->
      <FourthStepPanel v-if="(ManualOrderHandlerPageData.curStep === PlaceStepEnum.Fourth)" />

      <!-- 文件上传组件 -->
      <UploadFilesDialog v-model:visible="visible" @uploaded="onUploaded" />
    </main>
    <Footer :step="ManualOrderHandlerPageData.curStep" :stepList="ManualOrderHandlerPageData.stepList" @prev="onPrevClick" @next="onNextClick" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import Header from './Comps/Header.vue';
import FirstStepPanel from './Comps/Main/FirstStepPanel.vue';
import SecondStepPanel from './Comps/Main/SecondStepPanel.vue';
import ThirdStepPanel from './Comps/Main/ThirdStepPanel.vue';
import FourthStepPanel from './Comps/Main/FourthStepPanel.vue';
import UploadFilesDialog from './Comps/Main/UploadFilesComp/UploadFilesDialog.vue';
import Footer from './Comps/Footer.vue';
import { ManualOrderHandlerPageClass } from './js/ManualOrderHandlerPageClass';
/** 引入页面数据 */
import { ManualOrderHandlerPageData } from './js';
import { PlaceStepEnum } from './js/enums';

const onPrevClick = () => { // 上一步
  if (ManualOrderHandlerPageData.value) ManualOrderHandlerPageData.value.onPrevClick();
};

const visible = ref(false);

const onNextClick = () => { // 下一步
  if (ManualOrderHandlerPageData.value) {
    if (ManualOrderHandlerPageData.value.curStep === PlaceStepEnum.Third) {
      const result = ManualOrderHandlerPageData.value.CreateOrderInfo.validateThirdSep();
      if (!result) return;
      MpMessage.warn({
        title: '订单将被提交',
        msg: '确定继续下一步吗？',
        onOk: () => {
          if (ManualOrderHandlerPageData.value) {
            visible.value = true;
          }
        },
      });
    } else {
      ManualOrderHandlerPageData.value.onNextClick();
    }
  }
};

const onUploaded = () => {
  if (ManualOrderHandlerPageData.value) {
    const cb = () => {
      visible.value = false;
    };
    ManualOrderHandlerPageData.value.onNextClick(cb);
  }
};

onMounted(() => {
  ManualOrderHandlerPageData.value = new ManualOrderHandlerPageClass();
});

onUnmounted(() => {
  ManualOrderHandlerPageData.value = null;
});

</script>

<script lang="ts">
export default {
  name: 'ManualOrderHandlerPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    flex: none;
    padding: 20px 0;
  }
  > main {
    flex: 1;
    overflow: auto;
    overflow: overlay;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    --el-border-radius-base: 2px;
    --el-border-color: #e5e5e5;
    :deep(.el-input) {
      height: 30px;
      .el-input__wrapper {
        line-height: 30px;
        input {
          line-height: 30px;
        }
      }
    }
    :deep(.el-radio) {
      height: 30px;
      .el-radio__label {
        color: #000;
      }
    }
    :deep(.el-checkbox) {
      height: 30px;
      line-height: 30px;
    }
  }
  > footer {
    flex: none;
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #d4d4d4;
    :deep(.mp-button) {
      width: 120px;
      height: 35px;
      & + .mp-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
