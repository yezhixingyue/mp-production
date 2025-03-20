import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { NormalLineCategoryTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { PlaceOrderMaterialSourceEnum, PrintColorEnum, PrintSideEnum } from './enums';
import { IImpositionTemplate, ILineDetailWorkingProcedure, ILineWorkingMaterialSources } from './ProductionLineDetailTypes';
import {
  IConvertAssistInfo, IConvertOrderFile, IFactoryMaterialList, IPrintColor, IProductionInstanceOriginData,
} from './types';
import { checkIsPositiveInteger, checkMobile, getDigitalImpositionTemplate } from './utils';
import { InstanceSettingsOnMakeupFileClass } from './InstanceSettingsOnMakeupFileClass';

/**
 * 手动下单生产线实例，组合生产线由多个该实例组成
 *
 * @export
 * @class PlaceOrderProductionInstance
 */
export class PlaceOrderProductionInstance extends InstanceSettingsOnMakeupFileClass { // 区分普通和组合生产线 ？
  // ID = ''

  // Name = '' // 需要把半成品名称赋值给该属性 ---------- 后续待处理 暂不需处理

  // Index = 0

  /** 实例数量 仅属于组合生产线内使用 */
  Number: number | '' = ''

  /** 数量单位 仅属于组合生产线内使用 */
  Unit = ''

  // Size = ''

  Width: '' | number = ''

  Height: '' | number = ''

  ColorList: PrintColorEnum[] = []

  PrintSide = PrintSideEnum.double;

  /** 使用物料 */
  Material = ''

  /** 物料来源 */
  MaterialSource: PlaceOrderMaterialSourceEnum | '' = ''

  /** 物料尺寸 - 非仓库领料需要传 */
  MaterialWidth: '' | number = ''

  MaterialHeight: '' | number = ''

  /** 上门取料地址 仅MaterialSource为上门取件时需要 */
  Address = {
    /** 收货人 */
    Consignee: '',
    /** 手机号 */
    Mobile: '',
    /** 详细地址 */
    AddressDetail: '',
  }

  /** 选中生产线 里面只赋值ID */
  LineList: { ID: string, Name: string }[] = []

  /** 工序 */
  WorkingList: ILineDetailWorkingProcedure[] = []

  /** 辅助信息列表 - 根据所选工序自动生成 */
  AssistList: IConvertAssistInfo[] = []

  /** 文件列表 在展示中分为拼版文件、辅助文件和专色文件 专色文件可以为空 | 拼版文件和专色文件 只能PDF */
  FileList: IConvertOrderFile[] = []

  /** 输出半成品, 仅属于组合生产线时使用 */
  SemiFinished: null | { ID: string, Name: string } = null

  /* 特殊情况处理及其需要用到的一些数据支撑
  ------------------------------------------------------- */
  _key = Math.random().toString(32).slice(-10)

  /** 当前实例是否属于组合生产线 */
  _isBelongToCombineLine = false

  /** 原始生产线数据 */
  _originLineData: null | IProductionInstanceOriginData = null

  /** 半成品物料来源相关信息 */
  _MaterialSource: null | ILineWorkingMaterialSources = null

  constructor(isCombine: boolean, originData: IProductionInstanceOriginData | null, MaterialSource?: ILineWorkingMaterialSources) {
    super();

    this._isBelongToCombineLine = isCombine;
    if (originData) {
      this._originLineData = originData;
      this.LineList = [{ ID: originData.ID, Name: originData.Name }];
    }
    if (MaterialSource) {
      this.SemiFinished = { ID: MaterialSource.MaterialTypeID, Name: MaterialSource.MaterialTypeName };
      this._MaterialSource = MaterialSource;
    }
  }

  /** 根据选中工序生成相关信息: WorkingList AssistList FileList */
  async handleWorkingSelect(index: number | '') {
    // 需要生成的数据有: WorkingList AssistList FileList  其中  FileList中包含拼版文件 辅助文件 和 专色文件 3种类型
    const _AssistList: IConvertAssistInfo[] = [];
    const _FileList: IConvertOrderFile[] = [];

    let _Template: IImpositionTemplate | null = null;
    if (this._originLineData?.Category === NormalLineCategoryTypeEnum.digital) {
      const t = this.WorkingList.find(it => it.Type === WorkingTypeEnum.print && !it.Template); // 印刷工序且未设置拼版模板（未绑定制版工序）
      if (t) {
        _Template = await getDigitalImpositionTemplate().catch(() => null);
        // const _Template = await getDigitalImpositionTemplate().catch(() => null);
        // if (_Template) {
        //   t.Template = _Template;
        // }
      }
    }

    this.WorkingList.forEach(it => {
      // 1. 拼版文件
      const Template = it.Type === WorkingTypeEnum.print ? it.Template || _Template : null;
      if (Template && !_FileList.find(_it => _it.Template?.ID === Template?.ID)) {
        const t = this.FileList.find(_it => _it.Template?.ID === Template?.ID);
        _FileList.push({
          UniqueName: t ? t.UniqueName : '',
          _File: t ? t._File : null,
          Template: {
            ID: Template.ID,
          },
          _PlateTemplate: Template,
          _LineInfo: {
            ID: this._originLineData?.ID || '',
            Name: this._originLineData?.Name || '',
            Index: index,
          },
          BleedBottom: t?.BleedBottom || '',
          BleedLeft: t?.BleedLeft || '',
          BleedRight: t?.BleedRight || '',
          BleedTop: t?.BleedTop || '',
        });
      }

      it.NoteInfos.forEach(NoteInfo => {
        // 2. 辅助文件
        if (NoteInfo.Type === AssistInfoTypeEnum.file && !_FileList.find(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID)) {
          const t = this.FileList.find(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID);
          _FileList.push({
            UniqueName: t ? t.UniqueName : '',
            _File: t ? t._File : null,
            AssistList: [{ ID: NoteInfo.ID }],
            _NoteInfo: NoteInfo,
            _LineInfo: {
              ID: this._originLineData?.ID || '',
              Name: this._originLineData?.Name || '',
              Index: index,
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
            FilePath: '',
          });
        }
      });
    });

    // 4. 补充原专色文件
    const list = this.FileList.filter(it => it.ColorList && it.ColorList.length > 0);
    _FileList.push(...list);

    this.AssistList = _AssistList;
    this.FileList = _FileList;
  }

  /** 处理专色文件变动 添加或删除 */
  handleSpecialColorChange(list: IPrintColor[], index: number | '') {
    const ids = list.map(it => it.ID);
    this.FileList = this.FileList.filter(it => !it._SpecialColorInfo || ids.includes(it._SpecialColorInfo.ID));
    const selectedIds = this.FileList.filter(it => it._SpecialColorInfo).map(it => it._SpecialColorInfo?.ID || '');

    const newColors = list.filter(it => !selectedIds.includes(it.ID));

    const newColorFiles = newColors.map(it => ({
      UniqueName: '',
      _File: null,
      ColorList: [it.ID],
      _SpecialColorInfo: it,
      _LineInfo: {
        ID: this._originLineData?.ID || '',
        Name: this._originLineData?.Name || '',
        Index: index,
      },
    }));

    this.FileList.push(...newColorFiles);
  }

  /** 处理数值变动 */
  handleNumbericChange(list: IConvertAssistInfo[]) {
    const textList = this.AssistList.filter(it => it.Type === AssistInfoTypeEnum.text);
    this.AssistList = [...textList, ...list];
  }

  /** 折手设置 */
  handleFoldingSubmit(params: object) {
    Object.entries(params).forEach(([key, value]) => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = value;
      }
    });
  }

  /** 当印刷工序取消时 清除掉一些信息 */
  clearInfoWhenClearPlateTemplate() {
    this.handleFoldingSubmit(new InstanceSettingsOnMakeupFileClass().getParams() || {});
  }

  _MaterialList: IFactoryMaterialList[] = []

  _CacheMaterialTypeIDs: string[] = []

  get _MaterialName() {
    if (!this.Material) return '';
    const t = this._MaterialList.find(it => it.ID === this.Material);
    return t ? t.Name : '';
  }

  async getMaterialList(TypeID: string) {
    if (this._CacheMaterialTypeIDs.includes(TypeID)) { // 已经获取过
      return;
    }
    const resp = await api.ManualOrderHandlerApis.getFactoryMaterialList(TypeID).catch(() => null);
    if (resp?.data?.isSuccess) {
      this._MaterialList.push(...resp.data.Data);
      this._CacheMaterialTypeIDs.push(TypeID);
    }
  }

  // check 后续补充校验该实例信息是否完整的方法

  /** 当前生产线实例名称 */
  get _LineInstanceName() {
    if (!this._isBelongToCombineLine) return '';
    return this.SemiFinished?.Name || '';
  }

  /** 合法性校验 */
  validate() {
    if (this.LineList.length === 0) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}未设置生产线` });
      return false;
    }

    if (this._isBelongToCombineLine) {
      if (!checkIsPositiveInteger(this.Number, `${this._LineInstanceName}数量`)) return false;

      if (!this.Unit) {
        MpMessage.error({ title: '操作失败', msg: `请输入${this._LineInstanceName}数量单位` });
        return false;
      }
    }

    if (!checkIsPositiveInteger(this.Width, `${this._LineInstanceName}尺寸宽`)) return false;
    if (!checkIsPositiveInteger(this.Height, `${this._LineInstanceName}尺寸高`)) return false;

    if (this.ColorList.length === 0) {
      MpMessage.error({ title: '操作失败', msg: `请选择${this._LineInstanceName}印色` });
      return false;
    }

    if (!this.Material) {
      MpMessage.error({ title: '操作失败', msg: `请选择${this._LineInstanceName}使用物料` });
      return false;
    }

    if (!this.MaterialSource && this.MaterialSource !== 0) {
      MpMessage.error({ title: '操作失败', msg: `请选择${this._LineInstanceName}物料来源` });
      return false;
    }

    if (this.MaterialSource !== PlaceOrderMaterialSourceEnum.warehouse) {
      if (!checkIsPositiveInteger(this.MaterialWidth, `${this._LineInstanceName}物料尺寸宽`)) return false;
      if (!checkIsPositiveInteger(this.MaterialHeight, `${this._LineInstanceName}物料尺寸高`)) return false;
    }

    if (this.MaterialSource === PlaceOrderMaterialSourceEnum.homePickup) {
      if (!this.Address.AddressDetail) {
        MpMessage.error({ title: '操作失败', msg: `请输入${this._LineInstanceName}物料取货地址` });
        return false;
      }
      if (!this.Address.Consignee) {
        MpMessage.error({ title: '操作失败', msg: `请输入${this._LineInstanceName}物料取货联系人姓名` });
        return false;
      }

      const result = checkMobile(this.Address.Mobile, `${this._LineInstanceName}物料取货联系人`);
      if (typeof result === 'string') {
        MpMessage.error({ title: '操作失败', msg: result });
        return false;
      }
    }

    // 右侧信息校验
    if (this.WorkingList.length === 0) {
      MpMessage.error({ title: '操作失败', msg: `未设置${this._LineInstanceName}代加工工序` });
      return false;
    }

    const text = this._LineInstanceName ? '中 ' : '';

    const _normalWorkingList = this.WorkingList.filter(w => w.Type === WorkingTypeEnum.normal);

    let target = _normalWorkingList.find(it => it.WorkTimes === '');
    if (target) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}${text}[${target.Name}] 工序未设置作业次数` });
      return false;
    }
    target = _normalWorkingList.find(it => (!/^\d+$/.test(`${it.WorkTimes}`) || (it.WorkTimes as number) <= 0));
    if (target) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}${text}[${target.Name}] 工序作业次数设置不正确，必须为正整数类型` });
      return false;
    }

    if (this.MaterialSource !== PlaceOrderMaterialSourceEnum.warehouse && !this.ForbitUnionMakeup) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}物料来源非仓库领料，此时应禁止印刷版合拼` });
      return false;
    }

    const t = this.FileList.find(it => !it._File);
    if (t) {
      MpMessage.error({
        title: '操作失败',
        msg: `${this._LineInstanceName}${text}[ ${t._NoteInfo?.Name || t._PlateTemplate?.Name || t._SpecialColorInfo?.Name} ] 未上传文件`,
      });
      return false;
    }

    return true;
  }

  // 后面需要加一个选中生产线的方法，在选中的同时生成辅助信息、拼版文件等信息， 可用物料？
}
