import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { validateDateValue } from '@/components/common/ElementPlusContainners/MpDateTimePicker/utils';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MaterialSourceTypeEnum } from '@/views/productionSetting/js/enums';
import { ReceiveTypeEnum } from './enums';
import { PlaceOrderProductionInstance } from './PlaceOrderProductionInstance';
import { ILineDetailWorkingProcedure, ILineWorkingMaterialSources, IProductionLineDetail } from './ProductionLineDetailTypes';
import {
  IConvertAssistInfo, IConvertOrderFile, IProductionInstanceOriginData, ISubmitParams, ProductLineSimpleType,
} from './types';
import { checkMobile } from './utils';

export class PlaceOrderClass {
  OrderID = ''

  /** 工期时间 */
  ProducePeriod = {
    /** 发货时间 */
    ShiftTime: '',
  }

  /** 客户信息 */
  Customer = {
    CustomerName: '',
    Mobile: '',
  }

  /** 交货方式 */
  ReceiveType: ReceiveTypeEnum | '' = ''

  /** 收货信息 */
  Address = {
    Express: {
      First: '',
      Second: '',
    },
    ExpressText: '',
    Address: {
      Consignee: '',
      Mobile: '',
      AddressDetail: '',
    },
  }

  /** 产品信息 */
  Attribute: { ProductAmount: '' | number, Unit: string, Size: string } = {
    /** 产品数量 */
    ProductAmount: '',
    /** 数量单位 */
    Unit: '',
    /** 组合生产线成品尺寸 */
    Size: '',
  }

  /** 需要打包 */
  NeedPacked = false

  /** 印刷内容 */
  Content = ''

  /** 价格信息 */
  Funds = {
    /** 成交价(不包含运费) */
    FinalPrice: '',
    /** 运费 */
    Freight: '',
  }

  /** 选中的组合生产线 里面只赋值ID */
  LineList: { ID: string }[] = []

  /** 组合生产线工序列表 */
  WorkingList: ILineDetailWorkingProcedure[] = []

  /** 辅助信息列表 - 根据所选工序自动生成 */
  AssistList: IConvertAssistInfo[] = []

  /** 文件列表 在展示中分为拼版文件、辅助文件和专色文件 专色文件可以为空 | 拼版文件和专色文件 只能PDF */
  FileList: IConvertOrderFile[] = []

  InstanceList: PlaceOrderProductionInstance[] = []

  /** 生产线类型：是否单一生产线 */
  _curLineType = LineTypeEnum.normal

  /** 当前选中的单一生产线 --- 或可在选择生产线后直接生成实例，当前选中生产线也放置到实例中，下面同此 -- 暂时保留 */
  _curSinigleLine: null | IProductionInstanceOriginData = null

  /** 生产线实例 */
  _SingleInstanceList: PlaceOrderProductionInstance[] = []

  /** 当前选中的组合生产线 */
  _curCombineLine: null | IProductionInstanceOriginData = null

  /** 组合生产线实例 */
  _CombineInstanceList: PlaceOrderProductionInstance[] = []

  /** 当前组合生产线半成品列表（必需的半成品自动填充到列表中，剩余的可以在其中选择） */
  _AllMaterialSources: ILineWorkingMaterialSources[] = []

  async submit() {
    const temp: Partial<ISubmitParams> = {
      ...this,
    };

    if (temp.ReceiveType === ReceiveTypeEnum.pickupBySelf) {
      delete temp.Address;
    }

    if (this._curLineType === LineTypeEnum.normal) {
      temp.Attribute = {
        ...this.Attribute,
        Size: '',
      };

      delete temp.AssistList;
      delete temp.LineList;
      delete temp.FileList;
      delete temp.WorkingList;

      temp.InstanceList = this._SingleInstanceList;
    } else {
      temp.InstanceList = this._CombineInstanceList;
      if (temp.FileList) {
        temp.FileList = temp.FileList.map(f => {
          const t = {
            UniqueName: f.UniqueName,
            Plate: f.Plate,
            AssistList: f.AssistList,
            SpecialColorList: f.SpecialColorList,
          };
          if (!f.Plate) delete t.Plate;
          if (!f.AssistList?.length) delete t.AssistList;
          if (!f.SpecialColorList?.length) delete t.SpecialColorList;
          return t;
        });
      }
    }

    delete temp._AllMaterialSources;
    delete temp._CombineInstanceList;
    delete temp._SingleInstanceList;
    delete temp._curCombineLine;
    delete temp._curLineType;
    delete temp._curSinigleLine;

    temp.InstanceList = temp.InstanceList.map(it => {
      const _it = {
        ...it,
        FileList: it.FileList?.map(f => {
          const t = {
            UniqueName: f.UniqueName,
            Plate: f.Plate,
            AssistList: f.AssistList,
            SpecialColorList: f.SpecialColorList,
          };
          if (!f.Plate) delete t.Plate;
          if (!f.AssistList?.length) delete t.AssistList;
          if (!f.SpecialColorList?.length) delete t.SpecialColorList;
          return t;
        }) || [],
      };
      delete _it._MaterialSource;
      delete _it._originLineData;
      delete _it._isBelongToCombineLine;
      delete _it._MaterialList;
      delete _it._key;
      delete _it._CacheMaterialTypeIDs;

      return _it;
    });

    const resp = await api.ManualOrderHandlerApis.getCreateOrder(temp).catch(() => null);

    if (resp?.data.isSuccess) {
      this.OrderID = resp.data.Data as string;
      return true;
    }
    return false;
  }

  /**
   * 校验订单信息（第一步）是否正确
   *
   * @memberof PlaceOrderClass
   */
  validateFirstStep() {
    let msg = validateDateValue(this.ProducePeriod.ShiftTime, '发货时间', { Date: new Date(), Name: '当前时间' });
    if (typeof msg === 'string') {
      MpMessage.error({ title: '操作失败', msg });
      return false;
    }

    if (!this.Customer.CustomerName) {
      MpMessage.error({ title: '操作失败', msg: '请输入客户名称' });
      return false;
    }

    msg = checkMobile(this.Customer.Mobile, '客户');
    if (typeof msg === 'string') {
      MpMessage.error({ title: '操作失败', msg });
      return false;
    }

    if (this.ReceiveType === '') {
      MpMessage.error({ title: '操作失败', msg: '请选择交货方式' });
      return false;
    }

    if (this.ReceiveType !== ReceiveTypeEnum.pickupBySelf) { // 需要校验收货地址 收货人 手机号
      if (!this.Address.Address.AddressDetail) {
        MpMessage.error({ title: '操作失败', msg: '请输入收货地址' });
        return false;
      }
      if (!this.Address.Address.Consignee) {
        MpMessage.error({ title: '操作失败', msg: '请输入收货人' });
        return false;
      }
      msg = checkMobile(this.Address.Address.Mobile, '收货人');
      if (typeof msg === 'string') {
        MpMessage.error({ title: '操作失败', msg });
        return false;
      }
    }

    return true;
  }

  /** 校验第二步基础信息是否完整： 产品数量、数量单位、印刷内容 与组合生产线时的一些校验 */
  private _validateSecondBasicInfo() {
    if (!this.Attribute.ProductAmount && this.Attribute.ProductAmount !== 0) {
      MpMessage.error({ title: '操作失败', msg: '请输入产品数量' });
      return false;
    }

    if (!/^\d+$/.test(`${this.Attribute.ProductAmount}`) || this.Attribute.ProductAmount === 0) {
      MpMessage.error({ title: '操作失败', msg: '产品数量输入不正确，必须为正整数，请检查' });
      return false;
    }

    if (!this.Attribute.Unit) {
      MpMessage.error({ title: '操作失败', msg: '请输入产品数量单位' });
      return false;
    }

    if (!this.Content) {
      MpMessage.error({ title: '操作失败', msg: '请输入印刷内容' });
      return false;
    }

    if (this._curLineType === LineTypeEnum.normal) {
      // 调用_SingleInstanceList上的校验信息获取结果 -- 后面补充该校验方法
      if (this._SingleInstanceList.length === 0) {
        MpMessage.error({ title: '操作失败', msg: '请选择生产线' });
        return false;
      }
    }

    if (this._curLineType === LineTypeEnum.combine) {
      if (!this._curCombineLine) {
        MpMessage.error({ title: '操作失败', msg: '请选择组合生产线' });
        return false;
      }
      if (!this.Attribute.Size) {
        MpMessage.error({ title: '操作失败', msg: '请设置成品尺寸' });
        return false;
      }
      if (this.WorkingList.length === 0) {
        MpMessage.error({ title: '操作失败', msg: '请添加工序' });
        return false;
      }

      let target = this.WorkingList.find(it => it.WorkTimes === '');
      if (target) {
        MpMessage.error({ title: '操作失败', msg: `[${target.Name}] 工序未设置作业次数` });
        return false;
      }
      target = this.WorkingList.find(it => (!/^\d+$/.test(`${it.WorkTimes}`) || it.WorkTimes <= 0));
      if (target) {
        MpMessage.error({ title: '操作失败', msg: `[${target.Name}] 工序作业次数设置不正确，必须为正整数类型` });
        return false;
      }

      const t = this.FileList.find(it => !it._File);
      if (t) {
        MpMessage.error({
          title: '操作失败',
          msg: `[ ${t._NoteInfo?.Name || t._PlateTemplate?.Name || t._SpecialColorInfo?.Name} ] 未上传文件`,
        });
        return false;
      }
    }

    return true;
  }

  /** 校验第二步 */
  validateSecondStep() {
    // 1. 校验第二步中基础信息是否完整
    if (!this._validateSecondBasicInfo()) return false;

    // 2. 校验单一生产线信息是否完整 -- 如果当前选中单一生产线
    if (this._curLineType === LineTypeEnum.normal && !this._SingleInstanceList[0]?.validate()) return false;

    // 3. 校验组合生产线信息是否完整 -- 如果当前选中组合生产线
    if (this._curLineType === LineTypeEnum.combine) {
      // 循环调用_CombineInstanceList上的校验信息获取最终汇总结果 -- 后面补充该校验方法
      for (let i = 0; i < this._CombineInstanceList.length; i += 1) {
        const item = this._CombineInstanceList[i];
        if (!item.validate()) return false;
      }
    }

    return true;
  }

  /** 校验第三步 */
  validateThirdSep() {
    const { FinalPrice, Freight } = this.Funds;

    if (!FinalPrice) {
      MpMessage.error({ title: '操作失败', msg: '请输入价格' });
      return false;
    }

    const reg = /^\d+(.\d)?$/;

    if (!reg.test(FinalPrice)) {
      MpMessage.error({ title: '操作失败', msg: '价格输入不正确，请输入数字类型，不能小于0，最多1位小数' });
      return false;
    }

    if (!Freight) {
      MpMessage.error({ title: '操作失败', msg: '请输入运费' });
      return false;
    }

    if (!reg.test(Freight)) {
      MpMessage.error({ title: '操作失败', msg: '运费输入不正确，请输入数字类型，不能小于0，最多1位小数' });
      return false;
    }

    return true;
  }

  /** 设置当前生产线 根据参数区分单一和组合生产线 */
  async setCurProdutionLine(item: ProductLineSimpleType) {
    const resp = await api.ManualOrderHandlerApis.getProductionLineDetail(item.ID).catch(() => null);
    if (!resp) return;
    const Detail: IProductionLineDetail = resp.data.Data;
    const _originData: IProductionInstanceOriginData = {
      ...item,
      Detail,
    };
    switch (this._curLineType) {
      case LineTypeEnum.normal:
        if ((!this._curSinigleLine || this._curSinigleLine.ID !== item.ID)) {
          this._curSinigleLine = _originData;
          // 单一生产线自动使用上面已选生产线生成相关信息
          this._SingleInstanceList = [new PlaceOrderProductionInstance(false, _originData)];
        }
        break;
      case LineTypeEnum.combine:
        if (!this._curCombineLine || this._curCombineLine.ID !== item.ID) {
          this._curCombineLine = _originData;
          // 此处获取数据并生成生产线实例 -- 组合生产线应在添加工序后生成半成品生产线实例信息 （1. 半成品   2. 来自其它生产线  3. 去重）
          this.LineList = [{ ID: _originData.ID }];
          this.WorkingList = [];
          this.AssistList = [];
          this.FileList = [];
          this._CombineInstanceList = [];
          this._AllMaterialSources = [];
          this.Attribute.Size = '';
        }
        break;
      default:
        break;
    }
  }

  /** 组合生产线  添加工序 | 删除工序 后的对应处理函数： 用于生成半成品生产线实例： 1. 半成品   2. 来自其它生产线  3. 去重  4. 必需 */
  handleWorkingSelect() {
    const list: PlaceOrderProductionInstance[] = [];

    // 1. 定义组合生产线中根据所选工序计算出来的所有可用到的半成品列表 -- 包含必需和非必需 必需的排至前面
    const _AllMaterialSources: ILineWorkingMaterialSources[] = [];
    const _AssistList: IConvertAssistInfo[] = [];
    const _FileList: IConvertOrderFile[] = [];

    // 2. 对上面列表进行赋值
    this.WorkingList.forEach(w => {
      if (w.MaterialSources) {
        w.MaterialSources.forEach(m => {
          if (m.Feature === MakingGroupTypeFeatureEnum.semifinished && m.SourceType === MaterialSourceTypeEnum.otherLine) {
            const ids = _AllMaterialSources.map(it => it.MaterialTypeID);
            if (!ids.includes(m.MaterialTypeID)) {
              if (!m.NeedSource) {
                _AllMaterialSources.push(m);
              } else { // 把必需的半成品排至前列
                const i = _AllMaterialSources.findIndex(it => !it.NeedSource);
                _AllMaterialSources.splice(i > -1 ? i : 0, 0, m);
              }
            }
          }
        });
      }

      w.NoteInfos.forEach(NoteInfo => {
        // 2. 辅助文件
        if (NoteInfo.Type === AssistInfoTypeEnum.file && !_FileList.find(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID)) {
          const t = this.FileList.find(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID);
          _FileList.push({
            UniqueName: t ? t.UniqueName : '',
            _File: t ? t._File : null,
            AssistList: [NoteInfo.ID],
            _NoteInfo: NoteInfo,
            _LineInfo: {
              ID: this._curCombineLine?.ID || '',
              Name: this._curCombineLine?.Name || '',
              Index: '',
            },
          });
        }
        // 3. 辅助信息
        if (NoteInfo.Type === AssistInfoTypeEnum.text && !_AssistList.find(_it => _it.ID === NoteInfo.ID)) {
          const t = this.AssistList.find(_it => _it.ID === NoteInfo.ID);
          _AssistList.push({
            ID: NoteInfo.ID,
            _Name: NoteInfo.Name,
            Type: NoteInfo.Type,
            Content: t ? t.Content : '',
            Value: '',
          });
        }
      });
    });

    // 3. 生成半成品实例数据 _CombineInstanceList  1. 必需的半成品必须生成  2. 原已经添加的非必需半成品数据给予保留
    _AllMaterialSources.forEach((m) => {
      const t = this._CombineInstanceList.find(it => it.SemiFinished.ID === m.MaterialTypeID);
      if (t) {
        list.push(t);
      } else if (m.NeedSource) {
        list.push(new PlaceOrderProductionInstance(true, null, m));
      }
    });

    // 4. 完成赋值
    this._AllMaterialSources = _AllMaterialSources;
    this._CombineInstanceList = list;
    this.AssistList = _AssistList;
    this.FileList = _FileList;
  }

  /** 处理数值变动 */
  handleNumbericChange(list: IConvertAssistInfo[]) {
    const textList = this.AssistList.filter(it => it.Type === AssistInfoTypeEnum.text);
    this.AssistList = [...textList, ...list];
  }

  /** 组合生产线实例选中或切换生产线 */
  setCombineSingleLineInstance(itemData: PlaceOrderProductionInstance, originData: IProductionInstanceOriginData) {
    const i = this._CombineInstanceList.findIndex(it => it === itemData);
    if (i < 0) return;
    this._CombineInstanceList[i] = new PlaceOrderProductionInstance(itemData._isBelongToCombineLine, originData, itemData._MaterialSource || undefined);
  }

  /** 删除半成品实例 */
  removeCombineSingleLineInstance(itemData: PlaceOrderProductionInstance) {
    const i = this._CombineInstanceList.findIndex(it => it === itemData);
    if (i < 0) return;
    this._CombineInstanceList.splice(i, 1);
  }
}
