<template>
  <section class="page-wrap">
    <main>
      <p class="mp-common-title-wrap black">设置管理密码：</p>
      <div>
        <span class="label">当前密码:</span>
        <span class="content" >{{ loading ? '获取中' :  oldPwd || '' }}</span>
      </div>
      <div>
        <span class="label">新密码:</span>
        <el-input v-model.trim="newPwd" autocomplete="none" type="new-password" show-password maxlength="16" show-word-limit></el-input>
      </div>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="submit">保存</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { onMounted, ref } from 'vue';

const oldPwd = ref('');

const newPwd = ref('');

const loading = ref(false);

const getSystemPassword = async () => {
  loading.value = true;
  const resp = await api.getSystemPassword().catch(() => null);
  loading.value = false;
  if (resp?.data.isSuccess) {
    oldPwd.value = resp.data.Data;
  }
};

const submit = async () => {
  if (!newPwd.value) {
    MpMessage.error({ title: '修改失败', msg: '请输入密码' });
    return;
  }
  if (!/^[\w|\W]{6,16}$/.test(newPwd.value)) {
    MpMessage.error({ title: '修改失败', msg: '密码长度应为6 - 16位' });
    return;
  }

  const resp = await api.getChangeSystemPassword(newPwd.value).catch(() => null);

  if (resp?.data.isSuccess) {
    const cb = () => {
      oldPwd.value = newPwd.value;
      newPwd.value = '';
    };
    MpMessage.success({ title: '修改成功', onCancel: cb, onOk: cb });
  }
};

onMounted(() => {
  getSystemPassword();
});

</script>

<script lang="ts">
export default {
  name: 'ManageAdminPasswordPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    background-color: #fff;
    padding: 25px 20px;
    > div {
      margin-top: 15px;
      display: flex;
      align-items: center;
      .label {
        flex: none;
        margin-right: 15px;
        width: 72px;
        text-align: right;
      }

      .content {
        font-size: 12px;
      }

      .el-input {
        width: 270px;
      }
    }
  }
  > footer {
    flex: none;
    padding: 30px;
    background-color: #fff;
    text-align: center;
    button {
      width: 120px;
      height: 35px;
      border-radius: 3px;
    }
  }
}
</style>
