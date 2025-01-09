import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ExternalTaskStatusEnum } from '@/views/OutsourceManage/js/enum';
import { ExternalTaskStatusEnumList } from '@/views/OutsourceManage/js/EnumList';
import { ProductiveTaskStatusEnumList } from '@/views/ProductionClient/assets/js/enum';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ReportModeEnum, WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { transformMinute } from '@/assets/js/utils/ConvertTimeFormat';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { getTaskDisplayInfo } from '../../CurTaskPanel';

const getIsTimedout = (time?: string) => {
  if (time && typeof time === 'string') {
    const _date = new Date(time.replace('Z', ''));

    if (_date) {
      return _date.getTime() < Date.now();
    }
  }
  return false;
};

export const getLocalTaskList = (TaskList: ITaskDetail[], isError: boolean, useContent = false) => {
  const list = TaskList.map(it => {
    let _TargetID = '';
    let _Material = '';
    let _LineName = '';
    let _PrintMaterialSizeTitle = '订单尺寸';
    let _Size = '';
    let _SpecialColorText = ''; // 专色字段： 专色[单黑、印白]

    const info = getTaskDisplayInfo(it);

    let _DetailText = `${info.FirstTitle}  ${info.SecondTitle}`;

    switch (it.Working.ReportMode) {
      case ReportModeEnum.board:
        _TargetID = `${it.Working.PlateInfo?.Code || ''}（大版）`;
        _Material = it.Working.PlateInfo?.Material || '';
        _Size = it.Working.PlateInfo?.MaterialSize || '';
        _DetailText = info.SecondTitle;
        _LineName = it.Working.PlateInfo?.Line || '';
        _PrintMaterialSizeTitle = '物料尺寸';

        if (it.Working.Type === WorkingTypeEnum.print && it.Working.PlateInfo?.PrintColor?.length) {
          _SpecialColorText = it.Working.PlateInfo.PrintColor.filter(it => it.IsSpecialColor).map(it => it.Name).join('、');
          if (_SpecialColorText) _SpecialColorText = `专色[${_SpecialColorText}]`;
        }

        break;

      case ReportModeEnum.order:
        _TargetID = `${it.Working.OrderInfo?.OrderID || ''}（订单）`;
        if (it.Working.OrderInfo?.Content && useContent) _DetailText = it.Working.OrderInfo.Content;
        _LineName = it.Working.OrderInfo?.Line || '';
        _Size = it.Working.OrderInfo?.Size || '';
        break;

      case ReportModeEnum.block:
        _TargetID = `${it.Working.OrderInfo?.OrderID || ''} ${it.Working.ChunkInfo?.Name || ''}（块）`;
        _Material = it.Working.PlateInfo?.Material || '';
        _Size = it.Working.PlateInfo?.MaterialSize || '';
        if (it.Working.OrderInfo?.Content && useContent) _DetailText = it.Working.OrderInfo.Content;
        _LineName = it.Working.ChunkInfo?.Line || '';
        _PrintMaterialSizeTitle = '物料尺寸';
        break;

      default:
        break;
    }

    const _ProcessTimes = it.Index && it.Working.WorkTimes > 1 ? `第${it.Index}次` : '';
    const _AssistText = it.Working.ExternalAttribute?.ProcessContent
     || it.Working.AssistList.filter(it => it.Type === AssistInfoTypeEnum.text).map(it => it.Content).filter(Content => Content).join('；');

    const _UnFinishNumber = `${`${it.UnFinishNumber}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${info.Unit}`;

    const _Number = `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${info.Unit}`;

    const _StatusText = isError ? '待转移' : getEnumNameByID(it.Status, ProductiveTaskStatusEnumList);

    const _WorkingName = it.Working.WorkingName;

    /** 申放 */
    const _Wastage = it.Working.Wastage ? `${it.Working.Wastage}${info.Unit}` : '';

    // 处理图片和文件
    const arr = it.Working.AssistList || [];

    const _files = arr.filter(it => it.Type === AssistInfoTypeEnum.file && it.FilePath && !it.IsImage);

    const _images = arr.filter(it => it.Type === AssistInfoTypeEnum.file && it.FilePath && it.IsImage);

    const _WishDuration = transformMinute(it.WishDuration);

    const _ActualDuration = transformMinute(it.ActualDuration);

    const _CreateTime = it.CreateTime ? format2MiddleLangTypeDateFunc2(it.CreateTime) : '';
    const _FinishTime = it.FinishTime ? format2MiddleLangTypeDateFunc2(it.FinishTime) : '';

    const _LatestFinishTime = it.LatestFinishTime
      ? { Time: format2MiddleLangTypeDateFunc2(it.LatestFinishTime), isTimedout: getIsTimedout(it.LatestFinishTime) } : null;

    const _EquAndOperator = [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') + (it.Operator ? ` (${it.Operator})` : '');

    // 外协状态
    const _ExternalStatusText = it.Working.ExternalAttribute ? getEnumNameByID(it.Working.ExternalAttribute.Status, ExternalTaskStatusEnumList) : '';

    let _ExternalStatusCtrlText = '';
    if (it.Working.ExternalAttribute?.Status === ExternalTaskStatusEnum.WaitFactoryReceive) {
      _ExternalStatusCtrlText = '确认外协';
    } else {
      _ExternalStatusCtrlText = '撤回';
    }
    const _ExternalSubmitParams = {
      TaskID: it.ID,
      FactoryID: it.Working.UseableEquipmentList?.find(f => f.ID === it.Equipment.ID)?.ID || '',
      Amount: it.Working.ExternalAttribute?.FinalAmount || '',
      WishFinishTime: it.LatestFinishTime ? getTimeConvertFormat({ date: it.LatestFinishTime.replace('Z', ''), withHMS: true }) : '',
      _FactoryName: it.Working.UseableEquipmentList ? it.Working.UseableEquipmentList.find(f => f.ID === it.Equipment.ID)?.Name || '' : it.Equipment.Name || '',
      _IsFixedAmount: !!it.Working.ExternalAttribute.HaveFixedAmount,
      _IsFixedFactory: !!it.Working.ExternalAttribute.HaveFixedFactory,
    };

    /** 开始时间（外协时间） */
    const _StartTime = it.StartTime ? format2MiddleLangTypeDateFunc2(it.StartTime) : '';

    /** 最晚送达时间 */
    const _LastestSendedTime = it.LatestSendTime ? format2MiddleLangTypeDateFunc2(it.LatestSendTime) : '';
    const _IsTimeout = _LastestSendedTime ? new Date(_LastestSendedTime).getTime() < Date.now() : false;

    return {
      ...it,
      _TargetID,
      _LineName,
      _ProcessTimes, // 是第几次加工次数
      _AssistText, // 辅助文字信息
      _SpecialColorText, // 专色信息 --- 2024-12-17后 暂无使用 - 后续可废弃
      _Material,
      _Size,
      _UnFinishNumber,
      _Number,
      _Wastage,
      _StatusText,
      _DetailText,
      _files,
      _images,
      _CreateTime,
      _WishDuration, // 预计加工时长
      _ActualDuration, // 实际加工时长
      _FinishTime, // 完工时间
      _LatestFinishTime, // 最迟完工时间
      _EquAndOperator, // 设备和操作人信息
      _ExternalStatusText, // 外协任务状态 - 仅外协任务有值
      _ExternalStatusCtrlText,
      _WorkingName,
      _ExternalSubmitParams,
      _StartTime,
      _LastestSendedTime,
      _IsTimeout,
      _PrintMaterialSizeTitle,
    };
  });

  return list;
};
