import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElMessage } from 'element-plus';
import { IAssistantRelationGroup, IAssistantType } from '../../../types/types';

/** 设备助手类型和设备组关联类 */
export class TypeGroupRelationModel {
  target: IAssistantType

  constructor(item: IAssistantType) {
    this.target = item;
  }

  /** 执行设备关联 */
  async relation(GroupList: IAssistantRelationGroup[]) {
    const temp = {
      ID: this.target.ID,
      GroupList: GroupList.map(it => ({ ID: it.ID })),
    };

    const resp = await api.getAssistantRelationGroupSave(temp);
    if (resp.data?.isSuccess) {
      this.target.GroupList.push(...GroupList);
      return true;
    }

    return false;
  }

  /** 删除关联的设备组 */
  async remove(item: IAssistantRelationGroup) {
    const _handler = async () => {
      const resp = await api.getAssistantRelationGroupRemove(item.TypeID, item.ID);
      if (resp.data?.isSuccess) {
        ElMessage.success('删除成功');
        const i = this.target.GroupList.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.target.GroupList.splice(i, 1);
        }
      }
    };

    MpMessage.warn('确定删除该设备组吗?', `组名称：${item.Name}`, _handler);
  }

  /** 设置最大最小数量 */
  async setGroupMinMaxNumber(data: IAssistantRelationGroup) {
    const resp = await api.getAssistantRelationGroupMemberSetup(data);
    if (resp.data?.isSuccess) {
      const t = this.target.GroupList.find(it => it.ID === data.ID);
      if (t) {
        t.MinNumber = data.MinNumber;
        t.MaxNumber = data.MaxNumber;
      }

      return true;
    }

    return false;
  }
}
