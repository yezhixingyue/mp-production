import api from '@/api';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { ElMessage } from 'element-plus';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IAssistantType, IEquipmentGroupLevelItem } from '../../../types/types';
import { TypeEditRuleForm } from './ruleForm';
import { TypeGroupRelationModel } from './TypeGroupRelationModel';

export class AssistantTypeManageClass {
  /** 助手类型列表 */
  list: IAssistantType[] = []

  loaded = false

  /** 获取助手类型列表数据 */
  async getTypeList() {
    const resp = await api.getAssistantTypeList();
    if (resp.data?.isSuccess) {
      this.list = resp.data.Data;
      this.loaded = true;
    }
  }

  /** 新增或编辑一个助手类型条目 */
  async upsert(data: TypeEditRuleForm) {
    const resp = await api.getAssistantTypeSave(data);
    if (resp.data?.isSuccess) {
      if (data.ID === '') { // 新增
        this.list.unshift({
          ...data,
          ID: Number(resp.data.Data),
          CreateTime: getTimeConvertFormat({ withHMS: true }),
          GroupList: [],
        });
      } else { // 编辑
        const i = this.list.findIndex(it => it.ID === data.ID);
        if (i > -1) {
          this.list.splice(i, 1, { ...this.list[i], ...data, ID: this.list[i].ID });
        }
      }

      return true;
    }

    return false;
  }

  remove(item: IAssistantType) {
    const _handler = async () => {
      const resp = await api.getAssistantTypeRemove(item.ID);
      if (resp.data?.isSuccess) {
        ElMessage.success('删除成功');
        const i = this.list.findIndex(it => it.ID === item.ID);
        if (i > -1) {
          this.list.splice(i, 1);
        }
        if (this.relationModel?.target.ID === item.ID) { // 清除该分类当前正在设置的关联设备组
          this.relationModel = null;
        }
      }
    };

    MpMessage.warn('确定删除该类型吗?', `类型名称：${item.Name}`, _handler);
  }

  relationModel: null | TypeGroupRelationModel = null

  /** 设备分类/设备组 下拉筛选数据 */
  EquipmentGroupLevelList: IEquipmentGroupLevelItem[] = []

  /** 设置助手类型 */
  setTypeRelation(item: IAssistantType) {
    this.relationModel = new TypeGroupRelationModel(item);

    // 获取其它数据（设备分类、设备组列表数据） - 如果还没有获取的话
    this.getEquipmentGroupLevelList();
  }

  async getEquipmentGroupLevelList() {
    if (this.EquipmentGroupLevelList.length > 0) return;

    const resp = await api.getEquipmentGroup();
    if (resp.data?.isSuccess) {
      this.EquipmentGroupLevelList = resp.data.Data;
    }
  }
}
