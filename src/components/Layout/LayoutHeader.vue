<template>
  <div class="mp-erp-layout-header-comp-wrap">
    <!-- <div class="open-close-left-menu">
      <i :class="LayoutStore.isCollapse?'iconfont icon-zhankai':'iconfont icon-shouqi'"
      @click="LayoutStore.isCollapse = !LayoutStore.isCollapse"
      @keyup="() => {}"></i>
    </div> -->

    <div class="box">
      <div class="centre" @contextmenu="onContextmenuclick" ref="oList">
        <!-- <el-tabs
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
        </el-tabs> -->
        <div class="menus" v-if="displayMenuList">
          <span
            v-for="(item) in displayMenuList"
            :key="item.name"
            @click="localTabsValue = item.name"
            :class="{active: localTabsValue === item.name}"
            :style="`width:calc(${item.title?.length || 0}em + 55px)`"
            :title="item.title"
            >
            <em>{{ item.title }}</em>
            <i class="iconfont icon-guanbi close ft-12" @click="onCloseCurClick(item.name)"></i>
          </span>
        </div>
        <el-tooltip
          popper-class="mp-common-tip-span-btn-popper-box"
          :show-after="280"
          :visible-arrow="false"
          transition="none"
          :enterable="false"
          content="刷新当前页面"
          placement="bottom-start"
          v-if="displayMenuList?.length > 0"
        >
          <div class="clear-box mr-10 ml-8">
            <el-button
              link
              @click="refresh"
            >
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </div>
        </el-tooltip>
        <el-tooltip
          popper-class="mp-common-tip-span-btn-popper-box"
          :show-after="280"
          :visible-arrow="false"
          transition="none"
          :enterable="false"
          content="关闭所有标签"
          placement="bottom-start"
          v-if="displayMenuList?.length > 0"
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
          <!-- <li @click="refresh" @keyup="()=>null" v-if="localTabsValue === contextmenuItemData?.name">刷新本页</li> -->
          <li @click="onCloseOtherClick" @keyup="()=>null">关闭其它</li>
          <li @click="onCloseAllClick" @keyup="()=>null">关闭所有</li>
        </ul>
      </div>

      <UserDropdownMenu :_department="departmentDisplayList" />
    </div>
  </div>
</template>

<script lang='ts'>
import { useLayoutStore } from '@/store/modules/layout/index';
import {
  computed, ref, Ref, onMounted, onBeforeUnmount,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { addBarType } from '@/store/modules/layout/addBarType';
import { IJobPost } from '@/views/companyManage/JobPostManage/js/types';
import { IDepartmentLevelItem } from '@/views/companyManage/DepartmentManage/js/types';
import api from '@/api';
import { getDepartmentDisplayList, getDepartmentLevelList } from '@/assets/js/utils/getDepartmentLevelList';
import { setRefreshing } from './index';
import UserDropdownMenu from './UserDropdownMenu/UserDropdownMenu.vue';

export default {
  components: {
    UserDropdownMenu,
  },
  setup() {
    const LayoutStore = useLayoutStore();
    const router = useRouter();
    const userStore = useUserStore();
    const oList:Ref = ref(null);
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
          getContextmenuItemData(title);
        }
      }
    }
    function onDocumentClick() {
      if (!showContextMenu.value) return;
      showContextMenu.value = false;
    }

    const refresh = () => {
      setRefreshing(router);
    };

    // 岗位相关
    const jobPostList = ref<IJobPost[]>([]);
    const departmentLevelList = ref<IDepartmentLevelItem[]>([]);
    const getPositionData = async () => {
      const [resp1, resp2] = await Promise.all([api.getJobPermissionsList().catch(() => null), api.getDepartmentList().catch(() => null)]);

      if (resp1?.data.isSuccess) jobPostList.value = resp1.data.Data;

      if (resp2?.data.isSuccess) departmentLevelList.value = getDepartmentLevelList(resp2.data.Data);
    };
    const departmentDisplayList = computed(() => (user.value ? getDepartmentDisplayList(user.value, departmentLevelList.value, jobPostList.value) : []));

    onMounted(() => {
      document.addEventListener('click', onDocumentClick);
      getPositionData();
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', onDocumentClick);
    });

    const displayMenuList = computed(() => LayoutStore?.editableTabs?.filter(it => it.closable) || []);

    return {
      refresh,
      oList,
      onContextmenuclick,
      contextmenuItemData,
      showContextMenu,
      contextMenuLeft,
      contextMenuTop,
      handleLogoutClick,
      LayoutStore,
      localTabsValue,
      changeTab,
      onCloseAllClick,
      onCloseCurClick,
      onCloseOtherClick,
      user,
      displayMenuList,
      departmentDisplayList,
    };
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-layout-header-comp-wrap{
  background-color: #f5f5f5;
  height: 47px;
  border: none !important;
  padding-bottom: 7px;
  box-sizing: border-box;
  z-index: 200;
  .box {
    display: flex;
    align-items: flex-end;
    height: 40px;
    background-color: #191F2A;
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
      // overflow: hidden;
      max-width: calc(100% - 200px);
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
        width: 20px;
        height: 20px;
        font-size: 14px;
        color: #ababab;
        border: 1px solid #ababab;
        border-radius: 4px;
        // line-height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.12s ease-in-out;
        .el-button{
          width: 100%;
          height: 100%;
          flex: 1;
        }
        i{
          margin: 0;
          color: #a2a2a2;
          transition: 0.15s ease-in-out;
        }
        &:hover{
          cursor: pointer;
          // background-color: #f5f5f5;
          border-color: #cbcbcb;
        }
        &:active {
          // background-color: #eee;
          border-color: #888e99;
          i {
            color: #686868;
          }
        }
      }
      > .mp-erp-layout-header-show-menu-box {
        position: absolute;
        width: 80px;
        // height: 90px;
        font-size: 12px;
        padding: 6px 0;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        background-color: #fff;
        // box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
        z-index: 99;
        box-sizing: border-box;
        border-radius: 4px;
        color: #333;
        > li {
          padding: 6px 12px;
          cursor: pointer;
          line-height: 15px;
          user-select: none;
          &:hover {
            background-color: #eee;
            color: rgb(38, 188, 249);
          }
        }
      }

      > .menus {
        color: #ababab;
        font-size: 14px;
        display: flex;
        flex: 0 1 auto;
        overflow: hidden;
        height: 31px;
        white-space: nowrap;
        > span {
          padding-left: 15px;
          padding-right: 12px;
          background-color: #32405A;
          border-radius: 4px 4px 0px 0px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
          cursor: pointer;
          margin-right: 1px;
          flex: 0 1 auto;
          overflow: hidden;
          i {
            margin-left: 8px;
            flex: none;
            font-weight: 700;
            transform: scale(0.75);
            &:hover {
              color: #26bcf9;
            }
          }
          em {
            flex: 0 1 auto;
            overflow: hidden;
          }
          &:hover {
            background-color: #454C5A;
          }
          &.active {
            background-color: #f5f5f5;
            color: #444444;
          }
        }
      }
    }

    > .user {
      height: 40px;
    }
  }
}
</style>
