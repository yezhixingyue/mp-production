import { IEquipmentBaseInfo } from '@/views/ProductionClient/assets/js/types';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { PrintSideEnum } from '../../ManualOrderHandlerPage/js/enums';
import { IBaseProperty } from '../../ManualOrderHandlerPage/js/types';
import { DigitalImpositionStatusEnum, DigitalImpositionTypeEnum } from './enum';

/** 数码工单打印列表数据接口类型 */
export interface IDigitalOrderPlateInfo {
  /** 大版编号 */
  Code: number
  /** 订单号 */
  OrderCode: string
  /** 订单ID */
  OrderID: string
  /** 生产线 */
  Line: string
  /** 模板 */
  Template: string
  /** 模板尺寸 */
  TemplateSize: string
  /** 物料 */
  Material: string
  /** 印刷机 */
  Equipment: string
  /** 印刷数量 */
  Number: number
  /** 单位 */
  Unit: string
  /** 状态 */
  Status: DigitalImpositionStatusEnum
  /** 拼版方式 */
  ImpositionType: DigitalImpositionTypeEnum
  /** 拼版人 */
  Operator: string
  /** 拼版时间 */
  ImpositionTime: string
  /** 同步时间 */
  CreateTime: string
}

interface ITaskWorkingDetail {
   /** 工序名称  */
   WorkingName: string
   /** 报工方式 */
   ReportMode: ReportModeEnum
   /** 加工信息 */
   AssistList: {
    /** 名称 */
    Name: string
    /** 文字信息 --- 筛选掉为空的条目，然后把剩下的以 名称:文字信息 的形式join(;)起来显示 */
    Content?: string
   }[]
   /** 加工设备 */
   Equipment: IEquipmentBaseInfo
}

/** 数码工单打印数据接口类型 */
export interface IDigitalOrderPlatePrintInfo {
  /** 大版编号 */
  Code: number
  /** 大版序号 */
  Index: number
  /** 生产线 */
  ProductionLine: IBaseProperty<string>
  /** 任务开启编号 */
  StartCode: string
  /** 块列表 默认此处有且仅有一个块信息 */
  ChunkList: [{
    /** 块编号(拼版之后才有值) */
    Code: string
    /** 半成品  */
    SemeFinished: IBaseProperty<string>
    /** 任务列表 工序列表 */
    WorkingList: ITaskWorkingDetail[]
    /** 组合生产线信息 */
    CombineLine: {
      /** 任务列表 工序列表 */
      WorkingList: ITaskWorkingDetail[]
    }
    /** 订单信息 */
    OrderInfo: {
      /** 下单时间 */
      CreateTime: string
      /** 预计生产完成时间 */
      ProduceEndTime: string
      /** 客户编号  */
      CustomerSN: string
      /** 客户名称 */
      CustomerName: string
      /** 产品名称 */
      ProductName: string
      /** 下单尺寸 */
      Size: string
      /** 款数 */
      KindCount: number
      /** 产品数量 */
      Number: number
      /** 单位 */
      Unit: string
      /** 订单需求 */
      Describe: string
      /** 站点名称 */
      StationName: string
    }
  }] | []
  /** 大版单位 */
  Unit: string
  /** 文件信息 */
  UploadFile: {
    /** 半成品名称 */
    SemiFinished: string
    /** 文件尺寸 */
    Size: string
    /** 文件页数 */
    PageNumber: number
    /** 单双面 */
    PrintSide: PrintSideEnum
    /** 打印份数 印刷数量 */
    Number: number
    /** 上传人 */
    Operator: string
    /** 文件备注 */
    Remark: string
  }
  /** 打印物料 */
  Material: {
    /** 物料信息 物料名称 */
    Name: string
    /** 宽 */
    Width: number
    /** 高 */
    Height: number
    /** 物料数量 */
    Number: number
  }
  /** 任务列表 工序列表 */
  WorkingList: ITaskWorkingDetail[]
}

/** 数码工单打印数据接口类型 --- 处理过的带有二维码地址的接口类型 */
export interface ILocalDigitalOrderPlatePrintInfoWithQrCode extends IDigitalOrderPlatePrintInfo {
  _PlateQcCode: string
  _ChunkQcCode: string
  _StartBarCode: string
}
