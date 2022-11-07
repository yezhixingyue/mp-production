import { StaffManageClass } from '@/views/companyManage/StaffManage/js/StaffManageClass';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanyStore = defineStore('company', () => {
  /**
   * 员工管理页面数据
   */
  const StaffManagePageData = ref(new StaffManageClass());

  return { StaffManagePageData };
});
