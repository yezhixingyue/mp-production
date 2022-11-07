<template>
  <header class="header">
    <div class="mb-8">
      <MpButton type="primary">+ 添加员工</MpButton>
      <span class="is-blue-span ml-21">设置内部网络IP</span>
    </div>
    <div class="select-box">
      <div class="mr-10">
        <span class="title">筛选：</span>
        <el-select v-model="sexFilterVal" class="mp-select">
          <el-option v-for="item in localSexEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
        <el-select v-model="educationFilterVal" class="mp-select">
          <el-option v-for="item in localEducationEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
        <el-select v-model="statusFilterVal" class="mp-select">
          <el-option v-for="item in localStaffStatusEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
      <EpCascaderByLevel2
        title="城市"
        showLine
        class="mr-25"
        :fiexdWidth="180"
        :First="props.StaffManagePageData.condition.Location.First"
        :Second="props.StaffManagePageData.condition.Location.Second"
        :type-list="[['Location', 'First'], ['Location', 'Second']]"
        :list="DistrictTreeList"
        @getList="() => props.StaffManagePageData.getDataList()"
        @setCondition="(e) => props.StaffManagePageData.setCondition(e)"
      />
      <div>
        <span class="title">岗位：</span>
        <el-select v-model="jobPostFilterVal" class="mp-select">
          <el-option v-for="item in localJobPostList" :key="item.PositionID" :label="item.PositionName" :value="item.PositionID" />
        </el-select>
      </div>
    </div>
    <SearchInputComp
      :word='props.StaffManagePageData.condition.KeyWords'
      :changePropsFunc="(e) => props.StaffManagePageData.setCondition(e)"
      :requestFunc='(e) => props.StaffManagePageData.getDataList(e)'
      :searchWatchKey="props.StaffManagePageData.dataList"
      :typeList="[['KeyWords', '']]"
      space-between
      class="mt-15 ml-0"
      @reset='() => props.StaffManagePageData.clearConditon()'
      />
  </header>
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { StaffManageClass } from '../js/StaffManageClass';
import { SexEnumList, EducationEnumList, StaffStatusEnumList } from '../js/enums';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const props = defineProps<{
  StaffManagePageData: StaffManageClass
}>();

const localSexEnumList = [{ ID: '', Name: '性别不限' }, ...SexEnumList];
const localEducationEnumList = [{ ID: '', Name: '学历不限' }, ...EducationEnumList];
const localStaffStatusEnumList = [{ ID: '', Name: '状态不限' }, ...StaffStatusEnumList];
const localJobPostList = computed(() => [{ PositionID: '', PositionName: '不限' }, ...props.StaffManagePageData.jobPostList]);

const sexFilterVal = computed({
  get() {
    return props.StaffManagePageData.condition.Sex;
  },
  set(val) {
    props.StaffManagePageData.setCondition([['Sex', ''], val]);
    props.StaffManagePageData.getDataList();
  },
});

const educationFilterVal = computed({
  get() {
    return props.StaffManagePageData.condition.Education;
  },
  set(val) {
    props.StaffManagePageData.setCondition([['Education', ''], val]);
    props.StaffManagePageData.getDataList();
  },
});

const statusFilterVal = computed({
  get() {
    return props.StaffManagePageData.condition.Status;
  },
  set(val) {
    props.StaffManagePageData.setCondition([['Status', ''], val]);
    props.StaffManagePageData.getDataList();
  },
});

const jobPostFilterVal = computed({
  get() {
    return props.StaffManagePageData.condition.PositionID;
  },
  set(val) {
    props.StaffManagePageData.setCondition([['PositionID', ''], val]);
    props.StaffManagePageData.getDataList();
  },
});

onMounted(() => {
  commonStore.getDistrictList();
});

</script>

<style scoped lang='scss'>
.header {
  padding: 20px 25px;
  .select-box {
    display: flex;
    flex-wrap: wrap;
    > div {
      margin-top: 14px;
    }
    .title {
      min-width: 5em;
      display: inline-block;
      text-align: right;
      color: #444;
      margin-right: 10px;
      font-weight: 700;
    }
  }
  .ml-0 {
    margin-left: 0;
  }
}
</style>
