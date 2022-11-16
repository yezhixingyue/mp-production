<template>
  <DialogContainerComp v-model:visible='localVisible' class="wrap" autoClose title="属性选择" :show-primary="false" top="12vh" @open="onOpen" :width="700">
    <RenderItem v-for="it in propertyTreeData" :key="it.ID" :item='it' @item-click="onPropClick" />
    <mp-empty description="暂无数据" v-if="propertyTreeData.length === 0"  />
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RenderItem from './RenderItem.vue';
import { PropertyListItemType } from '../TypeClass/Property';
import { PropertyListClass } from '../TypeClass/PropertyListClass';

const props = withDefaults(defineProps<{
  visible: boolean,
  propertyList: PropertyListItemType[],
  closeBySelf?: boolean,
}>(), {
  visible: false,
  closeBySelf: true, // 是否在点击属性后自动关闭弹窗 默认true
});

const emit = defineEmits(['update:visible', 'select']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const propertyTreeData = computed(() => PropertyListClass.getGroupedPropertyListData(props.propertyList));

const onPropClick = (prop: PropertyListItemType) => {
  emit('select', prop);
  if (props.closeBySelf) localVisible.value = false;
};

const onOpen = () => {
  // console.log('onOpen', propertyTreeData, props.propertyList);
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';
.wrap {
  .el-dialog__body {
    height: 450px;
    padding-top: 20px;
    overflow: auto;
    margin: 8px;
    @include scroll;
    .render-item {
      padding: 0 15px;
    }
  }
}
</style>
