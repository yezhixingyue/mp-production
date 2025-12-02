<template>
  <header class="equip-assistant-header">
      <div class="filter">
        <div class="btns">
          <mp-button type="primary" v-if="user?.PermissionList.PermissionAssistant.Obj.MemberSetup" @click="emit('add', null)">+ 添加人员</mp-button>
          <mp-button class="blue" v-if="user?.PermissionList.PermissionAssistant.Obj.TypeSetup" @click="onClassManageClick">助手类型管理</mp-button>
        </div>
        <div class="select-box">
          <span class="title">担任助手类型：</span>
          <el-select v-model="Type" class="mp-select">
            <el-option v-for="item in [{ ID: '', Name: '不限' }, ...localAssistantTypeList]" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
      </div>

      <SearchInputComp
        :word='localAssistantManageModel.condition.KeyWords'
        title="关键词搜索"
        placeholder="请输入搜索关键词"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => localAssistantManageModel.condition.setCondition([['KeyWords', ''], keywords])"
        :requestFunc='() => localAssistantManageModel.getList()'
        :searchWatchKey="localAssistantManageModel.list"
        @reset='() => localAssistantManageModel.clearCondition()'
      />
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { useUserHook } from '@/store/modules/user';
import { AssistantListManageModel } from '../model/AssistantListManageModel';
import { localAssistantTypeList } from '../store';

const props = defineProps<{
  localAssistantManageModel: AssistantListManageModel
}>();

const emit = defineEmits(['add']);

const { user } = useUserHook();

const Type = computed({
  get() {
    return props.localAssistantManageModel.condition.Type;
  },
  set(val) {
    if (val === props.localAssistantManageModel.condition.Type) return;
    props.localAssistantManageModel.condition.setCondition([['Type', ''], val]);
    props.localAssistantManageModel.getList();
  },
});

const router = useRouter();
const onClassManageClick = () => {
  router.push('/EquipmentAssistantTypeManage');
};
</script>

<style scoped lang='scss'>
.equip-assistant-header {
  margin-bottom: 10px;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .filter {
    display: flex;
    align-items: center;

    button {
      width: 120px;
      border-radius: 3px;
    }

    .blue {
      margin-left: 30px;
      margin-right: 30px;
    }
  }

  .select-box {
    margin-top: 6px;

    :deep(.mp-select.el-select .el-input) {
      width: 135px;
    }
  }

  .title {
    font-weight: 700;
    margin-right: 10px;
  }
}
</style>
