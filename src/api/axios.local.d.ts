/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import type { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
      /** 是否关闭全局loading */
    closeLoading?: boolean
    msgCallback?: () => void
    // [自定义属性声明]
  }
}
