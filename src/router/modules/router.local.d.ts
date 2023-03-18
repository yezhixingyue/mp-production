/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import { RouteMeta } from 'vue-router';

declare module 'vue-router' {
  export interface RouteMeta {
    /** 当前页面权限信息 */
    PermissionInfo?: string[],
    /** 该页面访问是否需要登录（是否有token） */
    requiresAuth?: boolean
    /** 是否全屏（不显示左侧和顶部菜单区域） */
    fullAcreen?: boolean
    /** 页面标题 */
    title: string
    /** icon 左侧菜单栏中的icon 不在菜单栏展示则不用传 */
    icon?: string
    /** pageName 页面名称 */
    pageName?: string
    /** 为true时 该页面将不在左侧菜单栏中展示 */
    hideMenu?: boolean
  }
}
