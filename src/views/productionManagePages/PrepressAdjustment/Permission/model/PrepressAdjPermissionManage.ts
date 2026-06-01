import api from '@/api';
import { ElMessage } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IAdjustPermissionInfo } from '../../types';
import { localPrepressAdjModel } from '../../store';

/** 印前调整负责人权限信息管理 */
export class PrepressAdjPermissionManage {
  /** 负责人列表 */
  list: IAdjustPermissionInfo[] = []

  /** 获取负责人列表信息 */
  async getList() {
    const resp = await api.productionManageApis.getOrderAdjustPermissionList();
    if (resp.data?.isSuccess) {
      this.list = resp.data.Data;
    }
  }

  async save(data: IAdjustPermissionInfo, callback: () => void) {
    const resp = await api.productionManageApis.getOrderAdjustPermissionSave(data);
    if (resp.data?.isSuccess) {
      const cb = () => {
        const t = this.list.find(it => it.ID === data.ID);
        if (t) {
          t.LineList = [...data.LineList];
        } else {
          this.list.unshift(data);
        }

        if (data.ID === localPrepressAdjModel.value.user?.StaffID) {
          localPrepressAdjModel.value.user.AdjustPermissions = data.LineList;

          localPrepressAdjModel.value.updateMyAuthorizedLineIDs(data.LineList.map(it => it.ID));
        }

        callback();
      };

      MpMessage.success({
        title: '设置成功',
        onCancel: cb,
        onOk: cb,
      });
    }
  }

  async remove(id: string) {
    const resp = await api.productionManageApis.getOrderAdjustPermissionRemove(id);
    if (resp.data?.isSuccess) {
      this.list = this.list.filter(it => it.ID !== id);
      ElMessage({ showClose: true, message: '删除成功', type: 'success' });

      if (id === localPrepressAdjModel.value.user?.StaffID) {
        localPrepressAdjModel.value.user.AdjustPermissions = null;

        localPrepressAdjModel.value.updateMyAuthorizedLineIDs([]);
      }
    }
  }
}
