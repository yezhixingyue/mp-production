// import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
// import request from '../request/request';

/**
 * 该文件已废弃 !!!!!! --- client全部接口应放置到@/api/client/index.ts文件中
 */

export const clientApis = {
  // getTerminalEquipmentList(terminal: string) { // GET /Api/Terminal/Equipment/List  获取终端设备列表
  //   return request<IManageEquipmentInfo[]>({ method: 'GET', url: '/Api/Terminal/Equipment/List', params: { terminal } });
  // },
  // getVerifySystemPassword(password: string) { // GET /Api/Verify/SystemPassword   验证系统密码
  //   return request<string>({ method: 'GET', url: '/Api/Verify/SystemPassword', params: { password } });
  // },
  // getEquipmentBind(terminal: string, list: string[], sign: string) { // GET /Api/Equipment/Bind   绑定设备
  //   const headers = { sign };
  //   return request<string>({
  //     method: 'POST', url: '/Api/Equipment/Bind', data: { terminal, list }, headers,
  //   });
  // },
};

/** 存放客户端页面所有用到的接口路径 -- 此处必须把上面所有的接口url放置到里面 - axios需要特殊处理 */
export const clientApiUrls: string[] = [
  // '/Api/Terminal/Equipment/List',
  // '/Api/Verify/SystemPassword',
  // '/Api/Equipment/Bind',
];

if (Object.keys(clientApis).length !== clientApiUrls.length) {
  throw new Error('clientApis与clientApiUrls数量不一致，请检查是否有遗漏');
}
