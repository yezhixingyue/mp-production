<template>
  <div class="mp-erp-login-page-wrap">
    <section>
      <header>
        <img src="../../assets/images/logo-big.png" alt="">
      </header>
      <main>
        <div class="box">
          <div class="left">
            <div class="mask">
              <div class="line"></div>
              <h2>名片之家</h2>
              <p>500万广告设计机构印刷服务商</p>
              <p>Five Million AD Design Agencies Printing Services</p>
            </div>
          </div>
          <div class="right">
            <el-form
              :model="loginForm"
              @submit.prevent
              hide-required-asterisk
              ref="ruleForm"
              label-width="0px"
              class="demo-ruleForm">
              <el-form-item prop="Mobile" :rules="[
                { required: true, message: '请输入账号(手机号码)', trigger: 'blur' },
                { pattern: /1[3456789]\d{9}/, message: '手机号码格式不正确', trigger: 'blur' },
              ]">
                  <el-input v-model.trim="loginForm.Mobile" placeholder="请输入账号" maxlength="11">
                    <template #prefix>
                    <i>
                      <img src="../../assets/images/login1.png" alt="">
                    </i>
                  </template>
                  </el-input>
              </el-form-item>
              <el-form-item prop="Password" :rules="[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 16, message: '密码长度应在6-16位之间', trigger: 'blur' },
              ]">
                  <el-input type="password" v-model.trim="loginForm.Password"
                  @keyup.enter="submitForm" placeholder="请输入密码" maxlength="16">
                  <template #prefix>
                    <i>
                      <img src="../../assets/images/login2.png" alt="">
                    </i>
                  </template>
                  </el-input>
              </el-form-item>
              <el-form-item>
                  <el-button type="info" @click="submitForm">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>

<script lang='ts'>
import { reactive, ref } from 'vue';
import { Base64 } from 'js-base64';
import { ILoginSubmitForm } from '@/store/modules/user/types';
import { useUserStore } from '@/store/modules/user';
import { useLayoutStore } from '@/store/modules/layout';
import { useRouter } from 'vue-router';
import { FormInstance } from 'element-plus';

export default {
  name: 'LoginPage',
  setup() {
    const router = useRouter();
    const loginForm: ILoginSubmitForm = reactive({ Mobile: '', Password: '', Terminal: 1 });
    const userStore = useUserStore();
    const LayoutStore = useLayoutStore();

    const ruleForm = ref<FormInstance>();

    const submitForm = () => {
      if (ruleForm.value) {
        ruleForm.value.validate(async (valid) => {
          if (valid) {
            // 省略校验
            const temp = { ...loginForm, Password: Base64.encode(loginForm.Password) };
            const res = await userStore.getLogin(temp);

            if (res) {
              LayoutStore.setEditableTabsValue('/');
              LayoutStore.setLeftMenuDefaultActive('0');
              // 登录成功
              router.replace('/');
            }
          }
        });
      }
    };

    return {
      ruleForm,
      loginForm,
      submitForm,
    };
  },
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-login-page-wrap {
  width: 100%;
  height: 100%;
  background-color: rgb(52, 73, 100);
  > section {
    min-height: 100%;
    width: 100%;
    // background-color: #bbd5fa;
    box-sizing: border-box;
    background: url(../../assets/images/login-bg.png) no-repeat center center/cover;
    > header {
      padding-top: 40px;
      padding-left: 40px;
      height: 91px;
      box-sizing: border-box;
      > img {
        width: 228px;
      }
    }
    > main {
      padding-top: 150px;
      padding-bottom: 50px;
      position: relative;
      > .box {
        height: 494px;
        width: 880px;
        border-radius: 6px;
        margin: 0 auto;
        overflow: hidden;
        > .left {
          display: inline-block;
          vertical-align: top;
          width: 423px;
          height: 100%;
          // background-color: rgba($color: #000000, $alpha: 0.5);
          background: url(../../assets/images/login-bg-sm.png) no-repeat center center/cover;
          position: relative;
          .mask {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba($color: #030303, $alpha: 0.6);
            color: #fff;
            padding-left: 93px;
            padding-top: 135px;
            padding-right: 40px;
            > div.line {
              width: 43px;
              height: 2px;
              background-color: #c4c4c4;
            }
            > h2 {
              padding: 40px 0;
              font-weight: 700;
              font-size: 25px;
              line-height: 30px;
            }
            > p {
              line-height: 26px;
              margin-bottom: 10px;
              font-family: Microsoft YaHei-Regular, Microsoft YaHei;
            }
          }
        }
        > .right {
          width: 457px;
          background-color: rgba($color: #fff, $alpha: 0.9);
          display: inline-block;
          vertical-align: top;
          height: 100%;
          box-sizing: border-box;
          padding-top: 156px;
          .demo-ruleForm {
            width: 226px;
            margin: 0 auto;
            > div > div {
              .el-input {
                .el-input__wrapper {
                  background-color: transparent;
                  border-radius: 0;
                  border-top: none;
                  border-left: none;
                  border-right: none;
                  box-shadow: none;
                  border-bottom: 1px solid #dcdfe6;
                  transition: 0.3s !important;
                }
                input {
                  background-color: rgba($color: #000, $alpha: 0);
                  background-color: transparent;
                  border-radius: 0;
                  border-top: none;
                  border-left: none;
                  border-right: none;
                  font-size: 15px;
                  // margin-bottom: 3px;
                  padding-left: 10px;
                  &::placeholder {
                    color: #aaa;
                  }
                }
                .el-input__prefix {
                  align-items: center;
                  i {
                    width: 23px;
                    height: 23px;
                    display: inline-block;
                    vertical-align: -7px;
                    > img {
                      width: 23px;
                      height: 23px;
                      vertical-align: baseline;
                    }
                  }
                  &::after {
                    content: '';
                    display: inline-block;
                    width: 1px;
                    height: 18px;
                    background-color: #aaa;
                    vertical-align: middle;
                    margin-left: 9px;
                  }
                }
              }
              button {
                margin-top: 16px;
                width: 226px;
                height: 26px;
                border-radius: 13px;
                padding: 0;
                font-size: 15px;
                background-color: #E1E3E4;
                border: none;
                color: #243142;
                &:hover {
                  background-color: #ddd;
                }
                &:active {
                  background-color: #cbcbcb;
                }
              }
            }
            .is-error {
              .el-input__wrapper {
                border-color:  #ff3769 !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
