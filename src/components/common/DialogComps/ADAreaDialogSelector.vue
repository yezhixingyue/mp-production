<template>
  <DialogContainerComp
    :width="750"
    top="8vh"
    v-model:visible="localVisible"
    :title="`选择区域`"
    class="mp-erp-ad-area-dialog-selector-comp-wrap"
    primaryText="确定"

    :primaryClick="onSubmit"
    :closeClick="() => localVisible = false"
    :closed="onClosed"
  >
    <ADAreaTreeContentComp
      ref="oTreeWrap"
      v-if="localVisible"
      :defaultCheckedKeys="props.defaultCheckedKeys"
      :handleChangeFunc="selectChangeFunc"
     />
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import {
  ref, reactive, onMounted, computed, Ref,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

import { IDistrictTreeListItemType } from '@/store/modules/common/types';
import { useCommonStore } from '@/store/modules/common/index';
import ADAreaTreeContentComp from '../ADAreaTreeContentComp.vue';

interface Props {
  visible: boolean
  handleChangeFunc: (list) => void
  defaultCheckedKeys: number[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  handleChangeFunc: () => null,
  defaultCheckedKeys: () => [],
});
const emit = defineEmits(['update:visible', 'input']);
const commonStore = useCommonStore();
const localAreaList: Ref<IDistrictTreeListItemType[]> = ref([]);
const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
const selectChangeFunc = (list, b, c) => {
  console.log(list, b, c, 'a,b,c');
  localAreaList.value = list;
  // if (this.$refs.oTreeWrap && this.$refs.oTreeWrap.$refs.TreeComp) {
  //   this.$refs.oTreeWrap.$refs.TreeComp.clearTreeData();
  // }
};
const onClosed = () => {
  // if (this.$refs.oTreeWrap && this.$refs.oTreeWrap.$refs.TreeComp) {
  //   this.$refs.oTreeWrap.$refs.TreeComp.clearTreeData();
  // }
};

const onSubmit = () => {
 interface AreaListType {
  CountryID: number,
  ProvinceID: number,
  CityID: number,
  CountyID: number,
}
 const AreaList:AreaListType[] = [];
 localAreaList.value.forEach(item => {
   const AreaItem = {
     CountryID: 1,
     ProvinceID: 0,
     CityID: 0,
     CountyID: 0,
   };
   AreaItem.CountyID = item.ID;
   // 城市ID
   AreaItem.CityID = commonStore.DistrictList.find(it => it.ParentID === item.ParentID)?.ParentID as number;
   AreaItem.ProvinceID = commonStore.DistrictList.find(it => it.ID === AreaItem.CityID)?.ParentID as number;
   AreaList.push(AreaItem);
 });
 props.handleChangeFunc(AreaList);
 localVisible.value = false;
};
onMounted(() => {
  if (!commonStore.DistrictTreeList.length) {
    commonStore.getDistrictList();
  }
});
</script>
<style lang='scss'>
.mp-erp-ad-area-dialog-selector-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow: auto;
    padding-left: 30px;
    margin-right: 3px;
    &::-webkit-scrollbar {
      width: 6px;
      height: 8px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cbcbcb;
      border-radius: 3px;
      &:hover {
        background-color: #989898;
      }
    }
  }
}
</style>
