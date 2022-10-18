import request from '../request/request';

export const otherSettingApis = {
  /* 转换服务器相关
  --------------------------------- */
  getConvertServerList(data) { // POST /Api/ConvertServer/List 转换服务器列表
    return request({ method: 'POST', url: '/Api/ConvertServer/List', data });
  },
  getConvertServerRemove(id) { // DELETE /Api/ConvertServer/Remove 转换服务器删除
    return request({ method: 'DELETE', url: '/Api/ConvertServer/Remove', params: { id } });
  },
  getConvertServerSave(data) { // POST /Api/ConvertServer/Save   转换服务器保存
    return request({ method: 'POST', url: '/Api/ConvertServer/Save', data });
  },
};
