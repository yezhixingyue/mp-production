import { clientInstance as instance } from './clientInstance';

const clientApi = {
  getTerminalEquipmentList(terminal: string) { // 获取终端设备列表
    return instance.get('/Api/Terminal/Equipment/List', { params: { terminal } });
  },
  getVerifySystemPassword(password: string) { // GET /Api/Verify/SystemPassword   验证系统密码
    return instance.get('/Api/Verify/SystemPassword', { params: { password } });
  },
  getEquipmentBind(terminal: string, list: string[], sign: string) { // GET /Api/Equipment/Bind   绑定设备
    const headers = { sign };
    return instance.post('/Api/Equipment/Bind', { terminal, list }, { headers });
  },
  /** 设备报停 - 模拟接口 - 后面需要更改为正确地址 */
  getEquipmentStop(data) {
    return instance.get('/Api/Report/Stop', data);
  },
};

export default clientApi;
