<template>
  <MpButton link type="primary" class="button" @click="onClick">选择物料类型</MpButton>
  <ul class="display-content">
    <li v-for="it in displayList" :key="it.CategoryName">
      <span class="t">{{it.CategoryName}}：</span>
      <span>{{it.MaterialTypeNames.join('、')}}</span>
    </li>
  </ul>
  <MaterialTypeGroupSelectorDialog
    v-model:visible="visible"
    v-model="localValue"
    :MaterialTypeGroup="MaterialTypeGroup"
    :getMaterialTypeGroup="store.getMaterialTypeGroup"
  />
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { computed, defineAsyncComponent, ref } from 'vue';
import { useResourceStore } from '@/store/modules/resource';
import { storeToRefs } from 'pinia';
import { IMaterialTypeItemInBundle } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { useFormItem } from 'element-plus';
import { getDisplayList } from './utils';

const MaterialTypeGroupSelectorDialog = defineAsyncComponent(() => import('./MaterialTypeGroupSelectorDialog.vue'));

const store = useResourceStore();
const { MaterialTypeGroup } = storeToRefs(store);

const props = defineProps<{
  modelValue: IMaterialTypeItemInBundle[]
}>();

const emit = defineEmits(['update:modelValue', 'el.form.change']);

const { formItem } = useFormItem();

const visible = ref(false);

const localValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    formItem?.validate('change');
  },
});

const displayList = computed(() => getDisplayList(props.modelValue, MaterialTypeGroup.value));

const onClick = () => {
  visible.value = true;
};

</script>

<style scoped lang='scss'>
  @import '@/assets/css/mixins.scss';
.button.is-link {
  padding: 0;
  line-height: 30px;
}
.display-content {
  width: 100%;
  color: #585858;
  margin-top: 1px;
  margin-left: 1px;
  max-height: 230px;
  overflow: auto;
  @include scroll;
  > li {
    display: flex;
    align-items: flex-start;
    .t {
      font-weight: 700;
      font-size: 14px;
      flex: none;
      & + span {
        line-height: 20px;
        padding-top: 7px;
      }
    }
  }
}
</style>
