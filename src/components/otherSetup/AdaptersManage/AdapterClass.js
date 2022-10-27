import api from '@/api';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

export default class AdapterClass {
  ID = ''

  Name = ''

  Url = '' // 服务器地址

  PrivateKey = '' // 私钥

  PublicKey = '' // 公钥

  RelationNumber = '' // 关联工厂数量

  constructor(data) {
    if (data) restoreInitDataByOrigin(this, data);
  }

  async save() {
    const resp = await api.getConvertServerSave(this).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      if (!this.ID && resp.data.Data) this.ID = resp.data.Data;
      return true;
    }
    return false;
  }
}
