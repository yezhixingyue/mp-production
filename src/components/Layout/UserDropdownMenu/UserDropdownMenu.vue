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
          <el-dropdown-item v-if="docPermissions?.manage" @click="onMenuClick('ManualOrder')"><i class="icon-header-03 iconfont"></i> 手动下单</el-dropdown-item>
          <el-dropdown-item v-if="docPermissions?.manage" @click="onMenuClick('ExternalReceiveManage')"><i class="icon-daiwaixie iconfont scale-8"
            style="position: relative;right: 1px;"></i> 外协入库</el-dropdown-item>
          <el-dropdown-item v-if="docPermissions?.manage" @click="onDocClick('manage')"><i class="iconfont icon-wendangguanli1"></i> 文档管理</el-dropdown-item>
          <el-dropdown-item v-if="docPermissions?.read" @click="onDocClick('document')"><i class="iconfont icon-bangzhuzhongxin"></i> 帮助中心</el-dropdown-item>
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
import { ref, watch, computed } from 'vue';
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

const docPermissions = computed(() => {
  if (!user.value) return null;

  const {
    ReadLevel1, ReadLevel2, ReadLevel3, ReadLevel4, ReadLevel5,
  } = user.value.PermissionList.PermissionManageArticle.Obj;

  return {
    manage: user.value.PermissionList.PermissionManageArticle.Obj.Setup,
    read: [ReadLevel1, ReadLevel2, ReadLevel3, ReadLevel4, ReadLevel5].includes(true),
  };
});

const onDocClick = (target) => {
  if (!user.value) return;
  const siteType = 2;
  window.open(`http://file.ybz888.com:7006/init?token=${user.value.Token}&siteType=${siteType}&target=${target}`);
};

const onMenuClick = (hash: string) => {
  const link = window.location.href.replace(/#\/[\w|\W]*/, `#/${hash}`);
  window.open(link);
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
      transition: color 0.1s ease-in-out;
      max-width: 6em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    color: #ddd;
    &:hover {
      color: #26bcf9;
    }

    i {
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

<style lang="scss">
.mp-erp-user-drop-down-wrap {
  .el-dropdown-menu__item {
    .iconfont {
      font-size: 15px;
    }
  }
}
</style>
