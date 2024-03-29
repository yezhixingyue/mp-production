import { downloadExcelApis } from '@/api/modules/downloadExcelApis';

/**
 * Excel导出组件中导出条件类型
 *
 * @export
 * @interface IExportExcelCondition
 */
export interface IExportExcelCondition {
  Page?: number
  PageSize?: number
  [key: string]: object | number | string | null | undefined
}

/**
 * Excel导出组件中可传递和需要传递的props类型 -- 此处类型应和DownLoadExcelComp中IProps完全保持一致
 *
 * @export
 * @interface IExportExcelProps
 */
export interface IExportExcelProps {
  /** 按钮标题 */
  title?: string
  /** 是否禁用 - 总页码条目为0时禁用 */
  disabled?: boolean
  /** 导出接口 */
  apiPath: keyof typeof downloadExcelApis
  /** 导出条件 */
  condition?: IExportExcelCondition
  /** 导出的文件名称 */
  fileName: string
  /** 导出时间段 */
  fileDate?: { First: string, Second: string }
  /** 是否包含导出日期 */
  withExportDate?: boolean
}
