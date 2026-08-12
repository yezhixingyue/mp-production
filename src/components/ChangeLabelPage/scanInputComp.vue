<template>
  <div class="scan-input-comp">
    <el-input
      v-model="scanValue"
      placeholder=""
      @keyup.enter="submit"
    >
      <template #prepend>
        <span class="iconfont icon-saomiao"></span>
      </template>
      <template #append>
        <div @click="submit">{{submitText}}</div>
      </template>
    </el-input>
  </div>
</template>
<script setup lang="ts">
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import {
  computed,
} from 'vue';

withDefaults(defineProps<{
  submitText?: string,
}>(), {
  submitText: '确定',
});

const emit = defineEmits(['submit']);
const ChangeLabelStore = useChangeLabelStore();
const scanValue = computed({
  get() {
    return ChangeLabelStore.scanInputValue;
  },
  set(val) {
    ChangeLabelStore.setScanInputValue(val.replace(/[^0-9-]+/g, ''));
  },
});

const submit = () => {
  emit('submit');
};
</script>
<style lang="scss">
  .scan-input-comp{
    // width: 100vw;
    height: 130px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    .el-input{
      width: 995px;
      height: 70px;
      border: 2px solid #CBCBCB;
      border-radius: 10px;
      position: relative;
      .el-input-group__prepend{
        width: 100px;
        background-color: #fff;
        box-shadow: none;
        border-radius: 10px;
        padding: 0;
        .iconfont{
          font-size: 30px;
          color: #3988FF;
        }
        &::after{
          content: '';
          display: inline-block;
          width: 2px;
          height: 26px;
          background-color: #CBCBCB;
          position: absolute;
          right: 0;
          top: 20px;
        }
      }
      .el-input__wrapper{
        box-shadow: none;
        padding-left: 30px;
        font-size: 30px;
        .el-input__inner{
          height: 60px;
        }
      }
      .el-input-group__append{
        width: 206px;
        background-color: #fff;
        box-shadow: none;
        font-size: 30px;
        padding: 0;
        >div{
          width: 100%;
          height: 70px;
          line-height: 70px;
          color: #fff;
          cursor: pointer;
          text-align: center;
          border-radius: 4px;
          background-color: #3988FF;
          position: absolute;
          top: -2px;
          right: -2px;
        }
      }
    }
  }
</style>
