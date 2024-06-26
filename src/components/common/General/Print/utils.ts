import { MpMessage } from '@/assets/js/utils/MpMessage';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

/** 在本地使用js库生成二维码 */
export const getQRCodeSrc = async (content: number | string, size?: number) => {
  if (!content) return null;

  try {
    const url = await QRCode.toDataURL(`${content}`, { width: size, margin: 0 });

    return url;
  } catch {
    MpMessage.error('打印失败', '获取二维码信息出错');
    return null;
  }
};

/** 在本地使用js库生成条形码 */
export const getBarcodeSrc = async (content: number | string) => {
  if (!content) return null;

  const canvas = document.createElement('canvas');

  JsBarcode(canvas, `${content}`, { width: 280, height: 36, margin: 0, displayValue: false });

  return canvas.toDataURL('image/png');
};
