import api from '@/api';
import { onMounted, ref } from 'vue';

export interface IPartialToolsStaff {
  StaffID: string
  StaffName: string
  PositionList: {
    First: { FirstDepartmentID: number },
    Second: { PositionID: string; PositionName: string }
  }[]
}

const staffList = ref<IPartialToolsStaff[]>([]);
const departmentList = ref<{ ID: number; ClassName: string, Level: number }[]>([]);
const jobPostList = ref<{ PositionID: string; PositionName: string }[]>([]);

export const useStaffList = () => {
  const getStaffList = async () => {
    const resp = await api.getStaffList({ FieldType: 3 }).catch(() => null);

    if (resp?.data?.isSuccess) {
      const _list: IPartialToolsStaff[] = resp.data.Data || [];
      staffList.value = _list.map(it => ({
        StaffID: it.StaffID,
        StaffName: it.StaffName,
        PositionList: it.PositionList.map(p => ({
          First: { FirstDepartmentID: p.First.FirstDepartmentID },
          Second: { PositionName: p.Second.PositionName, PositionID: p.Second.PositionID },
        })),
      }));
    }
  };

  const getDepartmentList = async () => {
    const resp = await api.getDepartmentList().catch(() => null);
    if (resp && resp.data?.Status === 1000) {
      departmentList.value = (resp.data.Data || []).map(it => ({ ...it, ClassName: it.Name }));
    }
  };

  const getJobPostList = async () => { // 获取岗位列表
    const resp = await api.getJobPermissionsList().catch(() => null);
    if (resp && resp.data?.Status === 1000) {
      jobPostList.value = resp.data.Data || [];
    }
  };

  const getStaffName = (id: string) => staffList.value.find(it => it.StaffID === id)?.StaffName || '';

  const getDepartment = (id: string) => {
    if (!id || departmentList.value.length === 0) return '';
    const staff = staffList.value.find(it => it.StaffID === id);
    if (staff && staff.PositionList.length > 0) {
      const arr = staff.PositionList.map(({ First }) => departmentList.value.find(it => it.ID === First.FirstDepartmentID)?.ClassName).filter(it => it);

      return [...new Set(arr)].join(' | ');
    }

    return '';
  };

  const getPostName = (id: string) => {
    if (!id) return '';
    const staff = staffList.value.find(it => it.StaffID === id);
    if (staff && staff.PositionList.length > 0) {
      const arr = staff.PositionList
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map(({ Second }) => jobPostList.value.find(_it => _it.PositionID === Second.PositionID)).filter(it => it).map(it => it!.PositionName);

      return [...new Set(arr)].join(' | ');
    }

    return '';
  };

  onMounted(() => {
    if (staffList.value.length === 0) {
      getStaffList();
    }
    if (departmentList.value.length === 0) {
      getDepartmentList();
    }
    if (jobPostList.value.length === 0) {
      getJobPostList();
    }
  });

  return { staffList, departmentList, jobPostList, getStaffName, getDepartment, getPostName };
};
