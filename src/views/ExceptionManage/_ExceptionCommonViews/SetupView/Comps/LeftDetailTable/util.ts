import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';

export type leftEventType = 'BarCodePrint';

/** 外协处理-左侧-展示列表数据类型 */
export interface IExceptionLeftDisplayList {
  title: string
  list: {
    label: string
    value: string | number
    haveEvent?: leftEventType
    disabled?: boolean
  }[]
}

/** 获取任务展示信息 */
const getTaskListInfo = (TaskDetail: ITaskDetail, IsOutSourcing: boolean) => {
  // 任务ID、工序   设备、预计完成时间 或 加工厂（外协时）
  const list: IExceptionLeftDisplayList['list'] = [
    { label: '任务ID', value: TaskDetail.Code },
    {
      label: '工序',
      value: [TaskDetail.Working.PlateInfo?.Line, TaskDetail.Working.WorkingName]
        .filter(it => it).join(' - '),
    },
  ];
  if (IsOutSourcing) {
    list.push(
      { label: '加工厂', value: TaskDetail.Equipment.Name },
    );
  } else {
    list.push(
      {
        label: '设备',
        value: [TaskDetail.Equipment.GroupName, TaskDetail.Equipment.Name].filter(it => it).join(' - '),
      },
      { label: '预计完成时间', value: format2MiddleLangTypeDateFunc2(TaskDetail.LatestFinishTime) },
    );
  }
  return { title: '任务信息', list };
};

/** 获取到大版展示信息 */
const getBoardListInfo = (TaskDetail: ITaskDetail, showBarCodePrint: boolean) => {
  const { PlateInfo, Number } = TaskDetail.Working;
  const list: IExceptionLeftDisplayList['list'] = PlateInfo ? [
    { label: '大版ID', value: PlateInfo.Code },
    { label: '模板', value: [PlateInfo.Template, PlateInfo.TemplateSize].filter(it => it).join(' ') },
    { label: '物料', value: PlateInfo.Material },
    /** 如果是块报工显示大版时，不显示下面加工数量 */
    { label: '加工数量', value: Number + PlateInfo.Unit },
    { label: '订单数量', value: PlateInfo.OrderNumber ? `${PlateInfo.OrderNumber}个订单${PlateInfo.ChunkNumber ? `（共${PlateInfo.ChunkNumber}个订单块）` : ''}` : '' },
  ] : [];

  if (showBarCodePrint) {
    list.push({
      label: '条码稿', value: '下载条码稿', haveEvent: 'BarCodePrint', disabled: !(PlateInfo?.MapFilePath),
    });
  }

  return { title: '大版信息', list };
};

/** 获取到订单展示信息 或块信息 */
const getOrderListInfo = (TaskDetail: ITaskDetail, isChunk = false) => {
  const { OrderInfo, ChunkInfo } = TaskDetail.Working;

  const list: IExceptionLeftDisplayList['list'] = [
    { label: '订单ID', value: `${OrderInfo?.ServerName || ''} ${OrderInfo?.OrderID || ''} ${isChunk ? ChunkInfo?.Name || '' : ''}` },
    { label: '销售端产品', value: [OrderInfo?.FirstLevel, OrderInfo?.SecondLevel, OrderInfo?.ProductName].filter(it => it).join(' - ') },
    { label: '订单内容', value: OrderInfo?.Content || '' },
    { label: '加工数量', value: TaskDetail.Working.Number + (isChunk ? ChunkInfo?.Unit || '' : OrderInfo?.Unit || '') },
    { label: '最晚交付时间', value: format2MiddleLangTypeDateFunc2(TaskDetail.LatestSendTime || '') },
  ];

  return { title: '订单信息', list };
};

/** 获取外协信息 */
const getOutsourceListInfo = (TaskDetail: ITaskDetail) => {
  const getAssistContent = () => TaskDetail.Working.AssistList
    .filter(it => it.Type === AssistInfoTypeEnum.text)
    .map(it => it.Content)
    .join('；');

  const list: IExceptionLeftDisplayList['list'] = [
    { label: '外协人', value: TaskDetail.Operator },
    { label: '外协时间', value: format2MiddleLangTypeDateFunc2(TaskDetail.StartTime) },
    { label: '加工信息', value: getAssistContent() },
    { label: '预计完成时间', value: format2MiddleLangTypeDateFunc2(TaskDetail.LatestFinishTime) },
    {
      label: '外协金额',
      value: typeof TaskDetail.Working.ExternalAttribute?.FinalAmount === 'number' ? `￥${TaskDetail.Working.ExternalAttribute.FinalAmount}元` : '',
    },
  ];

  return { title: '外协信息', list };
};

/**
 * 获取展示内容：
 * 1. 大版报工时展示：任务信息、大版信息
 * 2. 订单报工时展示：任务信息、订单信息
 * 3. 按块报工时展示：任务信息、大版信息(? 或可合并至块信息展示中 - 暂不显示)、订单信息（融合块信息）
 *
 * 最后都展示错误提交信息
 */
export const getLeftDisplayList = (TaskDetail: ITaskDetail, IsOutSourcing: boolean, showBarCodePrint: boolean) => {
  const list: IExceptionLeftDisplayList[] = [];

  // 1. 获取任务信息
  list.push(getTaskListInfo(TaskDetail, IsOutSourcing));

  // 2. 获取大版、订单或块信息
  switch (TaskDetail.Working.ReportMode) {
    case ReportModeEnum.board: // 大版报工，获取到大版信息
      if (TaskDetail.Working.PlateInfo) list.push(getBoardListInfo(TaskDetail, showBarCodePrint));
      break;

    case ReportModeEnum.order: // 订单报工，获取到订单信息
      if (TaskDetail.Working.OrderInfo) list.push(getOrderListInfo(TaskDetail, false));
      break;

    case ReportModeEnum.block: // 块报工，获取到订单和块信息
      if (TaskDetail.Working.OrderInfo) list.push(getOrderListInfo(TaskDetail, true));
      break;

    default:
      break;
  }

  // 3. 获取到外协信息
  if (IsOutSourcing) list.push(getOutsourceListInfo(TaskDetail));

  return list;
};
