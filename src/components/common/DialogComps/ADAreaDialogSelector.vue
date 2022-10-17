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
      v-model="localAreaList"
      v-if="localVisible"
      :defaultCheckedKeys="props.defaultCheckedKeys"
      :handleChangeFunc="props.handleChangeFunc"
     />
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import {
  ref, reactive, onMounted, computed, Ref,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

import { IDistrictTreeListItemType } from '@/store/modules/common/types';
import ADAreaTreeContentComp from '../ADAreaTreeContentComp.vue';

interface Props {
  visible: boolean
  value: (checkedNodes:number[], checkedKeys:number[], bool?:boolean) => void
  handleChangeFunc: (checkedNodes:number[], checkedKeys:number[], bool?:boolean) => void
  defaultCheckedKeys: number[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  value: () => [],
  handleChangeFunc: () => null,
  defaultCheckedKeys: () => [],
});
const emit = defineEmits(['update:visible', 'input']);
const localAreaList: Ref<IDistrictTreeListItemType[]> = ref([]);
const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
const onClosed = () => {
  // if (this.$refs.oTreeWrap && this.$refs.oTreeWrap.$refs.TreeComp) {
  //   this.$refs.oTreeWrap.$refs.TreeComp.clearTreeData();
  // }
};

const onSubmit = () => {
  emit('input', [...localAreaList.value]);
  // content.emit('update:AreaDescribe', this.$refs.oTreeWrap.getTextDisplayContent());
  localVisible.value = false;
};
// export default {
//   props: {
//     visible: {
//       type: Boolean,
//       default: false,
//     },
//     value: {
//       type: Array,
//       default: () => [],
//     },
//     handleChangeFunc: {
//       type: Function,
//       default: () => null,
//     },
//   },
//   components: {
//     DialogContainerComp,
//     ADAreaTreeContentComp,
//   },
//   setup(props, content) {
//     return {
//       localVisible,
//       localAreaList,
//       onClosed,
//       onOpen,
//       onSubmit,
//     };
//   },
// };
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
