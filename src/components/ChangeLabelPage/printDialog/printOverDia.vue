<template>
  <div class="print-over-box">
    <p>实际打包：<span>{{GetType(GetOrderInfo?.PrintInfo?.Type)}}</span></p>
    <div class="print-over-tip">
      <i class="iconfont icon-chenggong"></i> 已全部打印完毕！
    </div>
    <div class="add-package">
      <div class="add-package-num" v-if="GetAddPackageNum()">已追加<span>{{ GetAddPackageNum() }}</span>个包裹</div>
      <div class="add-package-btn"><span @click="addPackage()" type="primary" color="#3988FF">追加1个包裹</span></div>
      <div class="add-package-tip">注意：追加包裹时，包裹内的产品数量为0，代收金额也为0。</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { storeToRefs } from 'pinia';

const props = withDefaults(defineProps<{
  GetType:(type: number) => string,
}>(), {
  GetType: () => '',
});
const ChangeLabelStore = useChangeLabelStore();
const { PrintPrintData, GetOrderInfo } = storeToRefs(ChangeLabelStore);

const addPackage = () => {
  PrintPrintData.value.Type = 255;
  ChangeLabelStore.getPrintExpressPrint();
};
const GetAddPackageNum = () => {
  const msg = 0;
  // 没有数量则为追加
  const addPackageList = GetOrderInfo.value?.PrintInfo?.Packages.filter(it => it.Number === 0) || [];
  return addPackageList.length || msg;
};
const GetType = (type) => props.GetType(type);
</script>
<style lang="scss">
.print-over-box{
  // padding: 0 30px;
  color: #888888;
  >p{
    padding-left: 240px;
    margin-top: 20px;
    font-size: 22px;
    line-height: 45px;
    span{
      color: #444;
      font-size: 35px;
      font-weight: 700;
    }
  }
  .print-over-tip{
    color: #52C41A;
    font-weight: 700;
    font-size: 40px;
    line-height: 55px;
    margin-top: 30px;
    display: flex;
    justify-content: center;
    i{
      margin-right: 16px;
      font-size: 40px;
    }
  }
  .add-package{
    display: flex;
    flex-direction: column;
    align-items: center;
    .add-package-num{
      margin-top: 38px;
      font-size: 20px;
      color: #888;
      >span{
        font-size: 26px;
        font-weight: 700;
        color: #FF0000;
        margin: 0 5px;
      }
    }
    .add-package-btn{
      margin-top: 10px;
      span{
        display: inline-block;
        width: 240px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
        color: #fff;
        border-radius: 5px;
        background-color: #3988FF;
        font-size: 30px;
        &:hover{
          background-color: #79bbff;
        }
      }
    }
    .add-package-tip{
      color: #2874E5;
      font-size: 20px;
      color: #2874E5;
      line-height: 28px;
      padding: 15px 0 30px 0;
    }
  }
}
</style>
