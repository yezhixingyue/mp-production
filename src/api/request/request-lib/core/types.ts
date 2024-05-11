/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'post' | 'POST'
  | 'put' | 'PUT';

export type RequestHeaders = Record<string, string | number | boolean>;

export type RequestConfigResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';

export interface IResponseType<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface IMpzjResponse<T = any> {
  Data: T;
  DataNumber: number;
  Message: string;
  Status: number;
  isSuccess?: boolean
}

export interface IRequestConfig<D = any> {
  baseURL?: string;
  method?: RequestMethod;
  url?: string;
  headers?: RequestHeaders;
  params?: any;
  data?: D;
  responseType?: RequestConfigResponseType
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  signal?: AbortSignal; // 用于后续取消
  loading?: boolean; // 是否展示loading： 传递false时不展示  其它情况均展示
  closeTip?: boolean; // 是否展示错误提示： 默认展示，传递true时不展示
  withoutToken?: boolean; // 不需要token即可进行数据请求
  cache?: {
    duration: number // 缓存时间
    isCacheable?: (resp: IResponseType<IMpzjResponse>) => boolean // 判断响应结果是否可以被缓存
  }
  idempotent?: boolean // 是否开启请求幂等 - 内部借用cache处理 - 故优先级高于cache设置
  tipTitle?: string // 报错时的提示标题 msgCallback
  /** 弹出了错误提示 点击关闭提示弹窗后的事件回调函数msgCallback */
  msgCallback?: () => void
}

export interface IRequestor {
  request<T = any, RequestDataType = any>(config: IRequestConfig<RequestDataType>): Promise<IResponseType<T>>
}

export interface ILoadingHandler {
  /** 展示loading */
  display: () => void
  /** 关闭当前loading */
  hidden: () => void
  /** 关闭全部loading */
  hiddenByForce: () => void
}

interface IRespMsgOption {
  /** 清除全部状态 */
  clear: () => void
  /** 是否进行错误提示 */
  closeTip: boolean
  /** 点击关闭弹窗后的事件处理函数 */
  msgCallback: IRequestConfig['msgCallback']
  /** 提示标题 */
  tipTitle?: string
}

export interface ICoreOptions {
  /** baseURL */
  baseURL?: string
  /** 状态在此范围内时将会返回结果  默认 [200] */
  validStatuses: number[]
  cache?: {
    duration: number // 缓存时间 默认500毫秒 优先级低于请求方法上相同配置
    isCacheable: (resp: IResponseType<IMpzjResponse>) => boolean // 判断响应结果是否可以被缓存
  }
  /** 控制loading */
  loadingHandler?: ILoadingHandler
  /** 获取token */
  getToken?: () => string
  /** 设置token 优先级高于getToken */
  setToken?: (config: IRequestConfig) => boolean
  /** 对响应数据进行提示处理 - 仅处理不改变 */
  useResponse?: (resp: IResponseType<IMpzjResponse>, options: IRespMsgOption) => void
  /** 对catch到的错误信息的处理方法 */
  useCatchError?: (msg: string) => void
  isSuccess: (resp: IResponseType<IMpzjResponse>) => boolean
}

export interface IRequestPoolItem {
  hash: string;
  requester: Promise<IResponseType>
  controller: AbortController;
}
