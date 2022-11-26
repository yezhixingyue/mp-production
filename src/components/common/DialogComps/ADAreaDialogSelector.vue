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
    <!-- @open="onOpen" -->
    <ADAreaTreeContentComp
      ref="oTreeWrap"
      :value="localAreaList"
      @change="(list) => localAreaList = list"
      :treeType='treeType'
      :displayLevel2='displayLevel2'
      :productClassifyType='productClassifyType'
     />
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import {
  ref, onMounted, computed, watch,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IAreaList } from '@/views/productionSetting/deliveryTimeManage/types';
import { useCommonStore } from '@/store/modules/common/index';
import ADAreaTreeContentComp from '../ADAreaTreeContentComp.vue';

interface Props {
  visible: boolean
  value:IAreaList[]
  treeType?:string
  AreaDescribe:string
  productClassifyType?:number
  displayLevel2?:boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  value: () => [],
  treeType: 'area',
  AreaDescribe: '',
  productClassifyType: 0,
  displayLevel2: false,
});

const emit = defineEmits(['update:visible', 'change', 'update:AreaDescribe']);
const commonStore = useCommonStore();

// const oTreeWrap:Ref = ref(null);
const oTreeWrap = ref<InstanceType<typeof ADAreaTreeContentComp>>();

const localAreaList = ref<IAreaList[]>([]);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});
const onClosed = () => {
  if (oTreeWrap.value && oTreeWrap.value?.TreeCompRef) {
    oTreeWrap.value?.TreeCompRef.clearTreeData();
  }
};

const onSubmit = () => {
  emit('change', [...localAreaList.value]);
  emit('update:AreaDescribe', oTreeWrap.value?.getTextDisplayContent());
  localVisible.value = false;
};
watch(() => localVisible.value, (newVal) => {
  if (newVal) {
    localAreaList.value = [...props.value];
  }
});
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
