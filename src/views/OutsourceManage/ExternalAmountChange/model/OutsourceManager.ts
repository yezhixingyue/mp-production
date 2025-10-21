import { outsourceApis } from '@/api/modules/outsourceApis';
import { ElMessage } from 'element-plus';

/** 外协主管设置类 */
export class OutsourceManager {
  /** 外协主管列表 */
  list: { StaffID: string; StaffName: string }[] = []

  async getList() {
    const resp = await outsourceApis.getStaffOutsourceManagerList();
    if (resp.data?.isSuccess) {
      this.list = resp.data.Data || [];
    }
  }

  /** 外协主管新增 */
  async addManager(staff: OutsourceManager['list'][0]) {
    const isExist = this.list.find((item) => item.StaffID === staff.StaffID);
    if (isExist) return true;

    const resp = await outsourceApis.getStaffSetOutsourceManager(staff.StaffID);
    if (resp.data?.isSuccess) {
      ElMessage.success('添加成功');
      this.list.push(staff);

      return true;
    }

    return false;
  }

  /** 外协主管删除 */
  async removeManager(staffID: string) {
    const resp = await outsourceApis.getStaffRemoveOutsourceManager(staffID);
    if (resp.data?.isSuccess) {
      ElMessage.success('删除成功');
      this.list = this.list.filter((item) => item.StaffID !== staffID);
    }
  }
}
