import api from '@/api';

export default () => {
  async function getDistrictByParentID(ParentID) { // 回转页面信息后删除掉回转前的路由信息,
    const resp = await api.getDistrictList(ParentID);
    console.log(resp);
    if (resp.data.Status === 1000) {
      return resp.data.Data;
    }
    return [];
  }
  // 暴露出去
  return {
    getDistrictByParentID,
  };
};
