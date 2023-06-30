<template>
  <DialogContainerComp
    :width="750"
    top="8vh"
    v-model:visible="localVisible"
    :title="`选择区域`"
    class="mp-erp-ad-area-dialog-selector-comp-wrap"
    primaryText="确定"
    @open="onOpen"
    :primaryClick="onSubmit"
    :closeClick="() => localVisible = false"
    :closed="onClosed"
    >
    <!-- @open="onOpen" -->
    <ADAreaTreeContentComp
      ref="oTreeWrap"
      v-model="localAreaList"
      :treeType='treeType'
      :displayLevel2='displayLevel2'
      :productClassifyType='productClassifyType'
     />
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IAreaList } from '@/views/productionSetting/deliveryTimeManage/types';
import { useCommonStore } from '@/store/modules/common/index';
import ADAreaTreeContentComp from '../ADAreaTreeContentComp.vue';

interface Props {
  visible: boolean
  modelValue:IAreaList[]
  treeType?:string
  AreaDescribe:string
  productClassifyType?:number
  displayLevel2?:boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  modelValue: () => [],
  treeType: 'area',
  AreaDescribe: '',
  productClassifyType: 0,
  displayLevel2: false,
});

const emit = defineEmits(['update:visible', 'update:modelValue', 'update:AreaDescribe']);
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
  emit('update:modelValue', [...localAreaList.value]);
  emit('update:AreaDescribe', oTreeWrap.value?.getTextDisplayContent());
  localVisible.value = false;
};

const onOpen = () => {
  localAreaList.value = [...props.modelValue];

  if (oTreeWrap.value && oTreeWrap.value?.TreeCompRef) {
    oTreeWrap.value?.TreeCompRef.redrawTreeData();
  }
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
