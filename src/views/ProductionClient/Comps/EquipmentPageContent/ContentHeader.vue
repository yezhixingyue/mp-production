<template>
  <header class="mp-client-header">
      <!-- 设备tab列表 -->
    <div class="f">
      <div class="list" ref="oList">
        <span
          v-for="(it, i) in ManageClientPageData.InstanceList"
          :key="it.Equipment.ID"
          :class="{active:curActiveInstance && curActiveInstance.Equipment.ID===it.Equipment.ID}"
          :title="it.EquipmentDisplayName"
          :style="`z-index:${10 - i}`"
          @click="onMenuClick(it)">
          {{ it.EquipmentDisplayName }}
        </span>
      </div>
      <span class="is-blue-span set" @click="onEquipmentSetupClick"><i class="iconfont icon-shezhi2"></i>设置机器</span>
    </div>
    <!-- 登录信息显示区 -->
    <div class="c">
      <template v-if="curActiveInstance && curActiveInstance.loginData.token">
        <span class="empty" ref="oEmptyBox"></span>
        <span class="stop-btn" @click="onEquipmentStopClick" ref="oStopButton"
         :class="{'v-hide':curActiveInstance.Equipment.Status===EquipmentStatusEnum.failure}"><i class="iconfont icon-baoting"></i> 机器报停</span>
        <span class="c-info" v-if="curActiveInstance.loginData.user" ref="oUser">
          <el-icon><User /></el-icon>
          {{ curActiveInstance.loginData.user.StaffName }}（{{ curActiveInstance.loginData.user.Mobile || '--' }}）
        </span>
        <span class="is-blue-span" @click="onLogoutClick"><el-icon><SwitchButton /></el-icon>退出</span>
      </template>
    </div>
  </header>
</template>

<script setup lang='ts'>
import {
  computed, nextTick, onMounted, ref, watch,
} from 'vue';
import { ManageClientPageData } from '@/api/client/clientStore';
import { useRouter } from 'vue-router';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentStatusEnum } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/enum';
import { TerminalEquipmentInstance } from '../../assets/js/Instance';

const router = useRouter();

defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['setEquipment', 'update:visible']);

/** 当前处于显示状态的设备实例 */
const curActiveInstance = computed(() => ManageClientPageData.value.curActiveInstance);

const onEquipmentSetupClick = () => {
  emit('setEquipment');
};

const onEquipmentStopClick = () => {
  if (curActiveInstance.value?.Equipment.Status === EquipmentStatusEnum.failure) return;
  emit('update:visible', true);
};

const onLogoutClick = () => {
  if (!curActiveInstance.value) return;
  MpMessage.warn({
    title: '确定退出登录吗 ?',
    msg: `
      <p class='logout-msg-box'>
        <span>机 器： <em class='ml-5'>${curActiveInstance.value.Equipment.Name}</em></span>
        <span style='margin-bottom: 12px'>登录人：${curActiveInstance.value.loginData.user?.StaffName}</span>  
      </p>
    `,
    dangerouslyUseHTMLString: true,
    onOk: () => {
      if (curActiveInstance.value) curActiveInstance.value.logout();
    },
  });
};

const oStopButton = ref<InstanceType<typeof HTMLElement>>();
const oList = ref<InstanceType<typeof HTMLElement>>();
const oEmptyBox = ref<InstanceType<typeof HTMLElement>>();
const handleStopBtnMove = async () => {
  await nextTick();

  if (!oList.value || !oEmptyBox.value || !oStopButton.value) return;

  // 1. 找到oList中的活动项目 计算其中心位置
  const oActive: HTMLElement | null = oList.value.querySelector('.active');
  if (!oActive) return;
  let x = oActive.offsetLeft + oActive.offsetWidth / 2;

  // 2. 获取oStopButton的宽度 计算出其左侧的左边点位置
  x -= oStopButton.value.offsetWidth / 2;

  // 3. 获取到最大可移动范围
  const maxX = oEmptyBox.value.offsetWidth - oStopButton.value.offsetWidth;

  // 4. 计算出数值 并进行移动
  if (x > maxX) x = maxX;
  oStopButton.value.style.transform = `translateX(${x}px)`;
  oStopButton.value.style.opacity = '1';
};

const onMenuClick = (it: Required<TerminalEquipmentInstance>) => {
  if (ManageClientPageData.value.curActiveInstance === it) return;
  if (oStopButton.value) oStopButton.value.style.opacity = '0';
  /** 1. 此处记录即将被切换走的实例的滚动信息 */
  const oWrap = document.querySelector('.mp-production-client-view-wrap');

  if (ManageClientPageData.value.curActiveInstance) ManageClientPageData.value.curActiveInstance.scrollInfo.top = oWrap?.scrollTop || 0;

  /** 2. 切换数据 */
  ManageClientPageData.value.curActiveInstance = it;

  /** 3. 当前设备转换至激活状态时的相关处理，如获取当前任务等 */
  if (ManageClientPageData.value.curActiveInstance) ManageClientPageData.value.curActiveInstance.switchToActive();

  /** 4.  此处还原即将来临的实例的滚动信息 */
  if (ManageClientPageData.value.curActiveInstance && oWrap) {
    ManageClientPageData.value.curActiveInstance.scrollInfo.willScroll = true;
    setTimeout(() => {
      if (ManageClientPageData.value.curActiveInstance) {
        oWrap.scrollTo(ManageClientPageData.value.curActiveInstance.scrollInfo);
        ManageClientPageData.value.curActiveInstance.scrollInfo.willScroll = false;
      }
    }, 0);
  }

  /** 5. 修改路径信息 - 用于刷新后还原指定机器 */
  router.push(`?id=${it.Equipment.ID}`);

  /** 6. 移动机器报停图标 */
  handleStopBtnMove();
};

watch(() => curActiveInstance.value?.loginData.user || curActiveInstance.value?.loginData.token, async () => {
  /** 移动机器报停图标 */
  if (oStopButton.value) oStopButton.value.style.opacity = '0';
  await nextTick();
  handleStopBtnMove();
});

onMounted(async () => {
  await nextTick();
  if (ManageClientPageData.value.InstanceList.length > 0) {
    const { id } = router.currentRoute.value.query;
    const t = ManageClientPageData.value.InstanceList.find(it => it.Equipment.ID === id) || ManageClientPageData.value.InstanceList[0];
    onMenuClick(t);
  }
});
</script>

<style scoped lang='scss'>

header.mp-client-header {
  padding-top: 20px;
  padding-bottom: 1px;
  font-size: 18px;
  position: sticky;
  top: 0;
  z-index: 999;
  background: #fff;
  .f {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    .list {
      display: flex;
      margin-right: 20px;
      overflow: hidden;
      overflow: auto;
      position: relative;
      > span {
        height: 46px;
        box-sizing: border-box;
        line-height: 20px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        padding: 10px 20px;
        min-width: 260px;
        text-align: center;
        cursor: pointer;
        transition: 0.1s ease-in-out;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: #D4D4D4;
        border: 3px solid #E5E5E5;
        color: #222B3A;
        font-weight: 700;
        border-bottom: none;
        border-radius: 0px 13px 0px 0px;
        &:first-of-type {
          border-radius: 13px 13px 0px 0px;
        }
        & + span {
          margin-left: -10px;
        }

        &:hover {
          color: #26bcf9;
        }

        &.active {
          color: #fff;
          background-color: #222B3A;
          border-color: #222B3A;
          z-index: 99 !important;
          border-radius: 13px 13px 0px 0px;
        }
      }
    }

    > span.set {
      flex: none;
      margin-right: 20px;
      margin-left: 10px;
      i {
        margin-right: 4px;
      }
    }
  }

  .c {
    height: 45px;
    background-color: #222B3A;
    line-height: 45px;
    font-size: 14px;
    display: flex;
    color: #fff;
    align-items: center;
    position: relative;
    > span {

      :deep(.el-icon) {
        font-size: 18px;
        margin-right: 5px;
        vertical-align: -3px;
      }

      &.c-info {
        padding-left: 40px;
      }

      &:last-of-type {
        padding: 0 30px 0 40px;
      }
      &.empty {
        flex: 1;
      }
      &.stop-btn {
        color: #F4A307;
        cursor: pointer;
        position: absolute;
        left: 0;
        font-size: 16px;
        font-weight: 700;
        &:hover {
          color: lighten($color: #F4A307, $amount: 15);
        }
        &:active {
          color: darken($color: #F4A307, $amount: 5);
        }
        &.v-hide {
          visibility: hidden;
        }
        i {
          font-size: 22px;
          margin-right: 5px;
          font-weight: 400;
        }
        display: flex;
        align-items: center;
        // transition: 0.15s ease-in-out;
      }
      &.is-blue-span {
        color: #fff;
        &:hover {
          color: lighten($color: #21bcf9, $amount: 15);
        }
        &:active {
          color: darken($color: #21bcf9, $amount: 5);
        }
      }
    }
  }
}
</style>
