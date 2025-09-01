<template>
  <DialogContainerComp v-model:visible='localVisible' class="mp-prod-condition-prop-select-dialog-wrap" autoClose title="属性选择"
    :show-primary="false" top="10vh" @open="onOpen" :width="800">
    <!-- 创建手写参数 -->
    <section v-if="writablePropertyRuleForm" class="writable-box">
      <header class="mp-common-title-wrap black">创建常量参数</header>
      <main>
        <span>参数名：</span>
        <el-input maxlength="30" size="small" style="width: 120px;" v-model.trim="writablePropertyRuleForm.DisplayContent"></el-input>
        <span class="ml-30">单位：</span>
        <el-input maxlength="10" size="small" style="width: 80px;margin-right: 40px;" v-model.trim="writablePropertyRuleForm.Unit"></el-input>
        <mp-button type="primary" style="width: 86px;" @click="onWritableClick">+ 添加</mp-button>
      </main>
    </section>

    <RenderItem v-for="it in propertyTreeData" :key="it.ID" :item='it' @item-click="onPropClick" :selectedIds='selectedIds' />
    <mp-empty description="暂无数据" v-if="propertyTreeData.length === 0 && !writableProperty"  />
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import RenderItem from './RenderItem.vue';
import { PropertyListItemType } from '../TypeClass/Property';
import { PropertyListClass } from '../TypeClass/PropertyListClass';
import { WritablePropertyRuleForm } from './WritablePropertyRuleForm';

const props = withDefaults(defineProps<{
  visible: boolean,
  propertyList: PropertyListItemType[],
  selectedIds?: string[],
  closeBySelf?: boolean,
  writableProperty?: PropertyListItemType
  /** 已写入的常量参数名称列表 - 用于重复性判断 */
  WrittenPropertyNames?: string[]
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

const writablePropertyRuleForm = ref<WritablePropertyRuleForm | null>(null);

const onOpen = () => {
  writablePropertyRuleForm.value = props.writableProperty ? new WritablePropertyRuleForm(props.writableProperty) : null;
};

const onWritableClick = () => {
  if (!writablePropertyRuleForm.value) return;

  const property = writablePropertyRuleForm.value.getParams(props.WrittenPropertyNames);
  if (!property) return;

  emit('select', property);
  localVisible.value = false;
};
</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';
.mp-prod-condition-prop-select-dialog-wrap {
  > .el-dialog__body {
    height: 500px;
    padding-top: 20px;
    overflow: auto;
    margin: 8px;
    @include scroll;

    .render-item {
      padding: 0 15px;
    }

    .writable-box {
      font-size: 14px;
      color: #444;
      margin-bottom: 15px;
      margin-left: 15px;
      .el-input {
        input {
          line-height: 30px;
          height: 30px;
        }
      }

      > header {
        margin-bottom: 15px;
      }

      > main {
        display: flex;
        align-items: center;
        margin-left: 13px;
      }
    }

    .el-input {
      --el-input-border-radius: 2px;
    }
  }
}
</style>
