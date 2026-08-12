<template>
  <div class="continue-print-box">
    <div class="print-type"><span>实际打包：</span>
      <div class="right">
        <p>{{GetType(GetOrderInfo?.PrintInfo?.Type)}}</p>
        <template v-if="GetOrderInfo?.PrintInfo?.Type === 1 || GetOrderInfo?.PrintInfo?.Type === 2">
          <div>已打印{{GetOrderInfo?.PrintInfo?.Packages.length}}个标签</div>
          <p>剩余
            <span v-if="GetOrderInfo?.PrintInfo?.Type === 1" style="color: #3988FF;">
              {{ GetOrderInfo?.KindCount - GetOrderInfo?.PrintInfo?.Packages.length }}
            </span>
            <span v-if="GetOrderInfo?.PrintInfo?.Type === 2" style="color: #3988FF;">
              {{  GetOrderInfo?.PrintInfo?.PackageNumber -  GetOrderInfo?.PrintInfo?.Packages.length }}
            </span>
            个标签未打印</p>
        </template>
      </div>
    </div>
    <div class="print-package">
      <span class="submit" @click="printPackage()">再打印 {{printSettingNumber < lastPrintNumber ? printSettingNumber : lastPrintNumber}} 个标签</span>
      <span class="close-button" @click="closeDialog()">关闭</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{
  GetType:(type: number) => string,
}>(), {
  GetType: () => '',
});
const emit = defineEmits(['closeDialog']);
const ChangeLabelStore = useChangeLabelStore();
const { PrintPrintData, GetOrderInfo, printSettingNumber } = storeToRefs(ChangeLabelStore);

const lastPrintNumber = computed(() => {
  if (GetOrderInfo.value?.PrintInfo?.Type === 1) {
    return GetOrderInfo.value.KindCount - GetOrderInfo.value.PrintInfo.Packages.length || 0;
  }
  if (GetOrderInfo.value?.PrintInfo?.Type === 2) {
    return GetOrderInfo.value.PrintInfo.PackageNumber - GetOrderInfo.value.PrintInfo.Packages.length;
  }
  return printSettingNumber.value;
});
const closeDialog = () => {
  emit('closeDialog');
};
const printPackage = () => {
  PrintPrintData.value.Type = GetOrderInfo.value?.PrintInfo?.Type || 0;
  ChangeLabelStore.getPrintExpressPrint();
};
const GetType = (type) => props.GetType(type);
</script>
<style lang="scss">
.continue-print-box{
  color: #888888;
  >.print-type{
    padding-left: 240px;
    margin-top: 20px;
    font-size: 22px;
    line-height: 45px;
    display: flex;
    >.right{
      color: #444;
      font-size: 35px;
      font-weight: 700;
      >div{
        color: #888;
        font-size: 30px;
        font-weight: 400;
        margin: 10px 0;
        line-height: 38px;
      }
    }
  }
  .print-package{
    display: flex;
    justify-content: center;
    margin-top: 90px;
    padding-bottom: 52px;
    >span{
      display: inline-block;
      height: 60px;
      line-height: 60px;
      font-size: 30px;
      text-align: center;
      color: #3988FF;
      +span{
        margin-left: 100px;
      }
    }
    .submit{
      width: 240px;
      cursor: pointer;
      color: #fff;
      border-radius: 5px;
      background-color: #3988FF;
      &:hover{
        background-color: #79bbff;
      }
    }
  }
}
</style>
