import { Ref, ref } from 'vue';
import api from '@/api';
import { ElMessage } from 'element-plus';
import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import { IUnionTaskDetail } from '../../../types/type';

/** 设置齐整相关 */
export const useArrange = (taskDetail: Ref<null | IUnionTaskDetail>, emit) => {
  const state = ref({
    // mobile: '',
    visible: false,
    staffId: '',
    staff: null as null | IStaff,
    staffList: [] as IStaff[],
    loading: false,
  });

  const clearArrangeState = () => {
    // state.value.mobile = '';
    state.value.visible = false;
    state.value.staffId = '';
    state.value.staff = null;
    state.value.staffList = [];
  };

  const remoteStaffList = async (query: string) => {
    if (query) {
      state.value.loading = true;
      const resp = await api.getStaffList({ FieldType: 3, KeyWords: query, Page: 1, PageSize: 8 }, false);
      state.value.loading = false;

      if (resp.data?.isSuccess) {
        state.value.staffList = resp.data.Data;
      }

      return;
    }

    state.value.staffList = [];
  };

  const onArrangeStaffChange = () => {
    state.value.staff = state.value.staffList.find(it => it.StaffID === state.value.staffId) || null;
  };

  /** 设置齐整 */
  const onArrangeClick = async () => {
    if (!state.value.staff) {
      MpMessage.error('设置失败', '请先选择齐整人');
      return;
    }

    state.value.visible = true;
  };

  const submitArrange = async () => {
    if (!state.value.staff || !taskDetail.value) return;

    const resp = await clientApi.getTaskHaveReady(taskDetail.value.ID, state.value.staff.StaffID, clearArrangeState);
    if (resp.data?.isSuccess) {
      ElMessage({ showClose: true, message: '设置齐整成功!', type: 'success' });
      const _taskDetail = taskDetail;
      if (_taskDetail.value) {
        _taskDetail.value.ReadyOperator = state.value.staff.StaffName;

        emit('completed', { ReadyOperator: _taskDetail.value.ReadyOperator, ID: _taskDetail.value.ID });
      }

      clearArrangeState();
    }
  };

  return { arrangeState: state, clearArrangeState, submitArrange, remoteStaffList, onArrangeStaffChange, onArrangeClick };
};
