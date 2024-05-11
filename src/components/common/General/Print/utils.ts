import { MpMessage } from '@/assets/js/utils/MpMessage';
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
