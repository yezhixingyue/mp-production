import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { IExceptionPlate, ITaskExceptionDetail } from '../../js/type';
import { RevocationTypeEnum, SolveTypeEnum } from './enum';
import { HandleRevocationChunkSelectClass } from './HandleRevocationChunkSelectClass';
import { RightExternalClass } from './RightExternalClass';
import { IExceptionPlate4Form, IExceptionWorking4RuleForm, IRedoInfo4RuleForm } from './ruleFormType';
import { IExceptionSubmitParams, IRevocationDetail, IRevocationPlateItem } from './type';
import { getRedoFormPlateList, getSubmitInfoFromPlateList } from './utils';

export class HandleExceptionRuleForm {
  /** 异常ID */
  ID = ''

  /** 报工方式 */
  _ReportMode: '' | ReportModeEnum = ''

  /** 处理方式：撤职拼版前、重做、继续生产 */
  SolveType: SolveTypeEnum | '' = ''

  /** 撤销信息 需要分解为：订单块列表、大版列表、其它块列表 */
  RevocationInfo: IRevocationDetail = {
    /** 撤销此订单 - 块列表是否全选 */
    IsAllSelected: false, // 仅当撤销此订单时传该值
    Type: '',
    PlateList: [], // 订单报工根据Type（为指定大版）类型需要传递
    ChunkList: [], // 订单报工根据Type（为订单或其它块）类型需要传递，其它块（所有报工方式）需要传递
  }

  /** TaskExceptionDetail */
  TaskExceptionDetail: null | ITaskExceptionDetail = null

  /** 撤销此订单 - 块列表 */
  _RevocationOrderChunkList: (IRevocationDetail['ChunkList'][number] & { checked: boolean })[] = []

  /** 撤销大版 - 大版列表 */
  _RevocationPlateList: IRevocationPlateItem[] = []

  /** 选择其他块的大版列表 */
  _PlateChunkSelectList: HandleRevocationChunkSelectClass[] = []

  /** 重做信息 */
  RedoInfo: IRedoInfo4RuleForm = {
    UnionLine: null,
    PlateList: [],
  }

  /** 外协处理 */
  ExternalFactory: null | RightExternalClass = null

  constructor(IsOutSourcing: boolean) {
    if (IsOutSourcing) {
      this.ExternalFactory = new RightExternalClass();
    }
  }

  init(TaskExceptionDetail: ITaskExceptionDetail) {
    this.TaskExceptionDetail = TaskExceptionDetail;
    this.ID = TaskExceptionDetail.ID;
    this._ReportMode = TaskExceptionDetail.TaskDetail.Working.ReportMode;

    this._PlateChunkSelectList = TaskExceptionDetail.PlateList.map(it => new HandleRevocationChunkSelectClass(it));

    if (this.ExternalFactory) {
      this.ExternalFactory.init(TaskExceptionDetail);
    }

    function getRevocationPlateList(PlateList: null): null;
    function getRevocationPlateList(PlateList: IExceptionPlate[]): IRevocationPlateItem[];
    function getRevocationPlateList(PlateList: IExceptionPlate[] | null): IRevocationPlateItem[] | null {
      if (!PlateList) return null;
      return PlateList.map(it => ({
        ...it,
        checked: false,
        ChildList: it.ChildList ? getRevocationPlateList(it.ChildList) : null,
      }));
    }

    this._RevocationPlateList = getRevocationPlateList(TaskExceptionDetail.PlateList); // 撤销大版列表

    TaskExceptionDetail.PlateList.forEach(p => {
      if (p.ChunkList) this._RevocationOrderChunkList.push(...p.ChunkList.map(c => ({ ...c, checked: false })));
    });

    /** 订单报工 组合生产线工序列表数据 */
    if (this._ReportMode === ReportModeEnum.order && TaskExceptionDetail.UnionLine) {
      this.RedoInfo.UnionLine = {
        ...TaskExceptionDetail.UnionLine,
        WorkingList: TaskExceptionDetail.UnionLine.WorkingList.map(it => ({
          ...it, checked: false, _ReceiveMaterial: it.ReceiveMaterial, ReceiveMaterial: false, _PlateMaking: it.PlateMaking, PlateMaking: false,
        })),
      };
    }

    /** 大版列表数据 */
    this.RedoInfo.PlateList = getRedoFormPlateList(TaskExceptionDetail.PlateList, this._ReportMode);
  }

  /** 判断一个大版上的重新生产功能是否处于禁用状态 */
  static getPlateIsDisabledTrue(parentPlate?:IExceptionPlate4Form) {
    if (parentPlate) {
      if (parentPlate.Reproduce?._remark && parentPlate.Redoable) return true;
      return HandleExceptionRuleForm.getPlateIsDisabledTrue(parentPlate.parentPlate);
    }
    return false;
  }

  /** 判断一个大版上的块工序是否处于禁用状态 */
  static getWorkingIsDisabledTrue(
    plate: IExceptionPlate4Form,
    working: IExceptionWorking4RuleForm,
    PlateList: IExceptionPlate4Form[],
    parentPlate?:IExceptionPlate4Form,
  ) { // 获取大版上的块工序是否处于禁用状态
    if (plate.Reproduce?._remark && plate.Redoable) return true;
    if (HandleExceptionRuleForm.getPlateIsDisabledTrue(parentPlate || plate.parentPlate)) return true;
    if (!working.UnionChunkID) return false;

    const _findTargetPlate = (_PlateList: IExceptionPlate4Form[] | null) => {
      if (!_PlateList || _PlateList.length === 0) return undefined;
      const t = _PlateList.find(it => {
        if (it.ID !== plate.ID && it.Reproduce?._remark) {
          const targetChunk = it.ChunkList.find(chunk => chunk.WorkingList.find(w => w.UnionChunkID && w.UnionChunkID === working.UnionChunkID));
          if (targetChunk) return true;
          const targetPlate = _findTargetPlate(it.ChildList);
          if (targetPlate) return true;
        }

        return false;
      });

      return t;
    };

    const target = _findTargetPlate(PlateList);

    return !!target;
  }

  _getHandleParams(): IExceptionSubmitParams | null {
    const _params = { ID: this.ID, SolveType: this.SolveType };

    // 3. 如果选择的是撤销方式
    if (this.SolveType === SolveTypeEnum.rollbackBeforeMakeup) {
      if (this.RevocationInfo.Type === '') {
        MpMessage.error('保存失败', '请选择撤销方式');
        return null;
      }

      if ([RevocationTypeEnum.CurrentChunk, RevocationTypeEnum.CurrentPlate].includes(this.RevocationInfo.Type)
        || (this.RevocationInfo.Type === RevocationTypeEnum.CurrentOrder && this._ReportMode === ReportModeEnum.block)) {
        // 撤销此大版、撤销当前块、撤销此订单（块报工时）可直接返回结果
        return {
          ..._params,
          RevocationInfo: { Type: this.RevocationInfo.Type },
        };
      }

      if (this.RevocationInfo.Type === RevocationTypeEnum.FixedPlate) { // 指定大版
        const _RevocationPlateList: { ID: string }[] = [];
        const getSubmitRevocationPlateList = (list: IRevocationPlateItem[]) => {
          list.forEach(p => {
            if (p.checked) {
              _RevocationPlateList.push({ ID: p.ID });
            } else if (p.ChildList) {
              getSubmitRevocationPlateList(p.ChildList);
            }
          });
        };
        getSubmitRevocationPlateList(this._RevocationPlateList);

        if (_RevocationPlateList.length === 0) {
          MpMessage.error('保存失败', '请选择要撤销的大版');
          return null;
        }
        return {
          ..._params,
          RevocationInfo: { Type: this.RevocationInfo.Type, PlateList: _RevocationPlateList },
        };
      }

      if (this.RevocationInfo.Type === RevocationTypeEnum.OtherChunk) { // 其他块
        const _RevocationOtherChunkList: IRevocationDetail['ChunkList'] = [];

        this._PlateChunkSelectList.forEach(p => {
          _RevocationOtherChunkList.push(...p.ChunkList.filter(c => c.checked).map(c => ({ ...c, Plate: p.PlateDetail })));
        });

        if (_RevocationOtherChunkList.length === 0) {
          MpMessage.error('保存失败', '未选择块信息');
          return null;
        }
        return {
          ..._params,
          RevocationInfo: { Type: this.RevocationInfo.Type, ChunkList: _RevocationOtherChunkList },
        };
      }

      if (this.RevocationInfo.Type === RevocationTypeEnum.CurrentOrder) { // 经过前面判断后,此处为订单报工方式的撤销此订单类型 - 需传递ChunkList 或 IsAllSelected为true
        const _RevocationOrderChunkList = this._RevocationOrderChunkList.filter(p => p.checked);
        if (_RevocationOrderChunkList.length === 0) {
          MpMessage.error('保存失败', '请选择要撤销的此订单块');
          return null;
        }
        return {
          ..._params,
          RevocationInfo: { Type: this.RevocationInfo.Type, ChunkList: _RevocationOrderChunkList, IsAllSelected: this.RevocationInfo.IsAllSelected },
        };
      }
    }

    // 4. 如果选择的是重做
    if (this.SolveType === SolveTypeEnum.remake) {
      // 1. 大版报工
      if (this._ReportMode === ReportModeEnum.board) {
        if (this.RedoInfo.PlateList.length !== 1) return null;
        const _WorkingList = this.RedoInfo.PlateList[0].WorkingList.filter(it => it.checked);
        if (_WorkingList.length === 0) {
          MpMessage.error('保存失败', '请选择要重做的大版工序');
          return null;
        }
        return {
          ..._params,
          RedoInfo: {
            PlateList: [{ ID: this.RedoInfo.PlateList[0].ID, WorkingList: _WorkingList }],
          },
        };
      }

      // 2. 块报工 或 订单报工： 获取大版设置列表
      const PlateList = getSubmitInfoFromPlateList(this.RedoInfo.PlateList);
      if (this._ReportMode === ReportModeEnum.block) {
        if (PlateList.length === 0) {
          MpMessage.error('保存失败', '请选择要重做的内容');
          return null;
        }
        return {
          ..._params,
          RedoInfo: { PlateList, OrderID: this.TaskExceptionDetail?.TaskDetail.Working.OrderInfo?.ID || '' },
        };
      }

      // 3. 订单报工： 获取组合生产线工序勾选信息
      const UnionLineWorkingList = this.RedoInfo.UnionLine?.WorkingList.filter(it => it.checked) || [];
      if (UnionLineWorkingList.length === 0 && PlateList.length === 0) {
        MpMessage.error('保存失败', '请选择要重做的内容');
        return null;
      }
      return {
        ..._params,
        RedoInfo: {
          PlateList,
          OrderID: this.TaskExceptionDetail?.TaskDetail.Working.OrderInfo?.ID || '',
          UnionLine: this.RedoInfo.UnionLine ? { ...this.RedoInfo.UnionLine, WorkingList: UnionLineWorkingList } : null,
        },
      };
    }

    return null;
  }

  getSubmitParams(): IExceptionSubmitParams | null { // 获取处理的传递参数 -- 后续添加一个获取外协信息传递参数的方法 组合起来使用
    // 1. 未选择处理方式
    if (this.SolveType === '') {
      MpMessage.error('保存失败', '请选择处理方式');
      return null;
    }

    const _params = { ID: this.ID, SolveType: this.SolveType };

    // 2. 如果处理方式选择的是继续生产 则可直接返回结果
    if (this.SolveType === SolveTypeEnum.continue) {
      return _params;
    }

    const temp = this._getHandleParams();

    if (!temp) return null;

    if (this.ExternalFactory) {
      const _ExternalParams = this.ExternalFactory.getSubmitData(this.TaskExceptionDetail);
      if (!_ExternalParams) return null;

      temp.ExternalFactory = _ExternalParams;
    }

    return temp;
  }
}
