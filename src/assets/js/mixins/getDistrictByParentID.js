import api from '@/api';

export default () => {
  async function getDistrictByParentID(ParentID) {
    const resp = await api.getDistrictList(ParentID);
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
