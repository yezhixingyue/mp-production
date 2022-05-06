<template>
  <div class="mp-erp-login-page-wrap">
    <div class="box">
      <input v-model="loginForm.Mobile">
      <input type="password" v-model="loginForm.Password">
      <button class="is-font-16" @click="submitForm">登录</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { reactive } from 'vue';
import { Base64 } from 'js-base64';
import { ILoginSubmitForm } from '@/store/modules/user/types';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const loginForm: ILoginSubmitForm = reactive({ Mobile: '', Password: '', Terminal: 1 });

    const submitForm = async () => {
      // 省略校验
      const userStore = useUserStore();
      const temp = { ...loginForm, Password: Base64.encode(loginForm.Password) };
      const res = await userStore.getLogin(temp);
      if (res) {
        // 登录成功
        router.replace('/');
      }
    };

    return {
      loginForm,
      submitForm,
    };
  },
};
</script>
<style lang='scss' scoped>
@import '@/assets/css/var.scss';
.mp-erp-login-page-wrap {
  width: 100%;
  height: 100%;
  background: #222b3a;
  display: grid;
  align-items: center;
  justify-items: center;
  padding-bottom: 10vh;
  box-sizing: border-box;
  > .box {
    display: flex;
    flex-direction: column;
    color: #222b3a;
    > input, > button {
      width: 280px;
      height: 36px;
      margin-bottom: 10px;
      border-radius: 2px;
      border: 1px solid #eee;
      padding: 0 10px;
      box-sizing: border-box;
    }
    > button {
      background: #fff;
      transition: 0.05s ease-in-out;
      letter-spacing: 1px;
      &:hover {
        background: lighten(#222b3a, 72);
      }
      &:active {
        background: lighten(#222b3a, 40);
        border-color: lighten(#222b3a, 40);
      }
    }
  }
}
</style>
