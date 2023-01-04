import api from '@/api';
import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { getLocalMachineCode } from './getLocalMachineCode';
import { IEquipmentSetupItem } from './types';

/**
 * 管理员设置机器关联类
 *
 * @export
 * @class EquipmentSetupClass
 */
export class EquipmentSetupClass {
  public list: string[] = []

  public localEquipmentSetupList: IEquipmentSetupItem[] = []

  public EquipmentList: IManageEquipmentInfo[] = []

  public EquipmentClassList: EquipmentClassificationListItem[] = [] // 设备分类列表

  public EquipmentGroupList: EquipmentGroupItemType[] = []

  constructor(list: string[]) {
    this.list = list;
  }

  private validateLocalEquipmentSetupList() { // 校验设置关联机器参数是否完整
    const i = this.localEquipmentSetupList.findIndex(it => !it.ID);
    if (i > -1) {
      MpMessage.error({ title: '保存失败', msg: `第${i + 1}条参数设置不完整` });
      return false;
    }

    const ids = this.localEquipmentSetupList.map(it => it.ID);

    if (ids.length > [...new Set(ids)].length) {
      MpMessage.error({ title: '保存失败', msg: '设备重复，请检查' });
      return false;
    }

    return true;
  }

  /**
   * 设置关联机器保存
   *
   * @memberof EquipmentSetupClass
   */
  public async submit(sign: string, cb: (list: IManageEquipmentInfo[]) => void) {
    if (!this.validateLocalEquipmentSetupList()) return;
    const terminal = await getLocalMachineCode();
    const ids = this.localEquipmentSetupList.map(it => it.ID);
    const resp = await clientApi.getEquipmentBind(terminal, ids, sign).catch(() => null);
    if (resp?.data.isSuccess) {
      const callback = () => {
        this.list = ids;
        const _curTerminalEquipmentList = (ids.map(id => this.EquipmentList.find(it => it.ID === id)).filter(it => it) as IManageEquipmentInfo[]).map(it => ({
          ...it,
          GroupName: this.EquipmentGroupList.find(_it => _it.ID === it.GroupID)?.Name || '',
        }));
        cb(_curTerminalEquipmentList);
      };
      MpMessage.success({
        title: '设置成功',
        onOk: callback,
        onCancel: callback,
      });
    }
  }

  private async getEquipmentClassList(sign: string) { // 获取设备分类
    if (this.EquipmentClassList.length > 0) return;
    const resp = await api.getEquipmentClassificationList(sign).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentClassList = resp.data.Data;
    }
  }

  private async getEquipmentGroupList(sign: string) { // 获取设备组
    if (this.EquipmentGroupList.length > 0) return;
    const resp = await api.getEquipmentGroupList({ Page: 1, PageSize: 9999 }, sign).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentGroupList = resp.data.Data;
    }
  }

  public async getList(sign: string) {
    if (this.EquipmentList.length > 0) return;
    const temp = {
      Page: 1,
      PageSize: 10000,
      IsUseable: true,
    };
    const resp = await api.getEquipmentList(temp, sign).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.EquipmentList = resp.data.Data;
    }
  }

  /**
   * 添加一行关联机器设置 - 仅小于4个时可添加
   *
   * @memberof EquipmentSetupClass
   */
  public generateEquipmentSetupItem() {
    const temp: IEquipmentSetupItem = {
      ClassID: '',
      GroupID: '',
      ID: '',
      _key: Math.random().toString(16).slice(-10),
    };

    this.localEquipmentSetupList.push(temp);
  }

  public async getInitData(sign: string) { // 获取初始数据
    this.getList(sign);
    await Promise.all([this.getEquipmentClassList(sign), this.getEquipmentGroupList(sign)]);

    // 此处生成列表绑定数据
    const _list = this.list.map(id => {
      const t = this.EquipmentList.find(it => it.ID === id);
      if (!t) return null;
      const temp = {
        ClassID: t.ClassID,
        GroupID: t.GroupID,
        ID: t.ID,
        _key: Math.random().toString(16).slice(-10),
      };
      return temp;
    }).filter(it => it) as IEquipmentSetupItem[];

    this.localEquipmentSetupList = _list;

    if (_list.length === 0) {
      this.generateEquipmentSetupItem();
    }
  }
}
