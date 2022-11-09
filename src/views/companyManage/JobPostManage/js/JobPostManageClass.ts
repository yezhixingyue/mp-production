import api from '@/api';
import { IJobPost } from './types';

export class JobPostManageClass {
  list: IJobPost[] = []

  listNumber = 0

  loading = false;

  /**
   * 获取岗位列表
   *
   * @memberof JobPostManageClass
   */
  async getList() {
    this.list = [];

    this.loading = true;
    const resp = await api.getJobPermissionsList().catch(() => null);
    this.loading = false;

    if (resp && resp.data.Status === 1000) {
      this.list = resp.data.Data as IJobPost[];
      this.listNumber = resp.data.DataNumber;
    }
  }

  setItemChange([value, index]: [string, number]) {
    if (this.list[index]) {
      this.list[index].PositionName = value;
    }
  }
}
