<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="sign ? 850 : 500"
    title="设置关联机器："
    :showHeader="!!sign"
    :top="sign ? '13vh' : '20vh'"
    @submit="submit"
    @cancel="localVisible = false"
    @closed="onClosed"
    :primary-text="sign ? '保存' : '验证'"
    class="mp-client-set-equipment-dialog-comp-wrap"
    >
    <div class="dialog-content">
      <div class="login" v-if="!sign">
        <h2>验证管理密码：</h2>
        <el-input v-model.trim="password" @keyup.enter="loginAdmin" autocomplete="off" type="password" clearable maxlength="16"></el-input>
      </div>
      <div v-else class="setup-content">
        <div class="header">
          <h4>设置关联机器：</h4>
          <span class="is-blue-span" @click="onRowAddClick" :class="{disabled: localEquipmentSetupData.localEquipmentSetupList.length > 3}">+ 添加机器</span>
        </div>
        <ul class="list">
          <li v-for="(it, i) in localEquipmentSetupData.localEquipmentSetupList" :key="it._key">
            <!-- 设备分类 -->
            <el-select v-model="it.ClassID" @change="() => { it.GroupID = ''; it.ID = '' }">
              <el-option v-for="item in localEquipmentSetupData.EquipmentClassList" :key="item.ID" :label="item.Name" :value="item.ID" />
            </el-select>
            <!-- 设备组 -->
            <el-select v-model="it.GroupID" @change="() => { it.ID = '' }">
              <el-option v-for="item in getEquipmentGroupList(it.ClassID)" :key="item.ID" :label="item.Name" :value="item.ID" />
            </el-select>
            <!-- 设备 -->
            <el-select v-model="it.ID">
              <el-option
                v-for="item in getEquipmentList(it.ClassID, it.GroupID)"
                :key="item.ID"
                :label="item.Name"
                :value="item.ID"
                :disabled="!!(item.Terminal && item.Terminal !== terminal)"
               />
            </el-select>
            <RemoveMenu @click="onRowRemoveClick(i)" v-show="localEquipmentSetupData.localEquipmentSetupList.length > 1" />
          </li>
        </ul>
        <p class="footer">
          <span class="tips-box">
            <el-icon><WarningFilled /></el-icon> 注：最多可绑定4台机器
          </span>
        </p>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import clientApi from '@/api/client';
import { ManageClientPageData } from '@/api/client/clientStore';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { EquipmentSetupClass } from '../assets/js/EquipmentSetupClass';
import { IEquipmentSetupItem } from '../assets/js/types';
import { getLocalMachineCode } from '../assets/js/getLocalMachineCode';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const sign = ref(''); // 管理员登录后请求接口需要在header里面添加的字段

const password = ref(''); // 6 - 16位

const localEquipmentSetupData = ref(new EquipmentSetupClass(ManageClientPageData.value.TerminalEquipmentList.map(it => it.ID)));

const onClosed = () => {
  sign.value = '';
  password.value = '';
};

const terminal = ref('');

const loginAdmin = async () => { // 管理员登录
  if (!password.value) {
    MpMessage.error({ title: '验证失败', msg: '请输入密码' });
    return;
  }
  if (password.value.length < 6) {
    MpMessage.error({ title: '验证失败', msg: '密码长度不能小于6位' });
    return;
  }

  const resp = await clientApi.getVerifySystemPassword(password.value).catch(() => null);

  if (resp?.data.isSuccess) {
    sign.value = resp.data.Data;
    localEquipmentSetupData.value = new EquipmentSetupClass(ManageClientPageData.value.TerminalEquipmentList.map(it => it.ID));
    localEquipmentSetupData.value.getInitData(sign.value);
    terminal.value = await getLocalMachineCode();
  }
};

const getEquipmentGroupList = (ClassID: IEquipmentSetupItem['ClassID']) => {
  if (!ClassID && ClassID !== 0) return [];
  return localEquipmentSetupData.value.EquipmentGroupList.filter(it => it.ClassID === ClassID);
};

const getEquipmentList = (ClassID: IEquipmentSetupItem['ClassID'], GroupID: IEquipmentSetupItem['GroupID']) => {
  if (!ClassID && ClassID !== 0) return [];
  if (!GroupID) return [];
  return localEquipmentSetupData.value.EquipmentList.filter(it => it.ClassID === ClassID && it.GroupID === GroupID);
};

const onRowAddClick = () => { // 添加一行
  if (localEquipmentSetupData.value.localEquipmentSetupList.length >= 4) return;
  localEquipmentSetupData.value.generateEquipmentSetupItem();
};

const onRowRemoveClick = (i: number) => {
  localEquipmentSetupData.value.localEquipmentSetupList.splice(i, 1);
};

const submit = () => {
  if (!sign.value) { // 验证管理密码
    loginAdmin();
  } else { // 设备保存
    const cb = async (list: IManageEquipmentInfo[]) => {
      ManageClientPageData.value.setTerminalEquipmentList(list);
      localVisible.value = false;
    };
    localEquipmentSetupData.value.submit(sign.value, cb);
  }
};

</script>

<style lang='scss'>
.mp-client-set-equipment-dialog-comp-wrap {
  .el-dialog__header {
    height: 45px;
    p {
      font-size: 18px;
      line-height: 24px;
    }
  }

  .el-dialog__body {
    padding: 20px;
    .dialog-content {
      color: #444;
      .login {
        margin: 0 auto;
        width: 320px;
        padding-top: 20px;
        padding-bottom: 30px;
        h2 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .el-input {
          height: 40px;
          font-size: 16px;
        }
      }

      .setup-content {
        font-size: 19px;
        padding-left: 60px;
        padding-right: 40px;
        > .header {
          display: flex;
          align-items: center;
          padding-bottom: 14px;
          h4 {
            margin-right: 15px;
          }
        }

        > .list {
          height: 260px;
          > li {
            margin-bottom: 20px;
            .el-select {
              width: 180px;
              height: 42px;
              margin-right: 28px;
              .el-input {
                height: 42px;
                .el-input__inner {
                  font-size: 15px;
                }
              }
            }

            .mp-remove-menu {
              span {
                font-size: 15px;
              }
              i {
                font-size: 16px;
              }
            }
          }
        }

        > .footer {
          display: flex;
          justify-content: center;
          > span {
            width: 255px;
            height: 39px;
            line-height: 39px;
            font-size: 16px;
            padding-left: 18px;
            position: relative;
            left: -10px;
            i {
              font-size: 19px;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    .el-button {
      height: 40px;
      width: 135px;
      font-size: 15px;
      border-radius: 3px;
    }
  }
}
</style>
