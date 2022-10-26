<template>
  <section
   class="mp-common-comps-tree-comp-wrap">
    <header>
      {{title}}<span v-if="title">：</span>
    </header>
    <div class="content mp-scroll-wrap">
      <el-checkbox
        v-model="checkAllComputed"
        :disabled='isCheckAllDisabled'
        :indeterminate='checkAllIndeterminate'
        @change="handleCheckAllChange">
        {{checkAllTitle}}
      </el-checkbox>
      <el-tree
        :data="treeData"
        show-checkbox
        icon-class
        :node-key="'ID'"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        :auto-expand-parent="false"
        @check="check"
        ref="treeComp"
        class="mp-scroll-wrap"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :render-content="renderContent"
      ></el-tree>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { IDistrictTreeListItemType } from '@/store/modules/common/types';
import {
  ref, Ref, computed, watch,
} from 'vue';
import { IDistrictItem } from '@/assets/Types/common';

interface defaultPropsType {
    children:string,
    label: string,
}
interface Props {
  title: string
  treeList: IDistrictTreeListItemType[]
  defaultProps: defaultPropsType,
  defaultCheckedKeys: string[] | number[],
  handleChangeFunc: (checkedNodes: IDistrictItem[], checkedKeys: number[], isAll: boolean) => void,
  shouldDisabledList: string[],
  showDisabled: boolean,
  checkAllTitle: string,
  watchValue: string,
}

const props = withDefaults(defineProps<Props>(), {
  title: '销售区域',
  treeList: () => [],
  defaultProps: () => ({
    children: 'children',
    label: 'ClassName',
  }),
  defaultCheckedKeys: () => [],
  handleChangeFunc: () => null,
  shouldDisabledList: () => [],
  showDisabled: false,
  checkAllTitle: '所有地区',
  watchValue: '所有地区',
});

const treeComp:Ref = ref(null);

const checkAll = ref(false);
const selectKeys:Ref<number[]|string[] > = ref([]);
const localDisabled2CheckAll = ref(true);
const canFalse = ref(true);

const defaultExpandedKeys = computed(() => {
  if (props.treeList.length === 0 || !props.treeList) return [];
  const _list:number[] = [];
  props.treeList.forEach(level1 => {
    level1.children?.forEach(level2 => {
      _list.push(level2.ID);
    });
  });
  return _list;
});
const treeData = computed(() => props.treeList);
const threeLevelKeys = computed(() => {
  const _arr:number[] = [];
  treeData.value.forEach(l1 => {
    l1.children?.forEach(l2 => {
      l2.children?.forEach(l3 => {
        _arr.push(l3.ID);
      });
    });
  });
  return _arr;
});
const AllKeys = computed(() => {
  const _arr:number[] = [];
  treeData.value.forEach(l1 => {
    _arr.push(l1.ID);
    l1.children?.forEach(l2 => {
      _arr.push(l2.ID);
      l2.children?.forEach(l3 => {
        _arr.push(l3.ID);
      });
    });
  });
  return _arr;
});
const isCheckAllDisabled = computed(() => {
  const _arr:number[] = [];
  treeData.value.forEach(l1 => {
    l1.children?.forEach(l2 => {
      l2.children?.forEach(l3 => {
        _arr.push(l3.ID);
      });
    });
  });
  return (_arr.length === props.shouldDisabledList.length)
       && localDisabled2CheckAll.value;
});
const checkAllIndeterminate = computed(() => props.defaultCheckedKeys.length > 0
       && props.defaultCheckedKeys.length < threeLevelKeys.value.length);
const checkAllComputed = computed({
  get() {
    // return this.checkAll;
    return props.defaultCheckedKeys.length === threeLevelKeys.value.length;
  },
  set(newVal) {
    // console.log(newVal, 'newVal checkAllComputed');
    if (!newVal && canFalse.value) checkAll.value = false;
    else if (checkAllIndeterminate.value) {
      checkAll.value = false;
      canFalse.value = false;
    } else {
      checkAll.value = true;
      canFalse.value = true;
    }
  },
});
const setCheckAllListAndStatus = (checkedKeys) => {
  selectKeys.value = checkedKeys;
  if (selectKeys.value.length === AllKeys.value.length) {
    checkAll.value = true;
  } else if (checkAll.value === true) {
    checkAll.value = false;
  }
};
const check = (curItem, { checkedNodes, checkedKeys }) => {
  props.handleChangeFunc(checkedNodes, checkedKeys, checkedKeys.length === AllKeys.value.length);
  setCheckAllListAndStatus(checkedKeys);
};
const expandLevel1 = (node, data, text, e) => {
  e.stopPropagation();
  // eslint-disable-next-line no-param-reassign
  node.expanded = !node.expanded;
};
const renderContent = (h, { node, data }) => {
  if (node.level > 1) {
    if (node.label.length > 5) {
      return h(
        'el-tooltip',
        {
          class: 'el-tree-node__label',
          effect: 'dark',
          content: node.label,
          placement: 'top-start',
        },
        h('span', null, node.label),
      );
    }
    return h('span', { class: 'el-tree-node__label' }, node.label);
  }
  const text = !node.expanded ? '展开' : '收起';
  const classIcon = !node.expanded
    ? 'el-icon-caret-bottom'
    : 'close el-icon-caret-bottom';
  return h(
    'span',
    { class: 'el-tree-node__label' },
    h('span', { class: 'title' }, node.label),
    h('em', {
      class: 'mp-el-tree-node-collapse-btn',
      onClick: (e) => expandLevel1(node, data, text, e),
    }, text),
    h('span', {
      class: 'icon-box',
      onClick: (e) => e.stopPropagation(),
    }, h('em', { onClick: (e) => expandLevel1(node, data, text, e) }, h('i', { class: classIcon }))),
  );
};

const handleCheckAllChange = () => {
  console.log(checkAll.value, 'checkAllcheckAllcheckAll');

  if (checkAll.value) {
    treeComp.value.setCheckedNodes(treeData.value);
    selectKeys.value = AllKeys.value;
    const checkedNodes = treeComp.value.getCheckedNodes();
    const checkedKeys = treeComp.value.getCheckedKeys();
    props.handleChangeFunc(checkedNodes, checkedKeys, true); // 第三个代表全部选中
  } else {
    treeComp.value.setCheckedKeys([]);
    selectKeys.value = [];
    props.handleChangeFunc([], [], false);
  }
};

const clearTreeData = () => {
  treeComp.value.setCheckedKeys([]);
  selectKeys.value = [];
};
defineExpose({ clearTreeData });
watch(() => props.watchValue, () => {
  localDisabled2CheckAll.value = true;
}, {
  immediate: true,
});
watch(() => props.defaultCheckedKeys, (newVal) => {
  localDisabled2CheckAll.value = true;
  if (newVal && Array.isArray(newVal) && newVal.length === 0 && selectKeys.value.length > 0) {
    treeComp.value.setCheckedKeys([]);
    selectKeys.value = [];
    checkAll.value = false;
  } else if (newVal && Array.isArray(newVal) && newVal.length > 0 && newVal.length !== selectKeys.value.length) {
    treeComp.value.setCheckedKeys(newVal);
    selectKeys.value = newVal;
  }
});
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-tree-comp-wrap {
  display: flex;
  flex-direction: column;
  user-select: none;
  > header {
    font-size: 14px;
    color: $--color-text-primary;
    line-height: 26px;
    flex: none;
    margin-bottom: 5px;
  }
  > .content {
    > .el-tree {
      min-width: 120px;
      .el-tree-node__expand-icon {
        display: none;
      }
      > .el-tree-node {
        // width: 100px;
        line-height: 32px;
        > .el-tree-node__children {
          > .el-tree-node {
            display: flex;
            .el-tree-node__children {
              display: flex;
              flex-wrap: wrap;
              padding-top: 1px;
              > .el-tree-node {
                > .el-tree-node__content {
                  color: $--color-text-primary;
                  width: auto;
                  display: inline-block;
                  &:hover {
                    background-color: #fff !important;
                  }
                  .el-tree-node__label {
                    font-size: 12px;
                  }
                  padding-left: 0px !important;
                  width: 5.3em;
                  height: 20px;
                  line-height: 20px;
                  overflow: hidden;
                  // text-overflow: ellipsis;
                  white-space: nowrap
                }
              }
            }
            > .el-tree-node__content {
              color: $--color-text-primary;
              font-weight: 600;
              width: 5em;
              overflow: hidden;
              flex: none;
              height: 32px;
              line-height: 26px;
              display: inline-block;
              .el-tree-node__label {
                font-size: 12px;
              }
              display: inline-block;
              &:hover {
                background-color: #fff !important;
              }
            }
          }
        }
        > .el-tree-node__content {
          color: $--color-text-primary;
          font-weight: 600;
          // .el-tree-node__label {
          //   font-size: 13px;
          // }
          // width: auto;
          // width: 100px;
          display: inline-block;
          height: 32px;
          line-height: 32px;
          &:hover {
            background-color: #fff !important;
          }
          display: flex;
          > .el-tree-node__label {
            flex: 1;
            min-width: 130px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span.title {
              width: 5em;
            }
            > .mp-el-tree-node-collapse-btn {
              padding-left: 20px;
              font-size: 12px;
              font-weight: 400;
              flex: none;
              user-select: none;
              color: $--color-text-primary;
              line-height: 28px;
            }
            > span.icon-box {
              flex: 1;
              > em {
                padding-right: 20px;
                padding-left: 4px;
                height: 100%;
                > .el-icon-caret-bottom {
                  color: $--color-text-secondary;
                  font-size: 19px;
                  line-height: 21px;
                  position: relative;
                  top: 2px;
                  transition: all 0.1s !important;
                  transform-origin: center;
                  &.close {
                    transform: rotate(180deg);
                    // top: 3px;
                  }
                }
              }
            }
          }
        }
        .el-tree-node__children {
          flex: 1;
          // pointer-events: none;
        }
      }
    }
    > .el-checkbox {
      padding-bottom: 8px;
      .el-checkbox__label {
        font-size: 14px;
        color: #444;
        font-weight: 600;
        padding-left: 8px;
      }
    }
  }
  span.is-indeterminate.el-checkbox__input {
    > .el-checkbox__inner {
      background-color: $--color-text-secondary;
      border-color: $--color-text-secondary;
      &::before {
        box-sizing: content-box;
        content: "";
        border: 1px solid #FFFFFF;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        width: 3px;
        transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
        transform: rotate(45deg) scaleY(1);
        transform-origin: center;
        background-color: $--color-text-secondary;
      }
    }
  }
}
</style>
