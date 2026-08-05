<script setup lang='ts'>
import { computed } from 'vue';
import { localEnumValueIDType, getEnumList } from '@/assets/js/utils/getListByEnums';
import MpButton from '@/components/common/MpButton.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { IUser } from '@/store/modules/user/types';
import { useRouter } from 'vue-router';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/types/enum';

const props = defineProps<{
  modelValue: localEnumValueIDType
  keywords: string
  list: IAssistListItem[]
  localPermission?: IUser['PermissionList']['PermissionManageAssist']['Obj']
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

const router = useRouter();

const clearCondition = () => {
  emit('clear');
  emit('change');
};

const jump2Position = () => {
  router.push('/assistPosition');
};
</script>

<template>
  <header style="white-space: nowrap;" class="header">
    <div>
      <mp-button type="primary" @click="onClick" v-if="localPermission?.Setup" style="margin: 0 10px 0 0">+添加辅助信息</mp-button>
      <mp-button type="primary" @click="jump2Position" link v-if="localPermission?.Setup" style="margin: 0 35px 0 12px">设置显示位置</mp-button>
      <span class="bold ft-14 mr-13">筛选：</span>
      <el-radio-group v-model="radioValue" class="mr-20" style="white-space: nowrap;flex-wrap: nowrap;">
        <el-radio class="ft-12" v-for="it in radioMenus" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </div>
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 72px;
}
</style>
