<template>
  <div class="login-box" v-if="loginInfo">
    <h2>登录</h2>
    <el-input placeholder="请输入您的手机号" v-model.trim="loginInfo.mobile" maxlength="11">
      <template #prepend><i class="iconfont icon-dianhua"></i></template>
    </el-input>
    <el-input placeholder="请输入您的密码" v-model.trim="loginInfo.password" maxlength="16" type="password" autocomplete="new-password" @keyup.enter="login">
      <template #prepend><i class="iconfont icon-mima scale-12"></i></template>
    </el-input>
    <mp-button type="primary" @click="login">登录</mp-button>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { ManageClientPageData } from '@/api/client/clientStore';

const loginInfo = computed(() => ManageClientPageData.value.curActiveInstance?.loginData);

const login = () => {
  ManageClientPageData.value.curActiveInstance?.login();
};

</script>

<style scoped lang='scss'>
.login-box {
  width: 815px;
  height: 406px;
  margin: 0 auto;
  margin-top: 69px;
  box-shadow: 0px 0px 15px 1px rgba(0,0,0,0.16);
  border-radius: 8px 8px 8px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    font-size: 30px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    padding-bottom: 7px;
  }

  :deep(.el-input) {
    width: 420px;
    margin-top: 30px;
    height: 48px;
    font-size: 22px;
    position: relative;
    .el-input__wrapper, .el-input-group__prepend {
      border-radius: 0;
    }
    .el-input-group__prepend {
      position: absolute;
      background-color: #fff;
      box-shadow: none;
      width: 64px;
      padding: 0;
      height: 30px;
      min-height: 30px;
      left: 2px;
      top: 9px;
      border-right: 2px solid #d4d4d4;
      i {
        font-size: 25px;
        color: #d4d4d4;
      }
    }
    .el-input__wrapper {
      box-shadow: 0 0 0 2px #d4d4d4;
      input {
        padding-left: 75px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        &::placeholder {
          color: #d4d4d4;
        }
      }
      &.is-focus {
        box-shadow: 0 0 0 2px #26bcf9;
      }
    }
  }

  .el-button {
    margin-top: 50px;
    width: 290px;
    height: 60px;
    font-size: 30px;
    border-radius: 30px;
  }
}
</style>
