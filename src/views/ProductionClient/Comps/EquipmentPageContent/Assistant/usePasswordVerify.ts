import clientApi from '@/api/client';
import { Base64 } from 'js-base64';
import { ref } from 'vue';

/** 密码验证 */
export const usePasswordVerify = () => {
  const state = ref({
    Password: '',
    VerifyError: '',
    VerifySuccess: false,
  });

  const verifyPassword = () => {
    state.value.VerifyError = '';

    if (!state.value.Password) {
      state.value.VerifyError = '请输入密码';
      return false;
    }

    if (state.value.Password.length < 6) {
      state.value.VerifyError = '密码长度至少为6位';
      return false;
    }

    return true;
  };

  const onPasswordVerifyClick = async () => {
    if (!verifyPassword()) {
      return;
    }

    const resp = await clientApi.getAccountVerifyPassword({
      Password: Base64.encode(state.value.Password),
    });

    if (resp.data?.isSuccess) {
      state.value.VerifySuccess = true;
    } else {
      state.value.VerifyError = resp.data?.Message || '密码验证失败';
    }
  };

  return { state, onPasswordVerifyClick };
};
