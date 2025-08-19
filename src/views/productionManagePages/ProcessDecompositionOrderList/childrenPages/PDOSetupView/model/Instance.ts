/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-len */
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { NormalLineCategoryTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { RemovePrivateProperties } from '@/types/types';
import { ILineDetailWorkingProcedure, ILineWorkingMaterialSources, IImpositionTemplate } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { IConvertAssistInfo, IProductionInstanceOriginData, IPrintColor, IFactoryMaterialList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { PrintColorEnum, PrintSideEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { getDigitalImpositionTemplate, checkIsPositiveInteger } from '@/views/productionManagePages/ManualOrderHandlerPage/js/utils';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { InstanceSettingInfo } from './InstanceSettingInfo';
import { IInstanceAttribute, IOrderFileInfo, TCraftResolveDetail, TDetailInstance } from '../../../types/types';
import { BindingEdgeEnum } from '../../../types/enum';

/**
 * 手动下单生产线实例，组合生产线由多个该实例组成
 *
 * @export
 * @class PlaceOrderProductionInstance
 */
export class PDOLineInstance extends InstanceSettingInfo {
  Attribute: IInstanceAttribute = {
    Material: {
      ID: '',
      Name: '',
      TypeID: '',
      TypeName: '',
    },
  }

  /** 实例数量 仅属于组合生产线内使用 */
  Number: number | '' = ''

  /** 数量单位 仅属于组合生产线内使用 */
  Unit = ''

  Width: '' | number = ''

  Height: '' | number = ''

  /** 是否需要厚度 */
  _needThickness = false

  Thickness: '' | number = ''

  ColorList: PrintColorEnum[] = []

  PrintSide = PrintSideEnum.double;

  /** 使用物料 */
  Material = ''

  /** 选中生产线 里面只赋值ID */
  LineList: [{ ID: string, Name: string }] | null = null

  /** 工序 */
  WorkingList: ILineDetailWorkingProcedure[] = []

  /** 辅助信息列表 - 根据所选工序自动生成 */
  AssistList: IConvertAssistInfo[] = []

  /** 文件列表 在展示中分为拼版文件、辅助文件和专色文件 专色文件可以为空 | 拼版文件和专色文件 只能PDF */
  FileList: IOrderFileInfo[] = []

  /** 输出半成品, 仅属于组合生产线时使用 */
  SemiFinished: null | { ID: string, Name: string } = null

  /* 特殊情况处理及其需要用到的一些数据支撑
  ------------------------------------------------------- */
  _key = Math.random().toString(32).slice(-10)

  /** 当前实例是否属于组合生产线 */
  _isInCombine = false

  /** 原始生产线数据 */
  _lineData: IProductionInstanceOriginData | null = null

  /** 半成品物料来源相关信息 */
  _MaterialSource: null | ILineWorkingMaterialSources = null

  constructor(inCombine: boolean, lineData: IProductionInstanceOriginData | null, MaterialSource?: ILineWorkingMaterialSources) {
    super();

    this._isInCombine = inCombine;

    this._lineData = lineData;
    this.LineList = lineData ? [{ ID: lineData.ID, Name: lineData.Name }] : null;

    if (lineData && lineData.Category === NormalLineCategoryTypeEnum.special) {
      this.ForbitUnionMakeup = true;
    }

    if (MaterialSource) {
      this.SemiFinished = { ID: MaterialSource.MaterialTypeID, Name: MaterialSource.MaterialTypeName };
      this._MaterialSource = MaterialSource;
    }
  }

  /** 详情数据还原 */
  restore(detailData: TDetailInstance | TCraftResolveDetail, colorList: IPrintColor[]) {
    const isCraftResolveDetail = (data: TDetailInstance | TCraftResolveDetail): data is TCraftResolveDetail => (data as TCraftResolveDetail).InstanceList?.length > 0;

    restoreInitDataByOrigin(this, detailData);
    // 需要还原的数据:
    // 1. 还原设置厚度
    if (!isCraftResolveDetail(detailData) && typeof detailData.Thickness === 'number' && detailData.Thickness >= 0) {
      this._needThickness = true;
    }

    // 2. 还原WorkingList
    this.WorkingList = [];
    detailData.WorkingList.forEach(it => {
      const t = this._lineData?.Detail.WorkingProcedures.find(_it => _it.ID === it.WorkingID);
      if (t) {
        t.WorkTimes = it.WorkTimes;
        this.WorkingList.push(t);
      }
    });

    // 3. 还原FileList
    this.FileList = [];
    detailData.FileList.forEach(it => {
      const _it: IOrderFileInfo = {
        ...it,
        _Line: {
          ID: this._lineData?.ID || '',
          Name: this._lineData?.Name || '',
        },
        _File: null,
        UniqueName: '',
        DownloadPath: '',
      };

      // 1. 处理专色文件 补充_SpecialColorInfo
      if (it.ColorList && it.ColorList.length > 0) {
        const t = colorList.find(c => c.ID === it.ColorList![0]);
        if (!t) {
          return;
        }
        _it._SpecialColorInfo = t;
      }
      // 2. 辅助
      if (it.AssistList) {
        _it.AssistList = it.AssistList;
        [_it._NoteInfo] = it.AssistList;
      }

      // 3. 拼版
      if (it.Template) {
        _it._PlateTemplate = it.Template;
      }

      this.FileList.push(_it);
    });

    // 4. 筛选文件和辅助信息
    this.handleWorkingSelect();
  }

  /** 根据选中工序生成相关信息: WorkingList AssistList FileList */
  async handleWorkingSelect() {
    // 需要生成的数据有: WorkingList AssistList FileList  其中  FileList中包含拼版文件 辅助文件 和 专色文件 3种类型
    const _AssistList: IConvertAssistInfo[] = [];
    const _FileList: IOrderFileInfo[] = [];

    let _Template: IImpositionTemplate | null = null;
    if (this._lineData?.Category === NormalLineCategoryTypeEnum.digital) {
      const t = this.WorkingList.find(it => it.Type === WorkingTypeEnum.print && !it.Template); // 印刷工序且未设置拼版模板（未绑定制版工序）
      if (t) {
        _Template = await getDigitalImpositionTemplate().catch(() => null);
      }
    }

    this.WorkingList.forEach(it => {
      // 1. 拼版文件
      let Template: IImpositionTemplate | null = null;
      if (_Template && it.Type === WorkingTypeEnum.print) Template = _Template;
      if (it.Template) Template = it.Template;

      if (Template && !_FileList.find(_it => _it.Template?.ID === Template?.ID)) {
        const t = this.FileList.find(_it => _it.Template?.ID === Template?.ID);
        const temp = this.FileList.find(_it => _it._PlateTemplate?.IsPrintingPlate);
        _FileList.push({
          ID: t?.ID,
          UniqueName: t?.UniqueName || '',
          FileName: t?.FileName || '',
          FilePath: t?.FilePath || '',
          _File: t?._File || null,
          Template,
          _PlateTemplate: Template,
          _Line: {
            ID: this._lineData?.ID || '',
            Name: this._lineData?.Name || '',
          },
          BleedBottom: temp ? temp.BleedBottom : '',
          BleedLeft: temp ? temp.BleedLeft : '',
          BleedRight: temp ? temp.BleedRight : '',
          BleedTop: temp ? temp.BleedTop : '',
          BindingEdge: temp && typeof temp.BindingEdge === 'number' && temp.BindingEdge >= 0 ? temp.BindingEdge : BindingEdgeEnum.None,
        });
      }

      it.NoteInfos.forEach(NoteInfo => {
        // 2. 辅助文件
        if (NoteInfo.Type === AssistInfoTypeEnum.file && !_FileList.find(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID)) {
          const _list = this.FileList.filter(_it => _it._NoteInfo && _it._NoteInfo.ID === NoteInfo.ID);
          if (_list.length > 0) {
            _list.forEach(t => {
              _FileList.push({
                ID: t?.ID,
                UniqueName: t.UniqueName || '',
                FileName: t.FileName || '',
                FilePath: t.FilePath || '',
                _File: t._File || null,
                AssistList: [{ ...NoteInfo }],
                _NoteInfo: NoteInfo,
                _Line: {
                  ID: this._lineData?.ID || '',
                  Name: this._lineData?.Name || '',
                },
                BindingEdge: BindingEdgeEnum.None,
              });
            });
          } else {
            _FileList.push({
              UniqueName: '',
              FileName: '',
              FilePath: '',
              _File: null,
              AssistList: [{ ...NoteInfo }],
              _NoteInfo: NoteInfo,
              _Line: {
                ID: this._lineData?.ID || '',
                Name: this._lineData?.Name || '',
              },
              BindingEdge: BindingEdgeEnum.None,
            });
          }
        }
        // 3. 辅助信息
        if (NoteInfo.Type === AssistInfoTypeEnum.text && !_AssistList.find(_it => _it.ID === NoteInfo.ID)) {
          const t = this.AssistList.find(_it => _it.ID === NoteInfo.ID);
          _AssistList.push({
            ...NoteInfo,
            // ID: NoteInfo.ID,
            // Name: NoteInfo.Name,
            // Type: NoteInfo.Type,
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

    // 5. 补充原数值信息
    const alist = this.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical);
    _AssistList.push(...alist);

    this.AssistList = _AssistList;
    this.FileList = _FileList;
  }

  /** 处理专色文件变动 添加或删除 */
  handleSpecialColorChange(list: IPrintColor[]) {
    const ids = list.map(it => it.ID);
    this.FileList = this.FileList.filter(it => !it._SpecialColorInfo || ids.includes(it._SpecialColorInfo.ID));
    const selectedIds = this.FileList.filter(it => it._SpecialColorInfo).map(it => it._SpecialColorInfo?.ID || '');

    const newColors = list.filter(it => !selectedIds.includes(it.ID));

    const newColorFiles = newColors.map(it => ({
      UniqueName: '',
      FileName: '',
      _File: null,
      ColorList: [it.ID],
      _SpecialColorInfo: it,
      _Line: {
        ID: this._lineData?.ID || '',
        Name: this._lineData?.Name || '',
      },
      BindingEdge: BindingEdgeEnum.None,
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
    this.handleFoldingSubmit(new InstanceSettingInfo().getParams(true) || {});
  }

  _MaterialList: IFactoryMaterialList[] = []

  _CacheMaterialTypeIDs: string[] = []

  async getMaterialList(TypeID: string) {
    if (this._CacheMaterialTypeIDs.includes(TypeID)) { // 已经获取过
      return;
    }
    const resp = await api.productionManageApis.getFactoryMaterialList(TypeID).catch(() => null);
    if (resp?.data?.isSuccess) {
      this._MaterialList.push(...resp.data.Data);
      this._CacheMaterialTypeIDs.push(TypeID);
    }
  }

  // check 后续补充校验该实例信息是否完整的方法

  /** 当前生产线实例名称 */
  get _LineInstanceName() {
    if (!this._isInCombine) return '';
    return this.SemiFinished?.Name || '';
  }

  /** 合法性校验 */
  validate(IsUploadFile: boolean, isCombineInstance = false) {
    if (this.LineList?.length !== 1) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}未设置生产线` });
      return false;
    }

    if (this._isInCombine) {
      if (!checkIsPositiveInteger(this.Number, `${this._LineInstanceName}数量`)) return false;

      if (!this.Unit) {
        MpMessage.error({ title: '操作失败', msg: `请输入${this._LineInstanceName}数量单位` });
        return false;
      }
    }

    if (!isCombineInstance) {
      if (!checkIsPositiveInteger(this.Width, `${this._LineInstanceName}尺寸宽`)) return false;
      if (!checkIsPositiveInteger(this.Height, `${this._LineInstanceName}尺寸高`)) return false;
      if (this._needThickness && !checkIsPositiveInteger(this.Thickness, `${this._LineInstanceName}尺寸厚`)) return false;

      if (this.ColorList.length === 0) {
        MpMessage.error({ title: '操作失败', msg: `请选择${this._LineInstanceName}印色` });
        return false;
      }

      if (!this.Material) {
        MpMessage.error({ title: '操作失败', msg: `请选择${this._LineInstanceName}使用物料` });
        return false;
      }
    }

    // 右侧信息校验
    if (this.WorkingList.length === 0) {
      MpMessage.error({ title: '操作失败', msg: `未设置${this._LineInstanceName}加工工序` });
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

    const tAssist = this.AssistList.find(it => it.Type === AssistInfoTypeEnum.text && !it.Content && Object.values(it.Position).filter(v => v).length > (it.Position.Equipment ? 1 : 0));
    if (tAssist) {
      MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName}辅助信息 [ ${tAssist.Name} ] 未填写内容` });
      return false;
    }

    if (!isCombineInstance) {
      if (this.NeedFolding === '') {
        MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName ? `[${this._LineInstanceName}] ` : ''}请勾选是否需要折手` });
        return false;
      }

      const t = this.FileList.find(it => it._PlateTemplate?.IsPrintingPlate && it.BleedLeft === '');
      if (t) {
        MpMessage.error({ title: '操作失败', msg: `${this._LineInstanceName ? `[${this._LineInstanceName}] ` : ''}未设置出血` });
        return false;
      }
    }

    if (IsUploadFile) { // 文件上传校验
      const t = this.FileList.find(it => !it._File && !it.FilePath && !it.UniqueName && !it.DownloadPath);
      if (t) {
        MpMessage.error({
          title: '操作失败',
          msg: `${this._LineInstanceName}${text}[ ${t._NoteInfo?.Name || t._PlateTemplate?.Name || t._SpecialColorInfo?.Name} ] 未上传文件`,
        });
        return false;
      }
    }
    return true;
  }

  getInstanceParams(ignore = false) {
    const temp = this.getParams(ignore);
    if (temp) {
      return {
        ...temp,
        WorkingList: temp.WorkingList.map(it => ({ ...it, WorkingID: it.ID, WorkingName: it.Name })),
      };
    }

    return null;
  }
  // 后面需要加一个选中生产线的方法，在选中的同时生成辅助信息、拼版文件等信息， 可用物料？
}

export type PDOLineInstanceType = RemovePrivateProperties<PDOLineInstance>
