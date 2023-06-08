<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="title" primary-text="确定" @submit="submit" @open="onOpen"
   :width="materialOptionList.length > 0 ? 800 : 700" :top="materialOptionList.length > 0 ? '10vh' : undefined">
    <!-- 物料类型特殊化处理 -->
    <MaterialCheckboxList :optionList="materialOptionList" v-model="checkList" v-if="materialOptionList.length > 0" />

    <!-- 通用方式 -->
    <el-checkbox-group v-model="checkList" class="list" v-if="materialOptionList.length === 0">
      <el-checkbox v-for="it in OptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
    </el-checkbox-group>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IPropertyOptionListItem } from '../../../TypeClass/types';
import { FixedTypeEnum } from '../../../TypeClass/enum';
import { IMaterialOptionItem } from './types';
import MaterialCheckboxList from './MaterialCheckboxList.vue';

const props = withDefaults(defineProps<{
  visible: boolean,
  OptionList: IPropertyOptionListItem[],
  modelValue: string|number|(string | number)[],
  FixedType?: null | FixedTypeEnum
}>(), {
  visible: false,
});

const emit = defineEmits(['update:visible', 'update:modelValue']);

const checkList = ref<(string | number)[]>([]);

const materialOptionList = computed(() => {
  if (props.FixedType === FixedTypeEnum.Material) {
    const _pickInfo = (str: string) => {
      const [lv1Name, lv2Name, ...arr] = str.split(' ');
      if (lv1Name && lv2Name && arr.length > 0) { // 符合格式要求
        return { lv1Name, lv2Name, Name: arr.join(' ') };
      }
      // 格式不匹配
      return { lv1Name: '_未知分类', lv2Name: '_未知类型', Name: str };
    };

    const arr: IMaterialOptionItem[] = [];

    props.OptionList.forEach(it => {
      const { lv1Name, lv2Name, Name } = _pickInfo(it.Second);
      let lv1 = arr.find(_it => _it.Name === lv1Name);
      if (!lv1) {
        lv1 = { Name: lv1Name, List: [] };
        arr.push(lv1);
      }
      let lv2 = lv1.List.find(_it => _it.Name === lv2Name);
      if (!lv2) {
        lv2 = { Name: lv2Name, List: [] };
        lv1.List.push(lv2);
      }
      lv2.List.push({ Data: it, Name });
    });

    return arr;
  }
  return [];
});

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const title = computed(() => {
  let str = '选项选择';
  switch (props.FixedType) {
    case FixedTypeEnum.Material:
      str = '选择物料';
      break;

    default:
      break;
  }

  return str;
});

const onOpen = () => {
  if (typeof props.modelValue === 'object') {
    checkList.value = [...props.modelValue];
  }
};

const submit = () => {
  emit('update:modelValue', checkList.value);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
.list {
  margin-left: 15px;
  margin-top: -15px;
  max-height: 415px;
  overflow: auto;
  white-space: normal;
  .el-checkbox {
    margin-right: 12px;
    :deep(.el-checkbox__label) {
      display: inline-block;
      vertical-align: -2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 10em;
    }
  }
}
</style>
