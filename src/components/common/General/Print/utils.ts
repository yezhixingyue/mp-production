import { MpMessage } from '@/assets/js/utils/MpMessage';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const logoSrc = require('../../../../../public/logo.png');

/** 在本地使用js库生成二维码 */
export const getQRCodeSrc = async (content: number | string, size = 100): Promise<string | null> => {
  if (!content) return null;

  try {
    const canvas = await QRCode.toCanvas(`${content}`, {
      width: size,
      margin: 0,
      errorCorrectionLevel: 'H',
    });

    return canvas.toDataURL('image/png');

    // const ctx = canvas.getContext('2d');

    // return new Promise(resolve => {
    //   const logo = new Image(size / 4, size / 4);
    //   logo.src = logoSrc;

    //   logo.onerror = () => resolve(null);

    //   logo.onload = () => {
    //     if (!ctx) {
    //       resolve(null);
    //       return;
    //     }

    //     ctx.beginPath();

    //     ctx.fillStyle = '#fff';

    //     // 1. 填充方形背景
    //     ctx.fillRect((size - logo.width) / 2, (size - logo.height) / 2, logo.width, logo.height);

    //     // 2. 填充圆形背景
    //     // ctx.arc(size / 2, size / 2, logo.width / 2, 0, Math.PI * 2);
    //     // ctx.fill();

    //     ctx.drawImage(logo, (size - logo.width) / 2, (size - logo.height) / 2, logo.width, logo.height);

    //     ctx.closePath();

    //     resolve(canvas.toDataURL('image/png'));
    //   };
    // });
  } catch {
    MpMessage.error('打印失败', '获取二维码信息出错');
    return null;
  }
};

/** 在本地使用js库生成条形码 */
export const getBarcodeSrc = async (content: number | string, size = { width: 280, height: 36 }) => {
  if (!content) return null;

  const canvas = document.createElement('canvas');

  JsBarcode(canvas, `${content}`, { width: size.width, height: size.height, margin: 0, displayValue: false });

  return canvas.toDataURL('image/png');
};
