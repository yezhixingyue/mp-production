<template>
  <div class="no-auth-page-wrap">
    <div>
        <el-icon class="is-red"><WarningFilled /></el-icon>
        <h3>无该页面访问权限!</h3>
        <p>
          <mp-button link type="primary" @click="goHome">返回首页</mp-button>
          <mp-button link type="primary" @click="logout">退出登录</mp-button>
        </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const goHome = () => {
  router.replace('/');
};

const logout = () => {
  userStore.token = '';
  router.replace('/login');
};
</script>

<style lang='scss'>
.no-auth-page-wrap {
  // margin: 30vh auto 0;
//   background-color: #eee;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-right: 120px;
  padding-bottom: 60px;
  > div {
      font-size: 14px;
      line-height: 70px;
      height: 70px;
      padding: 0 30px;
      background-color: #eee;
      border: 1px solid #ccc;
      color: #444;
      display: flex;
      align-items: center;
      > i {
          font-size: 32px;
          vertical-align: middle;
          margin-right: 10px;
      }
      button {
        margin-left: 20px;
        & + button {
          margin-left: 4px !important;
        }
      }
  }
}
</style>
