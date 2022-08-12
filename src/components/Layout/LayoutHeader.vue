<template>
  <div class="mp-erp-layout-header-comp-wrap">
    <div class="open-close-left-menu">
      <i :class="LayoutStore.isCollapse?'iconfont icon-zhankai':'iconfont icon-shouqi'"
      @click="LayoutStore.isCollapse = !LayoutStore.isCollapse"
      @keyup="() => {}"></i>
    </div>

    <div class="centre">
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
          <i class="iconfont icon-guanbi"></i>
        </div>
      </el-tooltip>
    </div>

    <!-- <button v-for="item in LayoutStore.editableTabs" :key="item.name"
    :style="localTabsValue==item.name?'color:red':''"
    @click="changeTab(item)"
    >{{item.title}} <i @click="onCloseCurClick(item.name)" @keyup="()=>{}">x</i></button>
    头部 -->

      <div class="user">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-user"></i>
            <el-button>退出登录</el-button>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="mp-erp-user-drop-down-wrap">
              <el-dropdown-item icon="el-icon-lock" command='changePwd'>修改密码</el-dropdown-item>
              <el-dropdown-item
              @click="handleLogoutClick"
                icon="el-icon-switch-button"
                command='logout'>退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

  </div>
</template>

<script lang='ts'>
import { useLayoutStore } from '@/store/modules/layout/index';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { addBarType } from '@/store/modules/layout/addBarType';

export default {
  setup() {
    const LayoutStore = useLayoutStore();
    const router = useRouter();
    const userStore = useUserStore();
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
    // 引入ui组件之后需要删除
    function changeTab(item:addBarType) {
      localTabsValue.value = item.name;
    }
    function handleLogoutClick() {
      userStore.token = '';
      router.replace('/login');
    }
    function onCloseCurClick(name:string) {
      // 关闭
      // if ((!this.contextmenuItemData && !name) ||
      //    (this.contextmenuItemData && this.contextmenuItemData.title === '首页')) return;
      if (!name) return;
      const tabs = LayoutStore.editableTabs;
      let activeName = LayoutStore.editableTabsValue;
      const itemName = name;
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
      LayoutStore.removeTabItem(itemName);
      localTabsValue.value = activeName;
    }
    return {
      handleLogoutClick,
      LayoutStore,
      localTabsValue,
      changeTab,
      onCloseCurClick,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-layout-header-comp-wrap{
  display: flex;
  align-items: center;
  background-color: #fff;
  height: 40px;
  overflow: hidden;
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
    max-width: calc(100% - 188px - 51px);
    display: flex;
    align-items: center;
    .el-tabs{
      max-width: calc(100% - 51px);
      border: 0;
      height: 39px;
      &.el-tabs--border-card>.el-tabs__header{
        background-color: #fff;
        border-bottom:none;
        .el-tabs__nav{
          display: flex;
          height: 40px;
          align-items: center;
          padding: 0 2px;
          .el-tabs__item{
            border: none;
            font-size: 14px;
            color: #7C7C7C;
            border: 1px solid #E8E8E8;
            border-radius: 4px;
            line-height: 30px;
            padding: 0px 10px;
            height: 30px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            .is-icon-close svg{
              margin: 0;
            }
            &.is-active{
              background-color: #428DFA;
              border-color: #428DFA;
              color: #fff;
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
      &:hover{
        cursor: pointer;
      }
    }
  }
  .user{
    margin-right: 50px;
    margin-left: 50px;
  }
}
</style>
