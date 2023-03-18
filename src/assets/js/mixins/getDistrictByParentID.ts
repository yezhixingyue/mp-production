import api from '@/api';

export default () => {
  async function getDistrictByParentID(ParentID?: number) {
    const resp = await api.getDistrictList(ParentID).catch(() => null);
    if (resp?.data?.Status === 1000) {
      return resp.data.Data;
    }
    return [];
  }
  // 暴露出去
  return {
    getDistrictByParentID,
  };
};
