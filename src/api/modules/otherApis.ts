import { instance } from '../request/instance';

export const otherSettingApis = {
  /* 转换服务器相关
  --------------------------------- */
  getConvertServerList(data) { // POST /Api/ConvertServer/List 转换服务器列表
    return instance({ method: 'POST', url: '/Api/ConvertServer/List', data });
  },
  getConvertServerRemove(id) { // DELETE /Api/ConvertServer/Remove 转换服务器删除
    return instance({ method: 'DELETE', url: '/Api/ConvertServer/Remove', params: { id } });
  },
  getConvertServerSave(data) { // POST /Api/ConvertServer/Save   转换服务器保存
    return instance({ method: 'POST', url: '/Api/ConvertServer/Save', data });
  },
  /* 文件上传相关
  --------------------------------- */
  UploadFileBreakpointResume(data, uniqueName, first, last, length, onUploadProgressFunc) { // 断点续传上传文件 /Api/Upload/File
    const formData = new FormData();
    formData.append('file', data);

    const headers = {
      'Content-Range': `bytes ${first}-${last}/${length}`,
    };

    return instance({
      method: 'POST',
      url: '/Api/Upload/File',
      data: formData,
      params: { uniqueName },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
      headers,
    });
  },
  getUploadedProgress(uniqueName: string) { // 获取断点续传文件已上传的位置  GET /Api/FileNode
    return instance({ method: 'GET', url: '/Api/FileNode', params: { uniqueName } });
  },
  getFileSuffixList() { // GET /Api/File/SuffixList  获取文件上传格式后缀名列表
    return instance({ method: 'GET', url: '/Api/File/SuffixList' });
  },
  /* 管理系统密码相关
  --------------------------------- */
  /** GET /Api/SystemPassword   获取系统密码 */
  getSystemPassword() {
    return instance({ method: 'GET', url: '/Api/SystemPassword' });
  },
  /** PUT /Api/Change/SystemPassword  修改系统密码 */
  getChangeSystemPassword(password: string) {
    return instance({ method: 'PUT', url: '/Api/Change/SystemPassword', params: { password } });
  },
  /** PUT /Api/Equipment/Unbind   设备解绑 */
  getEquipmentUnbind(id: string) {
    return instance({ method: 'PUT', url: '/Api/Equipment/Unbind', params: { id } });
  },
  /** PUT /Api/Equipment/OnOffSetup  开关机设置 */
  getEquipmentOnOffSetup(id: string, startup: boolean) {
    return instance({ method: 'PUT', url: '/Api/Equipment/OnOffSetup', params: { id, startup } });
  },
  /** POST /Api/Equipment/MaintainSetup  设备设置维护信息 */
  getEquipmentMaintainSetup(data) {
    return instance({ method: 'POST', url: '/Api/Equipment/MaintainSetup', data });
  },
  /* 二维码相关
  --------------------------------- */
  getQRCodeSrc(content: string | number, size = 3) {
    return instance.get('/QRCode', { params: { content, size }, responseType: 'arraybuffer', closeTips: true });
  },
  /* 审稿释放相关
  --------------------------------- */
  /** /Api/Staff/Imposition/UnLock PUT请求，解锁拼版 */
  getStaffImpositionUnLock(id: string) {
    return instance.put('/Api/Staff/Imposition/UnLock', null, { params: { id } });
  },
};
