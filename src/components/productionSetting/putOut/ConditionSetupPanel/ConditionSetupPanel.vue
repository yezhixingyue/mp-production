<template>
  <section class="condition-setup-panel-wrap" v-if="ruleForm.Constraint">
    <Header @click="visible = true" />
    <Main :constraint="ruleForm.Constraint" @remove="onItemRemove" ref="oWrap" />
    <Footer v-model="ruleForm.Constraint.FilterType" />
    <Dialog v-model:visible="visible" :propertyList="props.PropertyListClassData.PropertyList" @select="onPropSelect" />
  </section>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';
import Header from './ConditionSetupPanelHeader.vue';
import Main from './ConditionSetupPanelMain.vue';
import Footer from './ConditionSetupPanelFooter.vue';
import Dialog from '../ConditionPropSelectDialog/ConditionPropSelectDialog.vue';
import { PropertyListClass } from '../TypeClass/PropertyListClass';
import { PropertyListItemType } from '../TypeClass/Property';
import { ConstraintsItemClass } from './ConstraintsItemClass';
import { ConditionItemClass } from './ConditionItemClass';

const visible = ref(false);

const props = defineProps<{
  PropertyListClassData: PropertyListClass
  condition: ConditionItemClass | null
}>();

const ruleForm = ref(new ConditionItemClass(props.condition || null, props.PropertyListClassData.PropertyList));

const oWrap = ref<InstanceType<typeof Main>>();

const onPropSelect = async (prop: PropertyListItemType) => {
  if (!ruleForm.value.Constraint) return;
  const item = new ConstraintsItemClass({ prop });
  ruleForm.value.Constraint.ItemList.push(item);
  await nextTick();
  if (oWrap.value) oWrap.value.scroll();
};

const onItemRemove = (i: number) => {
  ruleForm.value.Constraint?.ItemList.splice(i, 1);
};

const getPanelConstraintData = () => {
  if (!ruleForm.value.Constraint) return null;
  ruleForm.value.Constraint.ItemList.forEach((it) => {
    const _it = it;
    _it._errMsg = '';
  });
  for (let i = 0; i < ruleForm.value.Constraint.ItemList.length; i += 1) {
    const item = ruleForm.value.Constraint.ItemList[i];
    const res = item.validate();
    if (res !== true) return null;
  }
  return ruleForm.value;
};

defineExpose({
  getPanelConstraintData,
});

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.condition-setup-panel-wrap {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0 10px;
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
    height: 60px;
    :deep(.el-radio-button:not(.is-active)) {
      .el-radio-button__inner {
        color: #444;
      }
    }
  }
  > header, > footer {
    flex: none;
    :deep(.el-radio-button) {
      height: 30px;
      .el-radio-button__inner {
        height: 30px;
        width: 150px;
        line-height: 30px;
        padding: 0;
        font-size: 13px;
        padding-right: 10px;
        .el-icon {
          vertical-align: -2px;
          margin-right: 3px;
          font-size: 14px;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }
      }
      &.is-active .el-radio-button__inner .el-icon {
        opacity: 1;
      }
      &:first-of-type .el-radio-button__inner {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }
      &:last-of-type .el-radio-button__inner {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
      }
    }
  }
}
</style>
