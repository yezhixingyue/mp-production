<template>
  <TreeComp
    class="mp-erp-ad-area-content-selector-comp-for-new-wrap"
    :class="`${treeType} ${displayLevel2?'displayLevel2':''}`"
    :title="`${treeType==='area' ? '行政区域' : '产品'}`"
    :treeList="allLevelList"
    :defaultCheckedKeys="defaultCheckedKeys"
    :handleChangeFunc="handleAreaChangeFunc"
    :watchValue="'sss'"
    :shouldDisabledList="[]"
    :showDisabled="false"
    :checkAllTitle="`所有${treeType==='area' ? '地区' : '产品'}`"
    :defaultProps="defaultProps"
    ref="TreeCompRef"
  />
</template>

<script lang="ts" setup>
import {
  ref, onMounted, computed, defineExpose,
} from 'vue';
import TreeComp from '@/components/common/TreeComp.vue';
import { useCommonStore } from '@/store/modules/common/index';

const commonStore = useCommonStore();
interface AreaListType {
  CountryID: number,
  ProvinceID: number,
  CityID: number,
  CountyID: number,
}
interface Props {
  value:AreaListType[]
  treeType?:string
  productClassifyType?:number
  displayLevel2?:boolean
  defaultLabels?:boolean
}
console.log(commonStore.DistrictList, 'DistrictList');
const emit = defineEmits(['change']);
const TreeCompRef = ref<InstanceType<typeof TreeComp>>();
const props = withDefaults(defineProps<Props>(), {
  value: () => [],
  treeType: 'area',
  productClassifyType: 0,
  displayLevel2: false,
});
const defaultPropKeys = computed(() => {
  // if (props.defaultLabels) {
  //   return props.defaultLabels;
  // }
  if (props.treeType === 'area') {
    return {
      rootKey: 'CountryID',
      lv1Key: 'ProvinceID',
      lv2Key: 'CityID',
      lv3Key: 'CountyID',
    };
  }
  return {
    rootKey: '',
    lv1Key: 'FirstLevelID',
    lv2Key: 'SecondLevelID',
    lv3Key: 'ProductID',
  };
});
const allLevelList = computed(() => commonStore.DistrictTreeList);
const spreadList = computed(() => commonStore.DistrictList);
const lv3KeyEmptyValue = computed(() => (props.treeType === 'product' ? '00000000-0000-0000-0000-000000000000' : 0));
const AllLevel3AreaKeysList = computed(() => {
  if (spreadList.value.length === 0) return [];
  return spreadList.value.filter((it) => it.Level === 3).map(it => it.ID);
});

const getDefaultCheckedKeys = (value) => {
  const list:number[] = [];
  if (Array.isArray(value) && value.length > 0) {
    if (value.length === 1) {
      if (value[0][defaultPropKeys.value.lv1Key] === 0) return AllLevel3AreaKeysList.value;
    }
    value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
      if (it[defaultPropKeys.value.lv2Key] === 0) { // 全省
        const lv1 = allLevelList.value.find(_it => _it.ID === it[defaultPropKeys.value.lv1Key]);
        if (lv1) {
          lv1.children?.forEach(lv2 => {
            list.push(...lv2.children?.map(lv3 => lv3.ID) as number[]);
          });
        }
      } else if (it[defaultPropKeys.value.lv3Key] === lv3KeyEmptyValue.value) { // 全市
        const lv1 = allLevelList.value.find(_it => _it.ID === it[defaultPropKeys.value.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children?.find(_it => _it.ID === it[defaultPropKeys.value.lv2Key]);
          if (lv2) {
            if (lv2.children) {
              list.push(...lv2.children.map(lv3 => lv3.ID) as number[]);
            }
          }
        }
      } else { // 单个城区
        list.push(it[defaultPropKeys.value.lv3Key]);
      }
    });
  }
  return list;
};
const createItem = (rootVal, lv1Val, lv2Val, lv3Val) => {
  const temp = {
    [defaultPropKeys.value.lv1Key]: lv1Val,
    [defaultPropKeys.value.lv2Key]: lv2Val,
    [defaultPropKeys.value.lv3Key]: lv3Val,
  };
  if (defaultPropKeys.value.rootKey) {
    temp[defaultPropKeys.value.rootKey] = rootVal;
  }
  return temp;
};
const allStateItem = computed(() => createItem(1, 0, 0, lv3KeyEmptyValue.value));

const defaultCheckedKeys = computed(() => getDefaultCheckedKeys(props.value)); // 差还原keys 还原后该组件即可使用
const Level1AreaList = computed(() => {
  if (spreadList.value.length === 0) return [];
  return spreadList.value.filter((it) => it.Level === 1);
});
const Level2AreaList = computed(() => {
  if (spreadList.value.length === 0) return [];
  return spreadList.value.filter((it) => it.Level === 2);
});

const handleAreaChangeFunc = (checkedNodes, checkedKeys, isAll) => {
  console.log(checkedNodes, checkedKeys, isAll, 'checkedNodes, checkedKeys, isAll');

  if (checkedNodes.length === 0) {
    emit('change', []);
    return;
  }
  if (isAll) {
    emit('change', [{ ...allStateItem.value }]);
    return;
  }
  interface _lvList {
    [a:string]: number | string
  }
  const _lv1List:_lvList[] = [];
  const _lv2List:_lvList[] = [];
  const _lv3List:_lvList[] = [];
  const _level1List = checkedNodes.filter((it) => it.Level === 1); // 已选全部城市的省份列表
  _level1List.forEach(lv1 => {
    _lv1List.push(createItem(1, lv1.ID, 0, lv3KeyEmptyValue.value));
  });
  if (Level1AreaList.value.length === _lv1List.length && _lv1List.length > 0) {
    emit('change', [{ ...allStateItem.value }]);
    return;
  }
  const _level1IDList = _level1List.map(it => it.ID);
  const _level2List = checkedNodes.filter((it) => it.Level === 2); // 已选全部城区的城市列表
  _level2List.forEach(lv2 => {
    if (!_level1IDList.includes(lv2.ParentID)) {
      _lv2List.push(createItem(1, lv2.ParentID, lv2.ID, lv3KeyEmptyValue.value));
    }
  });
  const _level2IDList = _level2List.map(it => it.ID);
  const _level3list = checkedNodes.filter((it) => it.Level === 3 && !_level2IDList.includes(it.ParentID));
  // 生成3级目录并加入
  _level3list.forEach(lv3 => {
    const t = Level2AreaList.value.find(it => it.ID === lv3.ParentID);
    if (t) {
      _lv3List.push(createItem(1, t.ParentID, lv3.ParentID, lv3.ID));
    }
  });
  const list = [..._lv1List, ..._lv2List, ..._lv3List];
  emit('change', list);
};
const getTreeTextDisplayContent = (value, allAdAreaTreeList, type, defaultLabels) => {
  let defaultPropKeys = {
    rootKey: 'CountryID',
    lv1Key: 'ProvinceID',
    lv2Key: 'CityID',
    lv3Key: 'CountyID',
  };
  if (type === 'product') {
    defaultPropKeys = {
      rootKey: 'root',
      lv1Key: 'FirstLevelID',
      lv2Key: 'SecondLevelID',
      lv3Key: 'ProductID',
    };
  }
  if (defaultLabels) {
    defaultPropKeys = defaultLabels;
  }
  let title = '全部';
  if (type === 'area') title = '全部区域';
  if (type === 'product') title = '全部产品';
  const labelName = type === 'product' ? 'ClassName' : 'Name';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list:any[] = [];
  if (Array.isArray(value) && value.length > 0) {
    value.forEach(it => { // 可能为省全部、市全部 也可能为单个城区
      if (it[defaultPropKeys.lv1Key] === 0) { // 全部区域
        list.push(title);
      } else if (it[defaultPropKeys.lv2Key] === 0) { // 全省
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) list.push(lv1[labelName]);
      } else if (it[defaultPropKeys.lv3Key] === 0 || it[defaultPropKeys.lv3Key] === '00000000-0000-0000-0000-000000000000') { // 全市
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find(_it => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const item = { [labelName]: lv2[labelName], CountyList: [] };
            const t = list.find(_item => _item.Province === lv1[labelName]);
            if (t) {
              t.CityList.push(item);
            } else {
              const temp = {
                Province: lv1[labelName],
                CityList: [item],
              };
              list.push(temp);
            }
          }
        }
      } else { // 单个城区
        const lv1 = allAdAreaTreeList.find(_it => _it.ID === it[defaultPropKeys.lv1Key]);
        if (lv1) {
          const lv2 = lv1.children.find(_it => _it.ID === it[defaultPropKeys.lv2Key]);
          if (lv2) {
            const lv3 = lv2.children.find(_it => _it.ID === it[defaultPropKeys.lv3Key]);
            if (lv3) {
              const _ProvinceItem = list.find(_item => _item.Province === lv1[labelName]);
              if (_ProvinceItem) {
                const _CityItem = _ProvinceItem.CityList.find(city => city[labelName] === lv2[labelName]);
                if (_CityItem) {
                  _CityItem.CountyList.push(lv3[labelName]);
                } else {
                  _ProvinceItem.CityList.push({ [labelName]: lv2[labelName], CountyList: [lv3[labelName]] });
                }
              } else {
                const temp = {
                  Province: lv1[labelName],
                  CityList: [{ [labelName]: lv2[labelName], CountyList: [lv3[labelName]] }],
                };
                list.push(temp);
              }
            }
          }
        }
      }
    });
  }
  return list.map(it => {
    if (typeof it === 'string') return it;
    const { Province, CityList } = it;
    return `${Province}：[${CityList.map(city => {
      const { CountyList } = city;
      if (CountyList.length === 0) return `${city[labelName]}${title}`;
      const _Name = city[labelName] === Province ? '' : `${city[labelName]}：`;
      const CountyListContent = CountyList.join('、');
      return `${_Name}${CountyListContent}`;
    }).join('、')}]`;
  }).join('\r\n');
};

const getTextDisplayContent = () => getTreeTextDisplayContent(props.value, allLevelList.value, props.treeType, defaultPropKeys.value);// 获取选中区域文字展示
defineExpose({ getTextDisplayContent, TreeCompRef });
onMounted(() => {
  if (!commonStore.DistrictTreeList.length) {
    commonStore.getDistrictList();
  }
});

// -------------------
const defaultProps = {
  children: 'children',
  label: 'Name',
};
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
                height: 30px;
                > .el-tree-node__content {
                  color: $--color-text-primary;
                  width: auto;
                  display: flex;
                  &:hover {
                    background-color: #fff !important;
                  }
                  .el-tree-node__label {
                    font-size: 12px;
                  }
                  .el-checkbox{
                    height: 20px;
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
              line-height: 20px;
              align-items: flex-start;
              .el-tree-node__label {
                font-size: 12px;
              }
              .el-checkbox{
                height: 20px;
              }
              &:hover {
                background-color: #fff !important;
              }
            }
            .el-tree-node__content{
              margin-top: 3px;
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
          height: 30px;
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
  &.isProduct {
    > .content > .el-tree > .el-tree-node > .el-tree-node__children
    > .el-tree-node .el-tree-node__children > .el-tree-node > .el-tree-node__content {
      width: 8em;
    }
    > .content > .el-tree > .el-tree-node > .el-tree-node__children
    > .el-tree-node > .el-tree-node__content {
      width: 7em;
    }
  }
}
</style>
