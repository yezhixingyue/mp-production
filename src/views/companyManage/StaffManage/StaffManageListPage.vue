<template>
  <section class="wrap">
    <Header :StaffManagePageData="StaffManagePageData" @add="onSetupClick" @network="onSetIntranetClick" />
    <Main
      :StaffManagePageData="StaffManagePageData"
      @edit="onSetupClick"
      @remove="onRemoveClick"
      @dimission="onDimissionClick"
      @detail="onDetailAndCheckClick"
      @check="onDetailAndCheckClick"
      />
    <DetailAndCheckDialog
      v-model="detailVisible"
      :curStaffData="StaffManagePageData.curEditStaff"
      :curIndex="StaffManagePageData.curEditIndex"
      :departmentLevelList="StaffManagePageData.departmentLevelList"
      :jobPermissionsList='StaffManagePageData.jobPostList'
      :showIntranet="StaffManagePageData.showIntranet"
      @remove='onRemoveClick'
      @submit="checkOrSetJobSubmit"
    />
    <IntranetDialog v-model="whiteListVisible" v-if="StaffManagePageData.showIntranet" />
    <footer>
      <MpPagination style="width:100%" center
        :nowPage="StaffManagePageData.condition.Page"
        :pageSize="StaffManagePageData.condition.PageSize"
        :total="StaffManagePageData.dataNumber"
        :handlePageChange="(e) => StaffManagePageData.getDataList(e)" />
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { useCompanyStore } from '@/store/modules/companyManage';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import MpPagination from '@/components/common/MpPagination.vue';
import Header from './Comps/StaffListHeader.vue';
import Main from './Comps/StaffListMain.vue';
import DetailAndCheckDialog from './Comps/Detail&CheckDialog/IndexComp.vue';
import IntranetDialog from './Comps/IntranetDialog.vue';
import { IStaff } from './js/types';

const router = useRouter();
const companyStore = useCompanyStore();
const userStore = useUserStore();

const { StaffManagePageData } = storeToRefs(companyStore);
const { user } = storeToRefs(userStore);

/** 添加|编辑 */
const onSetupClick = (it: IStaff | null) => {
  StaffManagePageData.value.curEditStaff = it;
  router.push('/StaffSetup');
};

/** 详情审核弹窗，可审核|删除 */
const detailVisible = ref(false);

const onRemoveClick = ({ item, index }) => {
  const cb = () => {
    if (detailVisible.value) detailVisible.value = false;
  };
  StaffManagePageData.value.removeItem(item, index, cb);
};

const onDimissionClick = ({ item, expectStatus, index }) => { // 员工离职|取消离职
  StaffManagePageData.value.setItemStatusChange(item, expectStatus, index);
};

const onDetailAndCheckClick = ({ item, index }) => {
  StaffManagePageData.value.curEditStaff = item;
  StaffManagePageData.value.curEditIndex = index;
  detailVisible.value = true;
};

const checkOrSetJobSubmit = (data) => {
  if (!user.value) return;
  const cb = () => {
    if (detailVisible.value) detailVisible.value = false;
  };
  StaffManagePageData.value.checkOrSetJobSubmit(data, StaffManagePageData.value.curEditIndex, user.value, cb);
};

const whiteListVisible = ref(false);
const onSetIntranetClick = () => { // 设置白名单
  whiteListVisible.value = true;
};

onMounted(() => {
  StaffManagePageData.value.getDataList();
  StaffManagePageData.value.getJobPostList();
  StaffManagePageData.value.getDepartmentList();
});
</script>

<script lang="ts">
export default {
  name: 'StaffManageListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
  }
  > main {
    flex: 1;
    margin-top: 10px;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
    }
  }
  > footer {
    flex: none;
    height: 50px;
    box-sizing: border-box;
    padding-top: 5px;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
