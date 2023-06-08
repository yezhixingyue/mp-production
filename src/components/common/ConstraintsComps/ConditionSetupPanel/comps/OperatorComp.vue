<template>
  <div class="operator-box">
    <!-- 单个关系且选中时 -->
    <span class="t mr-10" v-if="operatorList.length === 1 && value === operatorList[0].ID">{{operatorList[0].Name}}</span>
    <!-- 有多种关系时 -->
    <el-select v-model="value" v-else>
      <el-option
          v-for="it in operatorList"
          :key="it.ID"
          :label="it.Name"
          :value="it.ID"
        />
    </el-select>
    <!-- 为选项类型时的特定展示文字 -->
    <span class="t ml-10" v-if="operatContent">{{operatContent}}</span>
    <!-- 为选项类型时 弹窗选择 -->
    <div v-if="operatContent && OptionList.length > 4" class="op-d-box">
      <span class="is-blue-span mr-10" @click="visible = true">选择</span>
      <span class="d-content" :title="localValueListContent.replaceAll('、', '\r\n')">{{localValueListContent}}</span>
      <OptionSelectDialog v-model:visible="visible" v-model="localValueList" :FixedType="item.Property?.FixedType" :OptionList="OptionList" />
    </div>
    <!-- 为选项类型时 复选框选择 -->
    <div v-if="operatContent && OptionList.length <= 4" class="op-c-box">
      <el-checkbox-group v-model="localValueList" class="c">
        <el-checkbox v-for="it in OptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import OptionSelectDialog from './OptionSelectDialog/OptionSelectDialog.vue';
import { OperatorMpEnumList, PropertyValueTypeEnum } from '../../TypeClass/enum';
import { ConstraintsItemClass } from '../ConstraintsItemClass';
import { getConstraintsItemValue, getgetConstraintsItemSubmitValue } from './utils';

const props = defineProps<{
  item: ConstraintsItemClass
}>();

const emit = defineEmits(['update:modelValue', 'update:valueList']);

const value = computed({
  get() {
    return props.item.Operator;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const operatorList = computed(() => { // 关系列表
  if (!props.item.Property || !props.item.Property.OperatorList) return [];
  return OperatorMpEnumList.filter(it => props.item.Property && props.item.Property.OperatorList.includes(it.ID));
});

const OptionList = computed(() => { // 选项列表 为选择项时可用
  if (props.item.Property && props.item.Property.OptionList && props.item.Property.OptionList.length > 0) {
    return props.item.Property.OptionList;
  }
  return [];
});

const operatContent = computed(() => {
  if (props.item.Property && OptionList.value.length > 0) {
    if ([PropertyValueTypeEnum.radio].includes(props.item.Property.ValueType)) {
      return '下面任一选项时：';
    }
    if ([PropertyValueTypeEnum.multiple].includes(props.item.Property.ValueType)) {
      return '下面所有选项时：';
    }
  }
  return '';
});

const visible = ref(false);

const localValueList = computed({
  get() {
    return getConstraintsItemValue(props.item);
  },
  set(value) {
    const val = getgetConstraintsItemSubmitValue(props.item, value);
    emit('update:valueList', val);
  },
});

const localValueListContent = computed(() => {
  if (OptionList.value.length > 0 && Array.isArray(localValueList.value)) {
    return localValueList.value.map(id => OptionList.value.find(it => it.First === id)).filter(it => it).map(it => it?.Second).join('、');
  }
  return '';
});

</script>

<style scoped lang='scss'>
.operator-box {
  display: inline-block;
  // width: 220px;
  margin-right: 10px;
  flex: 1 0 auto;
  max-width: 100%;
  .el-select {
    width: 120px;
    height: 30px;
    :deep(.el-input) {
      height: 30px;
    }
  }
  > span.t {
    font-size: 12px;
  }
  .op-d-box {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    .d-content {
      color: #989898;
    }
  }
  .op-c-box {
    overflow: hidden;
    .c {
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
      > label {
        margin-right: 2%;
        overflow: hidden;
        flex: 1;
        :deep(.el-checkbox__label) {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // flex: 1 0 auto;
          // max-width: 7em;
        }
      }
    }
  }
}
</style>
