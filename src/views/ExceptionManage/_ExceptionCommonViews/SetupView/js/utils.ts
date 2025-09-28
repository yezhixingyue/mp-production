import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { IExceptionChunk, IExceptionPlate, IExceptionWorking } from '../../js/type';
import { HandleExceptionRuleForm } from './HandleExceptionRuleForm';
import { IExceptionPlate4Form } from './ruleFormType';

/**
 * 下载条码稿
 *
 */
export const loadBarcode = (data: { MapFilePath: string }) => {
  if (data.MapFilePath) {
    const url = process.env.NODE_ENV === 'development' ? 'http://192.168.1.92:8052/' : '';

    window.open(`${url}${data.MapFilePath}`);
  }
};

/** 获取订单报工或块报工重新信息中大版列表提交信息 */
export const getSubmitInfoFromPlateList = (PlateList: IExceptionPlate4Form[]): Partial<IExceptionPlate4Form>[] => {
  const list = PlateList.map(p => {
    const {
      Reproduce, ChunkList, ID, ChildList,
    } = p;

    if (Reproduce?._remark) {
      return { ID, Reproduce: { ReceiveMaterial: Reproduce.ReceiveMaterial, Platemaking: Reproduce.Platemaking }, ChunkList };
    }

    const _ChunkList = ChunkList
      .map(it => ({
        ...it, WorkingList: it.WorkingList.filter(w => w.checked || HandleExceptionRuleForm.getWorkingIsDisabledTrue(p, w, PlateList)),
      }))
      .filter(it => it.WorkingList.length > 0);

    const _ChildList = getSubmitInfoFromPlateList(ChildList || []);

    if (_ChunkList.length > 0 || _ChildList.length > 0) {
      return { ID, ChunkList: _ChunkList, ChildList: _ChildList };
    }

    return null;
  });

  return list.filter(it => it) as Partial<IExceptionPlate4Form>[];
};

/**
 * 获取异常处理重做部分表单的大版列表数据
 *
 * @param {IExceptionPlate[]} PlateList
 * @param {ReportModeEnum} ReportMode
 * @returns {IExceptionPlate4Form[]}
 */
export const getRedoFormPlateList = (PlateList: IExceptionPlate[], ReportMode: ReportModeEnum): IExceptionPlate4Form[] => {
  const _getReproduce = (plate: IExceptionPlate): IExceptionPlate4Form['Reproduce'] => {
    if (ReportMode === ReportModeEnum.board) return null;

    return {
      _remark: false,
      /** 重新领料 */
      ReceiveMaterial: !!plate.WorkingList.find(w => w.ReceiveMaterial),
      /** 重新制版 */
      Platemaking: false,
      _PlatemakingDisabled: !plate.WorkingList.find(w => w.PlateMaking),
    };
  };

  const _getWorkingList = (WorkingList: IExceptionWorking[]): IExceptionPlate4Form['WorkingList'] => {
    if (!WorkingList) return [];

    return WorkingList.map(it => ({
      ...it,
      checked: false,
      _ReceiveMaterial: it.ReceiveMaterial,
      ReceiveMaterial: ReportMode === ReportModeEnum.block, // 块工序默认需要重新领料
      _PlateMaking: it.PlateMaking,
      PlateMaking: false,
    }));
  };

  const _getChunkList = (ChunkList?: IExceptionChunk[]): IExceptionPlate4Form['ChunkList'] => {
    if (!ChunkList) return [];
    return ChunkList.map(it => ({
      ...it,
      WorkingList: it.WorkingList.map(w => ({
        ...w,
        checked: false,
        ReceiveMaterial: w.ReceiveMaterial,
        _ReceiveMaterial: w.ReceiveMaterial,
        _PlateMaking: w.PlateMaking,
        PlateMaking: false,
      })),
    }));
  };

  const _getPlateOrChildList = (ChildList: IExceptionPlate[] | null, parentPlate?: IExceptionPlate4Form): IExceptionPlate4Form['ChildList'] => {
    if (ChildList) {
      return ChildList.map(child => ({
        ...child,
        Reproduce: _getReproduce(child),
        WorkingList: _getWorkingList(child.WorkingList),
        ChunkList: _getChunkList(child.ChunkList),
        ChildList: _getPlateOrChildList(child.ChildList),
        parentPlate,
      }));
    }

    return null;
  };

  return _getPlateOrChildList(PlateList) || [];
};
