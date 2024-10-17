import { mpEquipmentApi } from '@/api/equipment';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { Buffer } from 'buffer';
import { IComputer, IRemarkSubmitParams } from '../types/type';
import { ComputerForm } from './Computer';
import { Condition } from './Condition';
import { IPartialToolsStaff } from '../hooks/useStaffList';

export class ComputerListManageClass {
  condition = new Condition()

  list: IComputer[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  async save(data: { params: ReturnType<ComputerForm['getParams']>, remark: IRemarkSubmitParams | null }, callback: () => void) {
    if (!data.params) return;

    // 如果是编辑则打开记录弹窗

    const resp = await mpEquipmentApi.getComputerSave(data).catch(() => null);

    if (resp?.data?.isSuccess) {
      const result: IComputer = resp.data.Data;
      const _isEdit = !!data.params.id;

      const cb = () => {
        callback();
        // 对数据进行修改
        if (!_isEdit) {
          this.list.unshift(result);
          this.listNumber += 1;
        } else {
          const i = this.list.findIndex(it => it.id === result.id);
          if (i > -1) this.list.splice(i, 1, result);
        }
      };

      MpMessage.success({
        title: _isEdit ? '编辑成功' : '添加成功',
        msg: `序号：[ ${result.index} ]`,
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  async getList(Page: number, staffList: IPartialToolsStaff[]) {
    this.condition.Page = Page;
    this.list = [];

    this.loading = true;
    const resp = await mpEquipmentApi.getComputerList(this.condition.getParams(staffList)).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data.rows;
      this.listNumber = resp.data.Data.count;
    }
  }

  async excel(staffList, departmentList) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _condition: any = this.condition.getParams(staffList);

    delete _condition.limit;
    delete _condition.offset;

    const temp = {
      condition: _condition,
      staffList,
      departmentList: departmentList.map(it => ({ ID: it.ID, ClassName: it.ClassName })),
    };

    const resp = await mpEquipmentApi.getComputerListExcel(temp).catch(() => null);

    if (resp?.data?.isSuccess) {
      const blob = new Blob([Buffer.from(resp.data.Data.buffer.data)], {
        type: resp.data.Data.suffix,
      });

      const filename = `电脑盘点表-名片之家（${new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.')}导出）.${resp.data.Data.suffix}`;
      const link = document.createElement('a');

      link.href = window.URL.createObjectURL(blob); // 创建对象url
      link.download = filename;

      // fix Firefox
      link.style.display = 'none';
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(link.href); // 通过调用 URL.createObjectURL() 创建的 URL 对象
    }
  }

  async changeState(data: Pick<IComputer, 'id' | 'state' | 'user'>, remark: IRemarkSubmitParams, callback: () => void) { // 作废 | 调出 | 调入
    if (!data || !remark) return;

    const resp = await mpEquipmentApi.getComputerChangeState({ data, remark }).catch(() => null);

    if (resp?.data?.isSuccess) {
      const result: IComputer = resp.data.Data;
      const cb = () => {
        callback();
        // 对数据进行修改
        const i = this.list.findIndex(it => it.id === result.id);
        if (i > -1) this.list.splice(i, 1, result);
      };

      MpMessage.success({
        title: '设置成功',
        msg: `序号：[ ${result.index} ]`,
        onOk: cb,
        onCancel: cb,
      });
    }
  }
}
