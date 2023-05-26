<template>
  <div class="user">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <template v-if="!showImgType">
          <el-icon class="ft-16 is-bold">
            <User />
          </el-icon>
          <span>
            {{user ? user.StaffName : ''}}
          </span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </template>
        <span class="avatar" v-else :title="user?.StaffName || ''">
          <img v-if='imgSrc' :src="imgSrc" alt="">
          <span v-else-if="!loadingImg" class='n'>{{ user?.StaffName ? user?.StaffName[0] : '' }}</span>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="mp-erp-user-drop-down-wrap">
          <el-dropdown-item v-if="user?.StaffName && showImgType" class="u-name">{{ user.StaffName }}</el-dropdown-item>
          <el-dropdown-item @click="visible = true" :icon="Lock" command='changePwd'>修改密码</el-dropdown-item>
          <el-dropdown-item @click="onDocManageClick" :icon="Lock">文档管理</el-dropdown-item>
          <el-dropdown-item @click="logout" :icon="SwitchButton" command='logout'>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ChangePwdDialog v-model:visible="visible"></ChangePwdDialog>
  </div>
</template>

<script setup lang='ts'>
import {
  SwitchButton, Lock, User, ArrowDown,
} from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getImgGaussBlurUrl } from '@/assets/js/utils/gaussBlur';
import ChangePwdDialog from './ChangePwdDialog.vue';

const props = defineProps<{
  showImgType?: boolean
}>();

const userStore = useUserStore();

const { user } = storeToRefs(userStore);
const router = useRouter();

const visible = ref(false);

const onDocManageClick = () => {
  if (!user.value) return;
  window.open(`http://192.168.1.92:3020/init?token=${user.value.Token}&siteType=2&target=manage`);
};

const logout = () => {
  userStore.token = '';
  router.replace('/login');
};

const imgSrc = ref('');
const loadingImg = ref(false);
watch(() => user.value?.HeadPic, (newVal, oldVal) => {
  if (newVal === oldVal || !props.showImgType) return;
  imgSrc.value = '';

  if (newVal) {
    const img = new Image();

    img.src = newVal;
    loadingImg.value = true;

    img.onload = () => {
      imgSrc.value = getImgGaussBlurUrl(img, true);
      loadingImg.value = false;
    };

    img.onerror = () => {
      loadingImg.value = false;
    };
  }
}, { immediate: true });

</script>

<style scoped lang='scss'>
.user{
  width: 188px;
  padding-right: 25px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  &:hover{
    cursor: pointer;
  }
  :deep(.el-dropdown-link) {
    display: flex;
    align-items: center;
    user-select: none;
    span{
      margin: 0 5px;
    }
    color: #888e99;
    &:hover {
      color: #26bcf9;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 27px;
      height: 27px;
      border: 1px solid #26bcf9;
      border-radius: 4px;
      font-size: 13px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .n {
        color: #26bcf9;
      }
    }
  }
}
:deep(.u-name) {
  justify-content: center;
  padding-left: 22px;
  user-select: none;
  pointer-events: none;
  padding-top: 8px;
  padding-bottom: 8px;
  font-weight: 700;
}
</style>
