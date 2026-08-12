<template>
  <div class="orther-pack">
    <p>其他打包方式（请先选择）：</p>
    <div>
      <p style="display: flex;">
        <el-radio v-model="PrintPrintData.Type" :label="2" @click="changeType(2)">均打包</el-radio>
        <template v-if="PrintPrintData.Type === 2">
          <el-input v-model="inputValue"></el-input>
          <span>包</span>
          <el-button @click="getPrintExpressPrint()"> <i class="iconfont icon-dayinji"></i> 打印标签</el-button>
        </template>
      </p>
      <p style="display: flex;">
        <el-radio v-model="PrintPrintData.Type" :label="3" @click="changeType(3)">自定义打包</el-radio>
        <template v-if="PrintPrintData.Type === 3">
          <el-input v-model="inputValue" style="width: 100px;"></el-input>
          <i class="iconfont icon-jurassic_warn warn-tip">注意后面单位</i>
          <span style="color: #3988FF;white-space: nowrap;">{{useUnitGetUnit(GetOrderInfo?.Unit||'')}}</span>
          打<span v-if="!isSetPrintCount" @dblclick="dblclick"
          style="width: 50px;text-align: center;display: inline-block;user-select: none;">{{ PrintCount }}</span>
          <el-input v-else v-model="PrintCount" style="width: 50px; margin: 0 10px;" @blur="isSetPrintCount = false" ref="PrintCountInput"></el-input>个标签
          <el-button @click="getPrintExpressPrint()"> <i class="iconfont icon-dayinji"></i> 打印标签</el-button>
        </template>
      </p>
    </div>
    <div class="close-box">
      <el-button @click="close">关闭</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { storeToRefs } from 'pinia';
import { ElInput } from 'element-plus';
import { useUnitGetUnit } from '@/assets/js/utils';
import { computed, ref } from 'vue';

const emit = defineEmits(['closeDialog']);
const ChangeLabelStore = useChangeLabelStore();
const { PrintPrintData, GetOrderInfo, printSettingNumber } = storeToRefs(ChangeLabelStore);
const PrintCountInput = ref<InstanceType<typeof ElInput>>();
const isSetPrintCount = ref(false);

const inputValue = computed({
  get() {
    return PrintPrintData.value.Number;
  },
  set(val) {
    PrintPrintData.value.Number = val.replace(/[^0-9]+/g, '');
  },
});

const PrintCount = computed({
  get() {
    return String(PrintPrintData.value.PrintCount);
  },
  set(val) {
    PrintPrintData.value.PrintCount = Number(val.replace(/[^0-9]+/g, ''));
  },
});
const changeType = (Type) => {
  PrintPrintData.value.Type = Type;
  inputValue.value = '';
  switch (Type) { // 用于父组件调取
    case 0:
      ChangeLabelStore.getPrintExpressPrint();
      break;
    case 1:
      PrintPrintData.value.PrintCount = GetOrderInfo.value?.KindCount || 0;
      ChangeLabelStore.getPrintExpressPrint();
      break;
    case 3:
      PrintPrintData.value.PrintCount = 1;
      break;
    default:
      break;
  }
};
const getPrintExpressPrint = () => {
  if (!Number(PrintPrintData.value.Number) && PrintPrintData.value.Type === 2) {
    MpMessage.error('操作失败', '请输入均打包包数');
    return;
  }
  if (!Number(PrintPrintData.value.Number) && PrintPrintData.value.Type === 3) {
    MpMessage.error('操作失败', `请输入自定义打包${useUnitGetUnit(GetOrderInfo.value?.Unit || '')}数`);
    return;
  }
  if (((PrintPrintData.value.PrintCount > printSettingNumber.value)) && PrintPrintData.value.Type === 3) {
    MpMessage.error('操作失败', `请输入小于${printSettingNumber.value + 1}的标签数量`);
    return;
  }
  if (!PrintPrintData.value.PrintCount && PrintPrintData.value.Type === 3) {
    MpMessage.error('操作失败', '请输入标签数量');
    return;
  }
  if ((Number(PrintPrintData.value.Number) * PrintPrintData.value.PrintCount
  > ((GetOrderInfo.value?.Number || 1) * (GetOrderInfo.value?.KindCount || 1)))
  && PrintPrintData.value.Type === 3) {
    MpMessage.error('操作失败', '请输入小于未打包数量的包内产品数量');
    return;
  }
  ChangeLabelStore.getPrintExpressPrint();
};
const close = () => {
  emit('closeDialog');
};
const dblclick = () => {
  isSetPrintCount.value = true;
  setTimeout(() => {
    PrintCountInput.value?.focus();
  }, 10);
};
defineExpose({ changeType });
</script>
<style lang="scss">
.orther-pack{
  padding: 0 140px;
  padding-right: 40px;
  >p{
    font-size: 22px;
    color: #888;
    line-height: 28px;
    margin-top: 30px;
  }
  >div{
    >p{
      height: 50px;
      margin-top: 28px;
      font-size: 24px;
      line-height: 50px;
      position: relative;
      .warn-tip{
        position: absolute;
        bottom: -23px;
        left: 242px;
        line-height: 18px;
        font-size: 14px;
        color: #FF0000;
      }
      .el-radio{
        height: 50px;
        line-height: 50px;
        margin: 0;
        .el-radio__input.is-checked{
          .el-radio__inner{
            border: 8px solid #3988FF;
          }
        }
        .el-radio__input.is-checked{
          .el-radio__inner{
            &::after{
              width: 0;
              height: 0;
            }
          }
        }
        .el-radio__input, .el-radio__inner{
          width: 25px;
          height: 25px;
        }
        .el-radio__label{
          font-size: 30px;
          color: #444;
          width: 217px;
          padding-left: 27px;
          box-sizing: border-box;
        }
      }
      .el-input{
        width: 180px;
        font-size: 26px;
      }
      >span{
        margin: 0 10px;
      }
      >.el-button{
        width: 180px;
        height: 50px;
        font-size: 28px;
        color: #fff;
        background-color: #3988FF;
        margin-left: 50px;
        i{
          color: #fff;
          font-size: 28px;
        }
      }
    }
  }
  .close-box{
    height: 60px;
    margin-top: 99px;
    padding-bottom: 50px;
    text-align: center;
    >.el-button{
      width: 220px;
      height: 60px;
      border-color: #3988FF;
      color: #3988FF;
      font-size: 30px;
    }
  }
}
</style>
