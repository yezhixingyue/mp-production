import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILoginSubmitForm, IUser } from '@/store/modules/user/types';
import { Base64 } from 'js-base64';
import { SessionStorageClientHandler } from '../SessionStorageHandler';
import { IEquipmentBindAssistantInfo } from '../types';
/**
 * 单个设备实例中用户信息管理类
 *
 * @export
 * @class InstanceLoginClass
 */
export class InstanceLoginClass {
  /** 设备id */
  public EquipmentID: string

  /** 登录成功后获取到的token信息 */
  public token = ''

  /** 登录成功所使用的mobile信息 */
  public mobileOnSuccess = ''

  /** 用户信息 */
  public user: null | IUser = null

  /** 绑定的助手信息列表 */
  public AssistantList: null | IEquipmentBindAssistantInfo[] = null

  /** 登录手机号 */
  public mobile = ''

  /** 登录密码 */
  public password = ''

  public loading = false

  constructor(id: string) {
    this.EquipmentID = id;
    // 缓存数据还原
    const data = SessionStorageClientHandler.getData(this.EquipmentID);
    if (data) {
      this.token = data.token;
      this.mobileOnSuccess = data.mobileOnSuccess || '';
      this.AssistantList = data.AssistantList || null;

      if (this.token) {
        this._getUser(); // 获取用户信息
      }
    }
  }

  /** 校验登录信息是否符合规范 */
  private _validate() {
    if (!this.mobile) {
      MpMessage.error({ title: '登录失败', msg: '请输入登录手机号码' });
      return false;
    }
    if (this.mobile.length !== 11) {
      MpMessage.error({ title: '登录失败', msg: '手机号码长度不正确，应为11位' });
      return false;
    }
    if (!/1[3456789]\d{9}/.test(this.mobile)) {
      MpMessage.error({ title: '登录失败', msg: '手机号码格式不正确' });
      return false;
    }
    if (!this.password) {
      MpMessage.error({ title: '登录失败', msg: '请输入登录密码' });
      return false;
    }
    if (this.password.length < 6) {
      MpMessage.error({ title: '登录失败', msg: '密码长度不正确，应在6 - 16位之间' });
      return false;
    }
    return true;
  }

  /** 获取用户信息 - 在登录成功后获取 */
  private async _getUser() {
    // 如果有用户信息 且 用户信息中的token和当前token一致 则不再重新请求
    if (this.user && this.user.Token === this.token) return;

    const data = SessionStorageClientHandler.getData(this.EquipmentID);
    if (data && data.user?.Token === this.token) {
      this.user = data.user;
      return;
    }

    const resp = await clientApi.getUser(this.token).catch(() => null);

    if (resp?.data?.isSuccess) {
      this.user = resp.data.Data;
      SessionStorageClientHandler.setData({
        EquipmentID: this.EquipmentID,
        user: this.user,
        token: this.token,
        mobileOnSuccess: this.mobileOnSuccess,
        AssistantList: null,
      });
    }
  }

  /** 提交登录 - 且在登录成功后修改及缓存相关信息 */
  public async login() {
    if (!this._validate()) return false;
    const temp: ILoginSubmitForm = {
      Mobile: this.mobile,
      Password: Base64.encode(this.password),
      Terminal: 1,
      EquipmentID: this.EquipmentID,
      Site: 2,
    };

    this.loading = true;
    const resp = await clientApi.getLogin(temp).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.mobile = '';
      this.password = '';
      this.token = resp.data.Data || '';
      this.mobileOnSuccess = temp.Mobile;
      this.AssistantList = null;
      // 缓存
      SessionStorageClientHandler.setData({ EquipmentID: this.EquipmentID, user: null, token: this.token, AssistantList: null });
      // 获取用户信息
      await this._getUser();
      if (this.user?.PermissionList.PermissionTaskReport.Obj.Report === false) {
        MpMessage.error('当前账号无报工权限', '请更换账号或联系系统管理员');
        await this.logout();
        return false;
      }

      return true;
    }
    return false;
  }

  /** 注销登录 - 清除缓存 */
  public async logout() {
    const resp = await clientApi.getLogout(this.EquipmentID).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.user = null;
      this.token = '';
      this.mobileOnSuccess = '';
      this.AssistantList = null;
      // 清理缓存
      SessionStorageClientHandler.clearItem(this.EquipmentID);
      return true;
    }
    return false;
  }

  setAssistantList(data: IEquipmentBindAssistantInfo[]) {
    this.AssistantList = data;

    SessionStorageClientHandler.setData({
      EquipmentID: this.EquipmentID,
      user: this.user,
      token: this.token,
      mobileOnSuccess: this.mobileOnSuccess,
      AssistantList: this.AssistantList,
    });
  }
}
