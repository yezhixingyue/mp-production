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
  /* 文件上传相关
  --------------------------------- */
  UploadFileBreakpointResume(data, uniqueName, first, last, length, onUploadProgressFunc) { // 断点续传上传文件 /Api/Upload/File
    const formData = new FormData();
    formData.append('file', data);

    const headers = {
      'Content-Range': `bytes ${first}-${last}/${length}`,
    };

    return request({
      method: 'POST',
      url: '/Api/Upload/File',
      data: formData,
      params: { uniqueName },
      onUploadProgress: onUploadProgressFunc && onUploadProgressFunc,
      headers,
    });
  },
  getUploadedProgress(uniqueName: string) { // 获取断点续传文件已上传的位置  GET /Api/FileNode
    return request({ method: 'GET', url: '/Api/FileNode', params: { uniqueName } });
  },
};
