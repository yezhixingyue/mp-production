<template>
  <div class="mp-erp-layout-header-comp-wrap">
    <div class="open-close-left-menu">
      <i :class="LayoutStore.isCollapse?'iconfont icon-zhankai':'iconfont icon-shouqi'"
      @click="LayoutStore.isCollapse = !LayoutStore.isCollapse"
      @keyup="() => {}"></i>
    </div>

    <div class="centre" @contextmenu="onContextmenuclick" ref="oList">
      <el-tabs
        v-model="localTabsValue"
        type="border-card"
        @tab-remove="onCloseCurClick"
      >
        <el-tab-pane
          v-for="(item) in LayoutStore.editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
        >
        </el-tab-pane>
      </el-tabs>
      <el-tooltip
        popper-class="mp-common-tip-span-btn-popper-box"
        :show-after="280"
        :visible-arrow="false"
        transition="none"
        :enterable="false"
        content="关闭所有标签"
        placement="bottom-start"
        v-if="LayoutStore.editableTabs.length > 1"
      >
        <div class="clear-box">
          <el-button link @click="onCloseAllClick">
          <i class="iconfont icon-guanbi"></i>
          </el-button>
        </div>
      </el-tooltip>
      <ul
        class="mp-erp-layout-header-show-menu-box"
        v-show="showContextMenu"
        :style="`left:${contextMenuLeft}px;top:${contextMenuTop}px`"
      >
        <li @click="() => onCloseCurClick()" @keyup="()=>null">关闭</li>
        <li @click="onCloseOtherClick" @keyup="()=>null">关闭其它</li>
        <li @click="onCloseAllClick" @keyup="()=>null">关闭所有</li>
      </ul>
    </div>

    <!-- <button v-for="item in LayoutStore.editableTabs" :key="item.name"
    :style="localTabsValue==item.name?'color:red':''"
    @click="changeTab(item)"
    >{{item.title}} <i @click="onCloseCurClick(item.name)" @keyup="()=>{}">x</i></button>
    头部 -->

      <div class="user">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-icon class="ft-16 is-bold">
              <User />
            </el-icon>
            <!-- <mp-button>退出登录</mp-button> -->
            <span>
              {{user ? user.StaffName : ''}}
            </span>
            <el-icon>
              <ArrowDown />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="mp-erp-user-drop-down-wrap">
              <el-dropdown-item
              @click="changePwd"
              :icon="Lock" command='changePwd'>修改密码</el-dropdown-item>
              <el-dropdown-item
              @click="handleLogoutClick"
                :icon="SwitchButton"
                command='logout'>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <ChangePwdDialog v-model:visible="visible4ChangePassword"></ChangePwdDialog>
  </div>
</template>

<script lang='ts'>
import {
  SwitchButton, Lock, User, ArrowDown,
} from '@element-plus/icons-vue';
import { useLayoutStore } from '@/store/modules/layout/index';
import {
  computed, ref, Ref, onMounted, onBeforeUnmount,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { addBarType } from '@/store/modules/layout/addBarType';
import ChangePwdDialog from './ChangePwdDialog.vue';

export default {
  components: {
    ChangePwdDialog,
  },
  setup() {
    const LayoutStore = useLayoutStore();
    const router = useRouter();
    const userStore = useUserStore();
    const oList:Ref = ref(null);
    const visible4ChangePassword = ref(false);
    const { user } = storeToRefs(userStore);
    const localTabsValue = computed({
      get() {
        return LayoutStore.editableTabsValue;
      },
      set(val) {
        if (LayoutStore.editableTabsValue === val) return;
        const t = LayoutStore.editableTabs.find((it) => it.name === val);
        if (t) {
          LayoutStore.setEditableTabsValue(t.name);
          LayoutStore.setLeftMenuDefaultActive(t.name);
          router.push(t.path);
        }
      },
    });
    const showContextMenu = ref(false);
    const contextMenuLeft = ref(0);
    const contextMenuTop = ref(0);
    const contextmenuItemData = ref<addBarType|null>(null);

    // 引入ui组件之后需要删除
    function changeTab(item:addBarType) {
      localTabsValue.value = item.name;
    }
    function handleLogoutClick() {
      userStore.token = '';
      router.replace('/login');
    }
    function changePwd() {
      visible4ChangePassword.value = true;
    }
    function onCloseCurClick(name?:string) {
      // 关闭;
      if ((!contextmenuItemData.value && !name)
         || (contextmenuItemData.value && contextmenuItemData.value.title === '首页')) return;
      const tabs = LayoutStore.editableTabs;
      let activeName = LayoutStore.editableTabsValue;
      const itemName = name || contextmenuItemData.value?.name;
      if (activeName === itemName) {
        tabs.forEach((tab, index) => {
          if (tab.name === itemName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      LayoutStore.removeTabItem(itemName || '1');
      localTabsValue.value = activeName;
    }
    function onCloseOtherClick() {
      // 关闭其它
      if (!contextmenuItemData.value) return;
      LayoutStore.removeOther(contextmenuItemData.value.name);
      localTabsValue.value = contextmenuItemData.value.name;
    }
    // 关闭所有
    function onCloseAllClick() {
      LayoutStore.removeAll();
      localTabsValue.value = '1';
    }
    function getContextmenuItemData(title) {
      const t = LayoutStore.editableTabs.find((it) => it.title === title);
      if (t) contextmenuItemData.value = t;
      else contextmenuItemData.value = null;
    }
    function onContextmenuclick(e) {
      const bool = e.target.classList.contains('el-tabs__item')
        || e.target.parentNode.classList.contains('el-tabs__item');
      if (bool) {
        e.preventDefault();
        let title = e.target.innerText;
        if (!title && e.target.parentNode.classList.contains('el-tabs__item')) {
          title = e.target.parentNode.innerText;
        }
        if (title) {
          contextMenuLeft.value = e.pageX - oList.value.offsetLeft;
          contextMenuTop.value = e.pageY - oList.value.offsetTop;
          showContextMenu.value = true;
          // console.log(title);
          getContextmenuItemData(title);
        }
      }
    }
    function onDocumentClick() {
      if (!showContextMenu.value) return;
      showContextMenu.value = false;
    }
    onMounted(() => {
      document.addEventListener('click', onDocumentClick);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', onDocumentClick);
    });
    return {
      SwitchButton,
      Lock,
      User,
      ArrowDown,
      visible4ChangePassword,
      oList,
      onContextmenuclick,
      showContextMenu,
      contextMenuLeft,
      contextMenuTop,
      handleLogoutClick,
      changePwd,
      LayoutStore,
      localTabsValue,
      changeTab,
      onCloseAllClick,
      onCloseCurClick,
      onCloseOtherClick,
      user,
    };
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
// @use '@/assets/css/var.scss';
.mp-erp-layout-header-comp-wrap{
  display: flex;
  align-items: center;
  background-color: #fff;
  height: 40px;
  >.open-close-left-menu{
    i{
      cursor: pointer;
      display: inline-block;
      color: #428DFA;
      width:18px;
      height:18px;
      margin-right: 20px;
      margin-left: 13px;
      font-size: 18px;
    }
  }
  .centre{
    flex: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    .el-tabs{
      max-width: calc(100% - 51px);
      border: 0;
      height: 26px;
      &.el-tabs--border-card>.el-tabs__header{
        background-color: #fff;
        border-bottom:none;
        .el-tabs__nav{
          display: flex;
          height: 26px;
          align-items: center;
          padding: 0 2px;
          .el-tabs__item{
            border: none;
            font-size: 14px;
            color: #7C7C7C;
            border: 1px solid #E8E8E8;
            // border-radius: 4px;
            line-height: 26px;
            padding: 0px 10px;
            height: 26px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            .is-icon-close svg{
              margin: 0;
            }
            &.is-active{
              background-color: $--color-primary;
              border-color: $--color-primary;
              color: #fff;
              &:hover{
                color: #fff;
              }
            }
            &:hover{
              color:  $--color-primary;
            }
            &.is-active::before{
              content: '';
              width: 5px;
              height: 5px;
              display: inline-block;
              color: #fff;
              border-radius: 50%;
              margin-right: 5px;
              background-color: #fff;
            }
          }
        }
      }
      .el-tabs__header{
        .el-tabs__nav-wrap{
          .el-tabs__nav-prev,.el-tabs__nav-next{
            // line-height: 26px;
            height: 26px;
            display: flex;
            align-items: center;
          }
        }
      }
      .el-tabs__content{
        display: none;
      }
    }
    .clear-box{
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      font-size: 14px;
      color: #7C7C7C;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      // line-height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      .el-button{
        width: 100%;
        height: 100%;
        flex: 1;
      }
      i{
        margin: 0;
      }
      &:hover{
        cursor: pointer;
      }
    }
    > .mp-erp-layout-header-show-menu-box {
      position: absolute;
      width: 80px;
      height: 90px;
      font-size: 12px;
      padding: 6px 0;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      background-color: #fff;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      z-index: 99;
      box-sizing: border-box;
      border-radius: 4px;
      color: #333;
      > li {
        padding: 6px 12px;
        cursor: pointer;
        user-select: none;
        &:hover {
          background-color: #eee;
          color: rgb(38, 188, 249);
        }
      }
    }
  }
  .user{
    width: 188px;
    padding-right: 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    &:hover{
      cursor: pointer;
    }
    .el-dropdown-link{
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
    }
  }
}
</style>
