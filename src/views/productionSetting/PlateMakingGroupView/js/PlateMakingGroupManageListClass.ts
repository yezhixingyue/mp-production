import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IClassEquipmentGroups } from '@/store/modules/productionSetting/types';
import { PlateMakingGroupManageItemHandlerClass } from './PlateMakingGroupManageItemHandlerClass';
import { IPlateMakingGroup, IPlateMakingGroupSource } from './types';
import { filterClassEquipmentGroups } from './utils';

export class PlateMakingGroupManageListClass {
  /** 当前制版组所属制版工序ID */
  WorkID = ''

  list: IPlateMakingGroup[] = []

  listNumber = 0

  loading = false

  /** 当前设置项及对其的相关处理方法 */
  curEditItemHandler: null | PlateMakingGroupManageItemHandlerClass = null

  /** 设备组所需物料资源包 为null时说明未获取到该数据，需要获取该数据；为数组时说明已获取到该数据，数组为空时说明该制版组对应的制版工序不需要物料资源包 */
  MaterialSourcesData: null | IPlateMakingGroupSource[] = null

  /** 设备组相关数据 使用注意事项同上 */
  ClassEquipmentGroups: null | IClassEquipmentGroups[] = null

  setCurEditItemHandler(item: IPlateMakingGroup) {
    const t = this.list.find(it => it.ID === item.ID);
    if (!t) return;
    this.curEditItemHandler = new PlateMakingGroupManageItemHandlerClass(t);
  }

  init(WorkID: string) { // 该方法目前仅在切换顶部tab的时候进行调用
    /* 数据初始化
    ------------------ */
    this.WorkID = WorkID;
    this.list = [];
    this.listNumber = 0;
    this.loading = true;
    this.curEditItemHandler = null;
    this.MaterialSourcesData = null;
    this.ClassEquipmentGroups = null;

    this.getList();
    this.getPlateMakingGroupSource();
  }

  async getList() {
    if (!this.WorkID) return;
    this.loading = true;
    const resp = await api.getPlateMakingGroupList(this.WorkID).catch(() => null);
    this.loading = false;

    if (resp?.data.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 获取该制版工序下设备和物料来源数据 */
  async getPlateMakingGroupSource() {
    if (!this.WorkID || (this.MaterialSourcesData && this.ClassEquipmentGroups)) return;

    const resp = await api.getPlateMakingGroupSource(this.WorkID).catch(() => null);

    if (resp?.data.isSuccess) {
      this.ClassEquipmentGroups = filterClassEquipmentGroups(resp.data.Data.ClassEquipmentGroups);
      this.MaterialSourcesData = resp.data.Data.MaterialSources || [];
    }
  }

  /** 新增|编辑 */
  async handleItemChange(data: { ID: string, Name: string }, callback: () => void) {
    const temp = { ...data, WorkID: this.WorkID };
    const resp = await api.getPlateMakingGroupSave(temp).catch(() => null);
    if (resp?.data.isSuccess) {
      const isEdit = !!temp.ID;
      const cb = () => {
        if (isEdit) {
          const i = this.list.findIndex(it => it.ID === temp.ID);
          if (i > -1) {
            this.list.splice(i, 1, { ...this.list[i], ...data });
          }
        } else {
          const item: IPlateMakingGroup = {
            ...data,
            Equipments: [],
            Materials: [],
            ID: resp.data.Data,
          };
          this.list.unshift(item);
          this.listNumber += 1;
        }
        callback();
      };
      if (isEdit) {
        MpMessage.success({
          title: `${isEdit ? '编辑' : '添加'}成功`,
          onOk: cb,
          onCancel: cb,
        });
      } else {
        cb();
      }
    }
  }

  /** 删除 */
  async remove(it: IPlateMakingGroup) {
    const resp = await api.getPlateMakingGroupRemove(it.ID).catch(() => null);
    if (resp?.data.isSuccess) {
      const cb = () => {
        const i = this.list.findIndex(_it => _it.ID === it.ID);
        if (i > -1) {
          this.list.splice(i, 1);
          this.listNumber -= 1;
        }
      };
      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  }
}
