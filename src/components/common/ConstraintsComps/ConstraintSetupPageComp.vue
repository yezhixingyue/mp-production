<template>
  <section class="constraint-setup-page-comp-wrap">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <LRWidthDragAutoChangeComp :leftWidth='leftWidth' :single="!slotDefault">
        <template #left>
          <ConditionSetupPanel
            ref="oLeftPanel"
            v-if="PropertyListClassData.loaded"
            :condition="props.condition"
            :PropertyListClassData="PropertyListClassData"
          />
        </template>
        <template #right>
          <slot></slot>
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <mp-button type="primary" @click="submit">保存</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { getGoBackFun } from '@/router';
import { computed, ref, useSlots } from 'vue';
import LRWidthDragAutoChangeComp from '@/components/common/General/LRWidthDragAutoChangeComp.vue';
import { ConditionItemClass } from './ConditionSetupPanel/ConditionItemClass';
import ConditionSetupPanel from './ConditionSetupPanel/ConditionSetupPanel.vue';
import { PropertyListItemType } from './TypeClass/Property';
import { PropertyListClass } from './TypeClass/PropertyListClass';
import { IGetPropOptions } from './TypeClass/types';

const props = withDefaults(defineProps<{
  options?: IGetPropOptions
  PropertyList?: PropertyListItemType[], // options 和 PropertyList 应必传一个  传options时会自动获取属性列表
  condition: ConditionItemClass | null,
  leftWidth?: string,
}>(), {
  leftWidth: '45%',
});
const emit = defineEmits(['submit']);

const slotDefault = !!useSlots().default;

const leftWidth = computed(() => (slotDefault ? props.leftWidth : '100%'));

const PropertyListClassData = ref(new PropertyListClass({ options: props.options, PropertyList: props.PropertyList }));

const oLeftPanel = ref<InstanceType<typeof ConditionSetupPanel>>();

const submit = () => {
  if (oLeftPanel.value) {
    const temp = oLeftPanel.value.getPanelConstraintData();
    if (temp === null) return;
    emit('submit', temp);
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.constraint-setup-page-comp-wrap {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 20px;
  > header {
    padding: 13px 0;
  }
  > main {
    flex: 1;
    overflow: auto;
    @include scroll;
    padding-right: 20px;
    padding-left: 1px;
    padding-top: 15px;
  }
  > footer {
    margin-top: 20px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px
  }
  > header, > footer {
    flex: none;
    :deep(.mp-button) {
      height: 30px;
      border-radius: 3px;
      min-width: 120px;
    }
    .blue {
      margin-left: 30px;
    }
  }
}
</style>
