<template>
  <header class="header">
    <el-button type="primary" @click="emit('add')">+ 添加电脑</el-button>
    <div class="filter">
      <div class="list">
        <div class="menu">
          <span class="title">状态：</span>
          <el-select v-model="localStatus" class="mp-select">
            <el-option v-for="item in localStateList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </div>
        <div class="menu">
          <span class="title">部门：</span>
          <el-select v-model="localDepartment" class="mp-select">
            <el-option v-for="item in localDepartmentList" :key="item.ID" :label="item.ClassName" :value="item.ID" />
          </el-select>
        </div>
      </div>
      <SearchInputComp
        :typeList="[['Keywords', '']]"
        :requestFunc="getList"
        :changePropsFunc='setCondition'
        :word='localManageListData.condition.Keywords'
        title="关键词"
        placeholder="请输入搜索关键字"
        :searchWatchKey="localManageListData.list"
        @reset='() => localManageListData.clearCondition()'
        />
    </div>
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { ComputerListManageClass } from '../model/ComputerListManageClass';
import { ComputerUseStateEnumList } from '../types/enum';
import { useStaffList } from '../hooks/useStaffList';

const props = defineProps<{
  localManageListData: ComputerListManageClass
}>();
const emit = defineEmits(['add', 'getList']);

const setCondition = (e) => props.localManageListData.condition.setConditon(e);
const getList = () => emit('getList');

const localStateList = [{ ID: '', Name: '不限' }, ...ComputerUseStateEnumList];

const { departmentList } = useStaffList();
const localDepartmentList = computed(() => [{ ID: '', ClassName: '不限' }, ...departmentList.value.filter(it => it.Level === 1)]);

const localStatus = computed({
  get() {
    return props.localManageListData.condition.State;
  },
  set(val) {
    setCondition([[['State']], val]);
    getList();
  },
});

const localDepartment = computed({
  get() {
    return props.localManageListData.condition.DepartmentID;
  },
  set(val) {
    setCondition([[['DepartmentID']], val]);
    getList();
  },
});
</script>

<style scoped lang='scss'>
.header {
  padding: 20px;
  padding-right: 60px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  > button {
    height: 32px;
    width: 120px;
    padding: 0;
    border-radius: 2px;
    flex: none;
  }

  > .filter {
    padding-left: 20px;
    flex-wrap: wrap;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  .menu {
    flex: none;
    margin-right: 25px;
    > span.title {
      display: inline-block;
      line-height: 28px;
      font-weight: 700;
      cursor: pointer;
      color: #444;
      transition: 0.2s ease-in-out;
      user-select: none;
      padding-left: 20px;
      padding-right: 5px;
    }
  }
}
</style>
