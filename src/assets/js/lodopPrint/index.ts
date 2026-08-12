import jrQrcode from 'jr-qrcode';
import { useUnitGetUnit } from '@/assets/js/utils';
import getLodop from './lodopFuncs';

let LODOP;

let oInp: HTMLElement | null = document.querySelector('li.mp-print-label-header-inp-wrap > input');

function CreateOnePage(
  { ID },
  { Address, Customer, SecondLevel, ProductName, KindCount, Number, Unit, Size, Content },
) {
  LODOP = getLodop();
  LODOP.PRINT_INIT('名片之家打印控件测试');
  LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '100%');
  const _src = jrQrcode.getQrBase64(`${ID}`);

  const BranchAllName = `${Address.Delivery.DistrictName || ''}${Address.Delivery.StationName || ''}`;
  const temp = new Date();
  const Hours = temp.getHours();
  const Minutes = temp.getMinutes();
  const dataStr = `${temp.getFullYear()}年${temp.getMonth() + 1}月${temp.getDate()}日
  ${Hours <= 9 ? `0${Hours}` : Hours}:${Minutes <= 9 ? `0${Minutes}` : Minutes}`;
  const _PrintInner = `<style>
  .printWrap {
    width: 70mm;
    height: 50mm;
    padding: 0;
    margin: 0;
    padding-top: 4mm;
    overflow: hidden;
    box-sizing: border-box;
    text-shadow: 0.01em 0.01em 0.1em #999999 !important
}
li {
    list-style: none;
}
ul, html, body {
    padding: 0;
    margin: 0;
}
p {
    margin: 0;
}
</style>
<section class="printWrap">

    <div style="width:238.58px;height:170px;display: block; box-sizing: border-box;
    border: 1px solid #000;color: #000; margin: 0 auto;">
      <div style="display: flex;" >
        <div style="width: 156.96px;height: 88.43px;border-bottom: 1px solid #000;color: #000;border-right: 1px solid #000;color: #000;">
          <div style="font-size: 17px;overflow: hidden;height: 66px; display: flex; flex-wrap: wrap;
          align-items: center;justify-content: center;position: relative;">
            <div style="${BranchAllName.length > 18 ? '' : 'font-size: 14px;'}">
              ${Address.Delivery.StationName}
              ${Address && Address.Delivery && Address.Delivery.DistrictName ? `-${Address.Delivery.DistrictName}` : ''}
            </div>
            ${!Address.Address.UsualAddress ? `<div style="width:1.2em;height:1.2em;line-height:1.2em;font-size:20px;
            text-align:center;background-color:#000; color: #fff; position: absolute;right: 0;bottom: 0;">代</div>` : ''}
            
          </div>
          <div style="font-size: 11px;line-height: 23.95px;height: 23.95px;border-top: 1px solid #000;color: #000;text-indent: 5px;overflow: hidden;">
            ${Customer.CustomerSN} ${Customer.CustomerName}
          </div>
        </div>
        <div style="width: 81.89px;height: 88.43px; display: flex;flex-direction: column;justify-content: center;align-items: center;">
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;border-bottom: 1px solid #000;color: #000;
          width: 100%; flex: 1; padding-top: 2px;">
            <img style="width: 70px;height: 70px;" src="${_src}" alt="">
          </div>
          <div style="font-size: 11px;border-bottom: 1px solid #000;color: #000;width:100%;text-align: center;line-height: 16.43px;height: 16.43px;">
            ${ID}
          </div>
        </div>
      </div>
      <div style="display: flex;line-height: 18px; font-size: 11px;border-bottom: 1px solid #000;color: #000;">
        <div style="min-width: 23px;width: 23px; font-size: 12px;border-right: 1px solid #000;color: #000;text-align: center;">产品</div>
        <div style="text-indent: 5px;">
          <p style="width: 100%; height: 18px; overflow: hidden;">
            ${SecondLevel}-${ProductName}
          </p>
          <p style="width: 100%; height: 18px; overflow: hidden;">
            ${KindCount}款-${Number}${useUnitGetUnit(Unit)}/款${Size ? `-${Size}` : ''}
          </p>
        </div>
      </div>
      <div style="display: flex;flex-direction: column; padding-left: 5px;">
        <p style="font-size: 11px;height: 30px;line-height: 15px; overflow: hidden;">
          备注：${Content}
        </p>
        <div style="font-size: 8px;">打印时间：${dataStr}</div>
      </div>
    </div>

</section>`;
  LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', _PrintInner);
  LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, '');
}

export default function lodopPrint(obj, orderInfo) {
  CreateOnePage(obj, orderInfo);
  // LODOP.SET_PREVIEW_WINDOW(1, 0, 0, 0, 0, "");
  // LODOP.PREVIEW();
  //        LODOP.PREVIEW();
  LODOP.PRINT();
  //        LODOP.PRINT_SETUP();
  if (!oInp) oInp = document.querySelector('li.mp-print-label-header-inp-wrap > input');
  if (oInp) {
    oInp.focus();
  }
}
