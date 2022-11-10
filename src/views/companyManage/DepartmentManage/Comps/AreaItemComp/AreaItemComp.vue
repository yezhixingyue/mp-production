<template>
  <li class="mp-erp-basic-set-up-sell-area-set-up-page-left-content-area-item-comp-wrap" :class="{other: itemData.Index === 999 && moving}">
    <div class="header hover-margin" @click="onActiveIDClick(itemData.ID)" @dblclick="onExtendClick" :class="{active: activeId === itemData.ID}">
      <span>{{itemData.Name}}</span>
      <div class="menu" @dblclick.stop @click="onManageSubClick(itemData.ID)" :class="{moving: moving}">
        <template v-if="itemData.Level < 3">
          <img src="@/assets/images/menu/setup.png" alt="">
          <span>管理子部门</span>
        </template>
      </div>
      <div class="icon" :class="{extend: isExtend, moving: moving}" @dblclick.stop>
        <el-icon v-if="itemData.children && itemData.children.length > 0" @click.stop="onExtendClick"><ArrowRight /></el-icon>
        <i v-else></i>
      </div>
    </div>
    <draggable
      :scroll="true"
      tag='ul'
      v-show="isExtend && departmentList"
      v-bind="dragOptions"
      v-model="localSortList"
      item-key="ID"
      group="tow">
      <template #item="{element}">
        <CityItemComp
          :departmentList='departmentList'
          :activeId='activeId'
          :item="element"
          :moving="moving"
          @active='onActiveIDClick'
          @subManage="onManageSubClick"
          @sortLast="val => element.children = val"
         />
      </template>
    </draggable>
  </li>
</template>

<script>
import draggable from 'vuedraggable';
import CityItemComp from './CityItemComp.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
    extendIds: { // 当前已展开的大区ID列表
      type: Array,
      default: () => [],
    },
    departmentList: { // 当前已展开的大区ID列表
      type: Array,
      default: () => [],
    },
    activeId: {
      default: '',
    },
    moving: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CityItemComp,
    draggable,
  },
  data() {
    return {
    };
  },
  computed: {
    isExtend() { // 是否已展开
      return this.extendIds.includes(this.itemData.ID);
    },
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.moving,
        ghostClass: 'ghost',
      };
    },
    localSortList: {
      get() {
        return this.itemData.children;
      },
      set(val) {
        this.$emit('sortLevel1', val);
      },
    },
  },
  methods: {
    onExtendClick() { // 展开|收起
      if (this.moving) return;
      this.$emit('extend', this.itemData.ID);
    },
    onActiveIDClick(id) { // 点击行加深颜色
      this.$emit('active', id);
    },
    onManageSubClick(ID) { // 管理子区域
      if (this.itemData.Level < 3 && !this.moving) {
        this.$emit('subManage', ID);
      }
    },
    secondLevelList() {
      return this.departmentList.filter(item => item.ParentID === this.itemData.ID);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-left-content-area-item-comp-wrap {
  font-size: 14px;
  > .header {
    display: flex;
    height: 40px;
    align-items: center;
    padding-left: 40px;
    padding-right: 25px;
    border-top: 1px solid #f5f5f5;
    user-select: none;
    > span {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > div {
      flex: none;
      display: flex;
      align-items: center;
      &.menu {
        margin-right: 24px;
        width: 98px;
        justify-content: space-between;
        color: #888;
        &:hover {
          cursor: pointer;
          color: #585858;
        }
        &.moving {
          cursor: move;
          color: #888;
        }
      }
      &.icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        > i {
          cursor: pointer;
        }
        &.extend {
          > i {
            transform: rotateZ(90deg);
          }
        }
        &.moving > i {
          cursor: move;
        }
      }
    }
  }
  &:hover {
    > .header {
      background-color: #e6e6e6;
      border-color: #e6e6e6;
      // transition: 0.1s;
    }
  }
  &:first-of-type {
    > .header {
      border: none;
    }
  }
  > ul {
    > li {
      > p.header {
        display: flex;
        padding-left: 70px;
        padding-right: 25px;
        height: 40px;
        align-items: center;
        box-sizing: border-box;
        border-top: 1px solid #fff;
        user-select: none;
        > span {
          flex: 1;
        }
        > i {
          flex: none;
          font-size: 18px;
          cursor: pointer;
          &.extend {
            transform: rotateZ(90deg);
          }
        }
      }
      &:hover {
        > p.header {
          background-color: #e6e6e6;
          // transition: 0.1s;
        }
      }
      > .countys {
        > span {
          display: block;
          height: 31px;
          padding-left: 100px;
          line-height: 30px;
          box-sizing: border-box;
          border-top: 1px solid #fff;
          font-size: 13px;
          &:hover {
            background-color: #e6e6e6;
            // transition: 0.1s;
          }
        }
      }
    }
  }
  &.other {
    pointer-events: none;
  }
}
</style>
