<template>
  <section class="containner">
    <header>
      <!-- 设备tab列表 -->
      <div class="f">
        <div class="list">
          <span
            v-for="it in ManageClientPageData.InstanceList"
            :key="it.Equipment.ID"
            :class="{active:curActiveInstance && curActiveInstance.Equipment.ID===it.Equipment.ID}"
            @click="onMenuClick(it)">
            {{ it.Equipment.GroupName ? `${it.Equipment.GroupName}-` : '' }}{{ it.Equipment.Name }}
          </span>
        </div>
        <span class="is-blue-span" @click="onEquipmentSetupClick">设置机器</span>
      </div>
      <!-- 登录信息显示区 -->
      <div class="c">
        <template v-if="curActiveInstance && curActiveInstance.loginData.token">
          <span class="is-pink-span" @click="onEquipmentTopClick">机器报停</span>
          <span class="c-info" v-if="curActiveInstance.loginData.user">
            {{ curActiveInstance.loginData.user.StaffName }}（{{ curActiveInstance.loginData.user.Mobile || '--' }}）
          </span>
          <span class="is-blue-span" @click="onLogoutClick">退出登录</span>
        </template>
      </div>
    </header>
    <!-- 登录组件 -->
    <LoginComp v-if="curActiveInstance && !curActiveInstance.loginData.token" />
    <!-- 设置机器报停弹窗 -->
    <SetEquipmentStopDialog v-model:visible="stopVisible" />
  </section>
</template>

<script setup lang='ts'>
import { ManageClientPageData } from '@/api/client/clientStore';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import {
  computed, nextTick, onMounted, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import LoginComp from './LoginComp.vue';
import SetEquipmentStopDialog from './SetEquipmentStopDialog.vue';

const router = useRouter();

const emit = defineEmits(['setEquipment']);

const onEquipmentSetupClick = () => {
  emit('setEquipment');
};

/** 当前处于显示状态的设备实例 */
const curActiveInstance = computed(() => ManageClientPageData.value.curActiveInstance);

const onMenuClick = (it) => {
  /** 此处记录即将被切换走的实例的滚动信息 */
  ManageClientPageData.value.curActiveInstance = it;

  /** 此处还原即将来临的实例的滚动信息 */

  /** 修改路径信息 - 用于刷新后还原指定机器 */
  router.push(`?id=${it.Equipment.ID}`);
};

/** 设备报停 */
const stopVisible = ref(false);
const onEquipmentTopClick = () => {
  console.log('onEquipmentTopClick');
  stopVisible.value = true;
};

const onLogoutClick = () => {
  if (!curActiveInstance.value) return;
  MpMessage.warn({
    title: '确定退出登录吗 ?',
    msg: `当前机器：[ ${curActiveInstance.value.Equipment.Name} ]`,
    onOk: () => {
      if (curActiveInstance.value) curActiveInstance.value.loginData.logout();
    },
  });
};

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
.containner {
  width: 1300px;
  margin: 0 auto;
  > header {
    padding: 20px;
    font-size: 18px;
    .f {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1px;
      .list {
        display: flex;
        margin-right: 20px;
        > span {
          height: 43px;
          box-sizing: border-box;
          line-height: 20px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          padding: 10px 20px;
          min-width: 260px;
          text-align: center;
          cursor: pointer;
          transition: 0.1s ease-in-out;
          white-space: nowrap;
          box-shadow: 0 0 0 1px #e5e5e5;

          &.active {
            color: #26bcf9;
            background-color: #f5f5f5;
            box-shadow: 0 0 0 1px #f5f5f5;
          }

          &:hover {
            color: #26bcf9;
          }
        }
      }

      > span {
        flex: none;
        margin-right: 20px;
      }
    }

    .c {
      height: 45px;
      background-color: #f5f5f5;
      line-height: 45px;
      font-size: 16px;
      display: flex;
      > span {
        &:first-of-type {
          width: 260px;
          text-align: center;
        }
        &:nth-of-type(2) {
          min-width: 260px;
          text-align: center;
          font-weight: 700;
          font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        }
        &:last-of-type {
          padding-left: 40px;
        }
      }
    }
  }
}
</style>
