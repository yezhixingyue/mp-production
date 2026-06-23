<template>
  <header class="change-label-header">
    <div class="tabs">
      <div class="tab" :class="{action: tabValue === 1}" @click="changeTab(1)">生产打包</div>
      <div class="tab" :class="{action: tabValue === 2}" @click="changeTab(2)">已打印订单</div>
    </div>
    <div class="user-info-box">
      <el-button link v-if="tabValue === 1" @click="printSettingClick"><i class="iconfont icon-dayinshezhi"></i> 打印设置</el-button>
      <span>当前登录账号：{{userStore.user?.StaffName}}（{{userStore.user?.Mobile}}）</span>
      <el-button link @click="logout"><i class="iconfont icon-tuichudenglu"></i> 退出登录</el-button>
    </div>
    <DialogContainerComp
      title="打印设置"
      :visible='printSettingVisible'
      :width="700"
      @submit="submit"
      @open="onOpen"
      @cancel="onCancel"
      autoClose
      primary-text="保存"
      class="pack-print-setting-dialog change-label-common-dialog"
    >
      <div class="pack-print-setting-content">
        <p class="title">一次最多打印标签数量:</p>
        <p class="input">
          <el-input v-model="_printSettingNumber"></el-input>张
        </p>
        <div>
          说明：
          <ul>
            <li>此数量控制“按款数打包”、“均打包”方式打包时，每次点击“打印标签”按钮， 最多可同时打印标签的数量。</li>
            <li>当剩余未打印数量小于此数量时，一次全部打印完毕；</li>
            <li>当剩余未打印数量大于此数量时，一次打印标签的数量按此处设置的数量。</li>
          </ul>
        </div>
      </div>
    </DialogContainerComp>
  </header>
</template>
<script setup lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useChangeLabelStore } from '@/store/modules/ChangeLabelPage/index';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import {
  ref,
} from 'vue';
/*
* tabValue: 1生产打包；2已打印订单
*/
const props = withDefaults(defineProps<{
  tabValue: number,
}>(), {
  tabValue: 1,
});

const emit = defineEmits(['changeTabValue']);

const router = useRouter();
const userStore = useUserStore();
const ChangeLabelStore = useChangeLabelStore();
const printSettingVisible = ref(false);
const _printSettingNumber = ref(0);
const changeTab = (val) => {
  if (props.tabValue === val) return;
  emit('changeTabValue', val);
};
const printSettingClick = () => {
  printSettingVisible.value = true;
};
const onOpen = () => {
  _printSettingNumber.value = ChangeLabelStore.printSettingNumber;
};
const onCancel = () => {
  printSettingVisible.value = false;
};
const submit = () => {
  printSettingVisible.value = false;
  ChangeLabelStore.setPrintSettingNumber(_printSettingNumber.value);
};
const logout = () => {
  MpMessage.warn('确定退出登录吗 ?', '', () => {
    userStore.token = '';
    router.replace({ path: '/login', query: { backUrl: '/pack' } });
  });
};
</script>
<style lang="scss">
  .change-label-header{
    // width: 100vw;
    height: 80px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #CBCBCB;
    padding: 0 60px 0 70px;
    box-sizing: border-box;
    >.tabs{
      display: flex;
      .tab{
        font-size: 24px;
        line-height: 38px;
        padding-top: 10px;
        position: relative;
        cursor: pointer;
        transition: all .1s;
        &+.tab{
          margin-left: 70px;
        }
        &.action{
          font-size: 30px;
          font-weight: 700;
          &::after{
            content: '';
            display: inline-block;
            width: 100%;
            height: 5px;
            background: #3988FF;
            box-shadow: 0px 4px 6px 1px rgba(57,136,255,0.2);
            border-radius: 3px 3px 3px 3px;
            position: absolute;
            bottom: -15px;
            left: 0;
          }
        }
      }
    }
    .user-info-box{
      font-size: 22px;
      >.el-button{
        font-size: 22px;
        margin-left: 65px;
        i{
          color: #3988FF;
          margin-right: 10px;
          font-size: 22px;
        }
      }
      >span{
        font-size: 22px;
        color: #444444;
        margin-left: 65px;
      }
    }
    .pack-print-setting-dialog{
      .el-dialog__body{
        padding: 0;
        .pack-print-setting-content{
          >p{
            text-align: center;
            &.title{
              font-size: 28px;
              margin-top: 20px;
            }
            &.input{
              line-height: 44px;
              font-size: 24px;
              margin-top: 15px;
              .el-input{
                width: 150px;
                height: 44px;
                font-size: 32px;
                margin-right: 10px;
                .el-input__inner{

                  text-align: center;
                }
              }
            }
          }
          >div{
            width: calc(100% - 90px);
            margin-left: 45px;
            background-color: #EEF5FC;
            border-radius: 4px;
            color: #687D9A;
            display: flex;
            padding: 10px 11px;
            font-size: 16px;
            line-height: 20px;
            margin-top: 27px;
            >ul{
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
