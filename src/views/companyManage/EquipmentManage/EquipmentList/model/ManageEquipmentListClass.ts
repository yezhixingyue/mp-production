import { mpEquipmentApi } from '@/api/equipment';
import { Buffer } from 'buffer';
import { IPartialToolsStaff } from '../hooks/useStaffList';
import { TEquipment } from '../types';
import { Condition } from './Condition';
import { EquipmentItemHandler } from './EquipmentItemHandler';
import { HistoryViewManageClass } from './HistoryViewManageClass';

export class ManageEquipmentListClass {
  condition = new Condition()

  list: TEquipment[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  async getList(Page: number, staffList: IPartialToolsStaff[]) {
    this.condition.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await mpEquipmentApi.getEquipmentList(this.condition.getParams(staffList));
    this.loading = false;

    if (resp && resp.data?.isSuccess) {
      // 数据保存
      this.list = resp.data.Data.rows;
      this.listNumber = resp.data.Data.count;
    }
  }

  /** 单个项目的增删改查等操作 */
  itemHandler = new EquipmentItemHandler()

  /** 历史记录查询 */
  historyHandler = new HistoryViewManageClass()

  async excel(staffList, departmentList, jobPostList) {
    const _condition = { ...this.condition.getParams(staffList), Page: undefined, PageSize: undefined };

    delete _condition.Page;
    delete _condition.PageSize;

    const temp = {
      condition: _condition,
      staffList,
      departmentList: departmentList.map(it => ({ ID: it.ID, ClassName: it.ClassName })),
      jobPostList: jobPostList.map(it => ({ PositionID: it.PositionID, PositionName: it.PositionName })),
    };

    const resp = await mpEquipmentApi.getEquipmentListExcel(temp).catch(() => null);

    if (resp?.data?.isSuccess) {
      const blob = new Blob([Buffer.from(resp.data.Data.buffer.data)], {
        type: resp.data.Data.suffix,
      });

      const filename = `办公设备列表（${new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.')}导出）.${resp.data.Data.suffix}`;
      const link = document.createElement('a');
      const body = document.querySelector('body');

      link.href = window.URL.createObjectURL(blob); // 创建对象url
      link.download = filename;

      // fix Firefox
      link.style.display = 'none';
      if (body) body.appendChild(link);

      link.click();
      if (body) body.removeChild(link);

      window.URL.revokeObjectURL(link.href); // 通过调用 URL.createObjectURL() 创建的 URL 对象
    }
  }
}
