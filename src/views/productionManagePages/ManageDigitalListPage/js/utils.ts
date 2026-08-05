import { getQRCodeSrc, getBarcodeSrc } from '@/components/common/General/Print/utils';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from './types';

/** 为数码大版打印条目数据附加二维码信息 */
export const generateDigitalOrderPlatePrintInfoQrcode = async (it: ILocalDigitalOrderPlatePrintInfoWithQrCode) => {
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
