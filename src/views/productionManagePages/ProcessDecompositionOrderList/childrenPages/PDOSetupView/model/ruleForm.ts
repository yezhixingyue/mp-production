import api from '@/api';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IPrintColor, IProductionInstanceOriginData, ProductLineSimpleType } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { RemovePrivateProperties } from '@/types/types';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { ILineWorkingMaterialSources } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { MaterialSourceTypeEnum } from '@/views/productionSetting/js/enums';
import { ElMessage } from 'element-plus';
import { PDOLineInstance, PDOLineInstanceType } from './Instance';
import { CraftSolveStepEnum } from '../../../types/enum';
import { TCraftResolveDetail } from '../../../types/types';
import { TProductionLineListData } from '../../../js/getProductionLineList';
import { FileUploader, IUploadFile } from './FileUpload';
import { getSpecialColorList } from '../components/PDOLineInstanceComps/js/requestTempDataAndCatch';

/** 工艺分解保存提交表单 */
export class PDOCraftResolveForm {
  /** 订单ID */
  ID: string

  /** 生产线类型 */
  Type: LineTypeEnum

  Line: ProductLineSimpleType | null = null

  /** 组合生产线自身实例数据 */
  CombineLineInstance: null | PDOLineInstanceType = null

  /** 半成品列表 */
  _SemifinishedList: ILineWorkingMaterialSources[] | null = null

  /** 单一生产线 或 组合生产线半成品实例 */
  InstanceList: PDOLineInstanceType[] = []

  ColorList: IPrintColor[] = []

  constructor(type: LineTypeEnum, OrderID: string) {
    this.ID = OrderID;
    this.Type = type;
  }

  /** 增删半成品实例 */
  removeOrAddInstance(type: 'remove' | 'add', index: number, m?: ILineWorkingMaterialSources) {
    if (type === 'remove' && index < this.InstanceList.length && index >= 0) { // 删除
      this.InstanceList.splice(index, 1);
    }

    if (type === 'add') {
      this.InstanceList.splice(index + 1, 0, new PDOLineInstance(true, null, m));
    }
  }

  /** 组合生产线自身工序发生改变 */
  onCombineWorkingChange() {
    const CombineWorkingList = this.CombineLineInstance?.WorkingList || []; // 当前选中的组合工序
    // 1. 根据当前选中的组合工序 生成半成品列表
    this._SemifinishedList = [];
    CombineWorkingList.forEach(w => {
      if (w.MaterialSources) {
        w.MaterialSources.forEach(m => {
          if (m.Feature === MakingGroupTypeFeatureEnum.semifinished && m.AllowSourceLine && m.SourceType === MaterialSourceTypeEnum.otherPrcess) {
            if (!this._SemifinishedList) return;
            const ids = this._SemifinishedList.map(it => it.MaterialTypeID);
            if (!ids.includes(m.MaterialTypeID)) {
              this._SemifinishedList.push(m);
            }
          }
        });
      }
    });
    this._SemifinishedList.sort((a, b) => {
      const n1 = a.NeedResource ? 0 : 1;
      const n2 = b.NeedResource ? 0 : 1;
      return n1 - n2;
    });

    // 2. 根据半成品列表 生成 必需的实例列表
    const _list: PDOLineInstanceType[] = [];
    this._SemifinishedList.forEach((m) => {
      const t = this.InstanceList.find(it => it.SemiFinished?.ID === m.MaterialTypeID);
      if (t) {
        _list.push(t);
      } else if (m.NeedResource) {
        _list.push(new PDOLineInstance(true, null, m));
      }
    });
    this.InstanceList = _list;
  }

  /** 还原 */
  async restore(data: { detail: TCraftResolveDetail; lineListData: TProductionLineListData }) {
    this.Type = LineTypeEnum.normal; // 初始占位赋值

    const { detail, lineListData } = data;

    if (detail.InstanceList.length === 0) return;

    let lineId = '';
    if (detail.LineList?.length && detail.LineList?.length > 0) { // 组合生产线
      if (!detail.LineList?.[0]?.ID) return;
      this.Type = LineTypeEnum.combine;
      lineId = detail.LineList[0].ID;
    } else {
      if (!detail.InstanceList[0].LineList?.[0]?.ID) return;

      lineId = detail.InstanceList[0].LineList[0].ID;
    }

    const target = lineListData.originData.find(it => it.ID === lineId);
    if (!target) {
      ElMessage.error({ message: '找不到可用生产线，数据还原失败', duration: 5000 });
      return;
    }

    this.Type = target.Type;
    this.onLineChange(target, detail, lineListData);
  }

  /** 选择生产线 兼生产线数据还原（如果传递的有还原数据的话） */
  async onLineChange(line: PDOCraftResolveForm['Line'], detailData?: TCraftResolveDetail, lineListData?: TProductionLineListData) {
    if (!line) return;
    if (this.Line && line.ID === this.Line.ID && line.Name === this.Line.Name) {
      return; // 没有变化
    }

    this.Line = line;

    // 还原其余一切状态 - 除生产线类型Type
    const resp = await api.productionManageApis.getProductionLineDetail(line.ID);
    if (resp.data?.isSuccess) {
      // 1. 数据初始化
      this.CombineLineInstance = null;
      this.InstanceList = [];
      this._SemifinishedList = [];

      const _lineData = {
        ID: line.ID,
        Name: line.Name,
        Type: line.Type,
        Category: line.Category,
        Detail: resp.data.Data,
      };

      // 处理单一生产线：
      if (this.Type === LineTypeEnum.normal) {
        this.InstanceList = [new PDOLineInstance(false, _lineData)];

        if (detailData?.InstanceList?.[0]) { // 单一生产线数据还原
          this.ColorList = await getSpecialColorList();
          this.InstanceList[0].restore(detailData.InstanceList[0], this.ColorList);
        }
      }

      // 处理组合生产线
      if (this.Type === LineTypeEnum.combine) {
        this.CombineLineInstance = new PDOLineInstance(false, _lineData);

        if (detailData) { // 组合生产线数据还原
          this.ColorList = await getSpecialColorList();

          this.CombineLineInstance.restore(detailData, this.ColorList);

          this.onCombineWorkingChange();

          this.InstanceList = [];
          const _InstanceList = [...detailData.InstanceList];

          await Promise.all(_InstanceList.map(async insDetail => {
            const line = lineListData?.originData.find(it => it.ID === insDetail.LineList?.[0].ID);
            if (!line) {
              ElMessage.error({ message: `找不到可用生产线:${insDetail.LineList?.[0].Name || ''}，部分半成品还原失败`, duration: 5000 });
              return;
            }

            const m = this._SemifinishedList?.find(it => it.MaterialTypeID === insDetail.SemiFinished?.ID);
            if (!m) {
              ElMessage.error({ message: `组合生产线发生变动:${insDetail.SemiFinished?.Name || '部分半成品'}找不到`, duration: 5000 });
              return;
            }

            const resp = await api.productionManageApis.getProductionLineDetail(line.ID);
            if (resp.data?.isSuccess) {
              const _lineData = {
                ID: line.ID,
                Name: line.Name,
                Type: line.Type,
                Category: line.Category,
                Detail: resp.data.Data,
              };
              const instance = new PDOLineInstance(true, _lineData, m);
              this.InstanceList.push(instance);
              instance.restore(insDetail, this.ColorList);
            }
          }));

          // 补充必需半成品
          const ids = this.InstanceList.map(it => it.SemiFinished?.ID);
          const requiredList = this._SemifinishedList.filter(it => it.NeedResource && !ids.includes(it.MaterialTypeID));
          if (requiredList.length > 0) {
            requiredList.forEach(it => {
              this.InstanceList.push(new PDOLineInstance(true, null, it));
            });
          }

          this.InstanceList.sort((a, b) => {
            let aIndex = this._SemifinishedList?.findIndex(it => it.MaterialTypeID === a.SemiFinished?.ID);
            let bIndex = this._SemifinishedList?.findIndex(it => it.MaterialTypeID === b.SemiFinished?.ID);

            if (aIndex === -1 || aIndex === undefined) aIndex = 9999;
            if (bIndex === -1 || bIndex === undefined) bIndex = 9999;
            return aIndex - bIndex;
          });
        }
      }
    }
  }

  /** 组合生产线 半成品 重新选中生产线 */
  resetInstanceLineData(lineData: IProductionInstanceOriginData, index: number) {
    this.InstanceList[index] = new PDOLineInstance(true, lineData, this.InstanceList[index]._MaterialSource || undefined);
  }

  /** 提交前校验 */
  private _validate(IsUploadFile: boolean) {
    if (this.CombineLineInstance && !this.CombineLineInstance.validate(IsUploadFile, true)) {
      return false;
    }

    if (this.InstanceList.length === 0) return false;

    return this.InstanceList.every(it => it.validate(IsUploadFile));
  }

  uploader = new FileUploader()

  async getParams(IsUploadFile: boolean) {
    if (!this._validate(IsUploadFile)) return null;
    // 上传文件
    // 1. 文件收集 -------- 后续需要补充组合生产线最外层文件
    const fileList: IUploadFile[] = []; // indexes第1项为-1时 位于组合生产线上
    if (this.CombineLineInstance) {
      this.CombineLineInstance.FileList.forEach((it, i) => {
        if (it._File) {
          const temp: IUploadFile = {
            indexes: [-1, i],
            file: it,
          };
          fileList.push(temp);
        }
      });
    }
    this.InstanceList.forEach((instance, index) => {
      instance.FileList.forEach((it, i) => {
        if (it._File) {
          const temp: IUploadFile = {
            indexes: [index, i],
            file: it,
          };
          fileList.push(temp);
        }
      });
    });

    // 2. 文件上传及文件名称整理替换（内部完成）
    if (!await this.uploader.setUpload(fileList)) return null;

    // 3. 参数获取
    const temp = {
      ID: this.ID,
      InstanceList: this.InstanceList.map(it => it.getInstanceParams()),
      CraftResolve: {
        Step: IsUploadFile ? CraftSolveStepEnum.UploadFile : CraftSolveStepEnum.Save,
        ColorList: this.ColorList,
      },
      ...(this.CombineLineInstance ? this.CombineLineInstance.getInstanceParams(true) : {}),
    };

    // 4. 数据返回
    return temp;
  }
}

export type TPDOCraftResolveForm = RemovePrivateProperties<PDOCraftResolveForm>
