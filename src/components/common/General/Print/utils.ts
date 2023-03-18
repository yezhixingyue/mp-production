import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';

/**
 * 获取二维码图片地址
 *
 * @param {(number | string)} content 二维码要展示的内容 必传
 * @param {number} [size] 二维码尺寸 选传
 * @returns
 */
export const getQRCodeSrc = async (content: number | string, size?: number) => {
  if (!content) return null;

  const resp = await api.getQRCodeSrc(content, size).catch(() => null);

  if (resp?.status === 200 && resp.data) {
    const blob = new Blob([resp.data as unknown as ArrayBuffer]);

    const src = window.URL.createObjectURL(blob);

    return src;
  }

  MpMessage.error('打印失败', '获取二维码信息出错');

  return null;
};
