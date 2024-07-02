import api from '@/api';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { IProductionLineSet } from '@/assets/Types/ProductionLineSet/types';
import { getBarcodeSrc, getQRCodeSrc } from '@/components/common/General/Print/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { Condition } from './Condition';
import { IDigitalOrderPlateInfo, ILocalDigitalOrderPlatePrintInfoWithQrCode } from './types';
import { DigitalImpositionStatusEnum } from './enum';

/** 数码工单打印管理类 */
export class ManageDigitalListClass {
  condition = new Condition()

  list: IDigitalOrderPlateInfo[] = []

  listNumber = 0

  loading = false

  clearCondition() {
    this.condition = new Condition();
  }

  /** 获取列表数据 */
  async getList(Page = 1) {
    this.condition.Page = Page;
    this.list = [];

    const temp = this.condition.filter();

    this.loading = true;
    const resp = await api.productionManageApis.getOfflinePlateList(temp).catch(() => null);
    this.loading = false;

    if (resp?.data?.isSuccess) {
      this.list = resp.data.Data;
      this.listNumber = resp.data.DataNumber;
    }
  }

  /** 导出大版 */
  // eslint-disable-next-line class-methods-use-this
  async getPlateFileRetransfer(OrderID: string) {
    const resp = await api.productionManageApis.getPlateFileRetransfer(OrderID);

    if (resp.data?.isSuccess) {
      MpMessage.success('导出成功');
    }
  }

  /** 顶部数码生产线筛选 */
  DigitalLineList: { ID: string, Name: string }[] = [{ ID: '', Name: '所有生产线' }]

  /** 获取所有数码生产线列表 - 用于顶部筛选 */
  private async _getDigitalLineList() {
    const resp = await api.getProductionLineList({ Type: LineTypeEnum.normal, IsDigital: true }).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.DigitalLineList = [{ ID: '', Name: '所有生产线' }, ...(resp.data.Data as IProductionLineSet[]).filter(it => it.IsDigital)];
    }
  }

  /** 选中的列表数据 */
  Selection: IDigitalOrderPlateInfo[] = []

  setSelection(list: IDigitalOrderPlateInfo[]) {
    this.Selection = list;
  }

  /** 请求打印数据 */
  async requestPrint(IsPrint: boolean) {
    if (this.Selection.length === 0) return null;

    const List = this.Selection.map(it => it.Code);

    const resp = await api.productionManageApis.getOfflinePlatePrint({ List, IsPrint }).catch(() => null);

    if (resp?.data?.isSuccess) {
      if (IsPrint) {
        this.Selection.forEach(it => {
          const t = this.list.find(_it => _it.Code === it.Code);
          if (t) t.Status = DigitalImpositionStatusEnum.HavePrint; // 修改为已打印状态
        });
      }

      // 为每个条目上添加二维码信息（版和块编号）
      const list: ILocalDigitalOrderPlatePrintInfoWithQrCode[] = resp.data.Data.map(it => ({
        ...it,
        _PlateQcCode: '',
        _ChunkQcCode: '',
        _StartBarCode: '',
      }));

      const _generateQrcode = async (it: ILocalDigitalOrderPlatePrintInfoWithQrCode) => {
        const [url1, url2, url3] = await Promise.all([getQRCodeSrc(it.Code), getQRCodeSrc(it.ChunkList[0]?.Code || ''), getBarcodeSrc(it.StartCode)]);

        if (url1 && url2 && url3) {
          const _it = it;
          _it._PlateQcCode = url1;
          _it._ChunkQcCode = url2;
          _it._StartBarCode = url3;
        } else {
          throw new Error('二维码转换失败');
        }
      };

      await Promise.all(list.map(it => _generateQrcode(it)));

      return list;
    }

    return null;
  }

  init() {
    this._getDigitalLineList();
    this.getList();
  }
}
