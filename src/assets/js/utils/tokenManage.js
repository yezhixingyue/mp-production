import api from '@/api/index';

/**
 * 获取到今天24点时的时间戳
 */
const getTodayTimestampIn24Am = () => {
  const date = new Date();
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  date.setMilliseconds(999);
  return date.getTime();
};

export default class TokenClass {
  static removeToken() {
    localStorage.removeItem('ErpToken');
    localStorage.removeItem('staffDetailData');
  }

  static setToken(token) {
    if (!token) return;
    this.removeToken();
    const timestamp = getTodayTimestampIn24Am();
    const temp = {
      token,
      timestamp,
    };
    localStorage.setItem('ErpToken', JSON.stringify(temp));
  }

  static getToken() {
    const tokenObj = JSON.parse(localStorage.getItem('ErpToken')); // 2.1 获取到token信息，可能为undefined
    let token;
    if (tokenObj) {
      if (tokenObj.timestamp && tokenObj.timestamp > Date.now()) {
        token = tokenObj.token;
      } else {
        localStorage.removeItem('ErpToken');
        localStorage.removeItem('staffDetailData');
      }
    }
    return token;
  }

  static async getPermission(token) { // 获取登录用户详情信息，内部包含权限信息
    const _detailData = localStorage.getItem('staffDetailData');
    if (!_detailData) {
      const res = await api.getStaffDetail().catch(() => null);
      if (res && res.status === 200 && res.data.Status === 1000) {
        localStorage.setItem('staffDetailData', JSON.stringify(res.data.Data));
        return res.data.Data;
      }
      return res && res.data ? res.data.Message : '获取账号信息失败，请刷新重试';
    }
    const data = JSON.parse(_detailData);
    if (data.Token === token) return data;
    localStorage.removeItem('staffDetailData');
    return this.getPermission(token);
  }
}
