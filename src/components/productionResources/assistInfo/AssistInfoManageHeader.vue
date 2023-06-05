<script setup lang='ts'>
import { computed } from 'vue';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { localEnumValueIDType, getEnumList } from '@/assets/js/utils/getListByEnums';
import MpButton from '@/components/common/MpButton.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';

const props = defineProps<{
  modelValue: localEnumValueIDType
  keywords: string
  list: IAssistListItem[]
}>();

const emit = defineEmits(['update:modelValue', 'change', 'add', 'update:keywords', 'clear']);

const radioMenus = getEnumList(AssistInfoTypeEnums, { withNoLimit: true });

const radioValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('change');
  },
});

const KeyWordsValue = computed({
  get() {
    return props.keywords;
  },
  set(val) {
    emit('update:keywords', val);
    emit('change');
  },
});

const onClick = () => {
  emit('add', null);
};

const clearCondition = () => {
  emit('clear');
  emit('change');
};

</script>

<template>
  <header>
    <mp-button type="primary" @click="onClick">+添加辅助信息</mp-button>
    <span class="bold ft-14 mr-13">筛选：</span>
    <el-radio-group v-model="radioValue" class="mr-20">
      <el-radio class="ft-12" v-for="it in radioMenus" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
    </el-radio-group>
    <SearchInputComp
      :word='KeyWordsValue'
      title="关键词搜索"
      placeholder="请输入搜索关键词"
      resetWords="清空所有筛选条件"
      :changePropsFunc="(keywords: string) => KeyWordsValue = keywords"
      :searchWatchKey="list"
      @reset='clearCondition'
     />
  </header>
</template>

<style scoped lang='scss'>
// deep
</style>
