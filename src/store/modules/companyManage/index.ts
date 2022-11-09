import { StaffManageClass } from '@/views/companyManage/StaffManage/js/StaffManageClass';
import { JobPostManageClass } from '@/views/companyManage/JobPostManage/js/JobPostManageClass';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanyStore = defineStore('company', () => {
  /**
   * 员工管理页面数据
   */
  const StaffManagePageData = ref(new StaffManageClass());

  /**
   * 岗位管理页面数据
   */
  const JobPostManagePageData = ref(new JobPostManageClass());

  return { StaffManagePageData, JobPostManagePageData };
});
