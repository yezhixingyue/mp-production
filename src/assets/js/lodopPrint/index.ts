import jrQrcode from 'jr-qrcode';
import getLodop from './lodopFuncs';

let LODOP:any;

let oInp: HTMLElement | null = document.querySelector('li.mp-print-label-header-inp-wrap > input');

function CreateOnePage({
  StationSN, StationName, DistrictSN, DistrictName,
  CustomerSN, ExpressText, CustomerName, userInfo,
  ProductClass, ProductName, KindCount, ProductAmount, Unit, SizeString, Content, LastPrintTime, PackageID }) {
  LODOP = getLodop();
  LODOP.PRINT_INIT('名片之家打印控件测试');
  LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', '33%');
  const _src = jrQrcode.getQrBase64(`${PackageID}`);

  const FirstName = StationSN || StationName;
  const SecondName = StationSN ? `${StationName} - ${DistrictSN}` : DistrictName;

  const _PrintInner = `<style>
  .printWrap {
    width: 210mm;
    height: 150mm;
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
ul {
    padding: 0;
    margin: 0;
}
p {
    margin: 0;
}
.content {
    width: 192mm;
    margin: 0;
    margin-left: 7mm;
    border: 1.5pt solid #000;
}

.header {
    text-align: center;
    box-sizing: border-box;
    position: relative;
    height: 72mm;
    border-bottom: 1.5pt solid #000;
    overflow: hidden;
}

.header ul {
    width: 66%;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    border-right: 1.5pt solid #000;
    overflow: hidden;
}
.header ul li {
    width: 100%;
    overflow: hidden;
}
.header ul .header-item-1 {
    font-size: 85pt;
    border-bottom: 1.5pt solid #000;
    height: 30mm;
    line-height: 29mm;
}

.header-item-2 {
    font-size: 38pt;
    padding-left: 3mm;
    border-bottom: 1.5pt solid #000;
    height: 21mm;
    line-height: 21mm;
    overflow: hidden;
    text-align: left;
    font-weight: 700;
}

.header-item-3 {
    padding-left: 3mm;
    font-size: 26pt;
    height: 21mm;
    line-height: 17mm;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}


.header div {
    width: 65mm;
    border-bottom: 1.5pt solid #000;
    position: absolute;
    right: 0;
    height: 100%;
}

.header div div {
    padding-top: 2pt;
    position:absolute;
    top: 0;
    width: 100%;
    overflow: hidden;
}

.package-id-box {
    font-size: 20pt;
    height: 10mm;
    line-height: 10mm;
}
img.img-code {
    width: 74%;
}

.express {
    background-color: #000;
    font-size: 26pt;
    color: #fff;
    height: 12mm;
    font-weight: 700;
    line-height: 12mm;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}

.content-bottom .bt-item-1 {
    padding-left: 3mm;
    font-size: 30pt;
    border-bottom: 1.5pt solid #000;
    height: 20mm;
    line-height: 20mm;
}

.content-bottom .bt-item-1 .mobile-wrap {
    padding-left: 1mm;
    margin-left: 4px;
}

.bt-item-2 {
    height: 45mm;
    padding-top: 1mm;
    padding-left: 1mm;
    line-height: 14mm;
    font-size: 27pt;
    font-weight: lighter;
    overflow: hidden;
}

.bt-item-3 {
    height: 28mm;
    border-bottom: 1.5pt solid #000;
    border-top: 1.5pt solid #000;
    line-height: 13mm;
    text-align: center;
    padding-top: 0.5mm;
    position: relative;
}

.bt-item-3-div-1 {
    width: 28mm;
    font-size: 26pt;
    position: absolute;
    left: 0;
}

.bt-item-3-div-1-p-1 {
    text-align: center;
}

.bt-item-3-div-2 {
    background-color: #000;
    color: #fff;
    font-size: 28pt;
    line-height:12mm;
    width: 20mm;
    font-weight: 700;
    padding-top: 0mm;
    position: absolute;
    left: 30mm;
    top: -0.5mm;
    bottom: -0.5mm;
}

.bt-item-3-div-3 {
    width: 138mm;
    text-align: left;
    padding-left: 5mm;
    position: absolute;
    right: 0;
}

.bt-item-3-div-3 p {
    white-space: nowrap;
    overflow: hidden;
    line-height: 14mm;
    font-size: 24pt;
}

.bt-item-3-div-3 p.second {
    line-height: 13mm;
    font-size: 24pt;
}

.bt-item-4 {
    height: 33mm;
    padding-top: 2mm;
    padding-left: 3mm;
    text-align: left;
}

.bt-item-4 div {
    overflow: hidden;
}

.bt-item-4-div-1 {
    height: 20mm;
    line-height: 10mm;
    font-size: 24pt;
}

.bt-item-4-div-2 {
    height: 12mm;
    line-height: 12mm;
    font-size: 18pt;
}
</style>
<section class="printWrap">

    <div class="content">
        <div class="header">
          <ul>
              <li class="header-item-1">${FirstName}</li>
              <li class="header-item-2">
                  ${SecondName}
              </li>
              <li class="header-item-3">
                  ${CustomerSN}  ${CustomerName}
              </li>
          </ul>
          <div>
              <div>
                  <img class="img-code" src="${_src}">
                  <p class="package-id-box">${PackageID}</p>
              </div>
              <p class='express'>${ExpressText}</p>
          </div>
        </div>
        <ul class="content-bottom">
            <li class="bt-item-3">
                <div class="bt-item-3-div-1">
                    <p class="bt-item-3-div-1-p-1">检</p>
                    <p>${userInfo}</p>
                </div>
                <div class="bt-item-3-div-2">
                    <p>产</p>
                    <p>品</p>
                </div>
                <div class="bt-item-3-div-3">
                    <p>${ProductClass} - ${ProductName}</p>
                    <p class="second">${KindCount}款 - ${ProductAmount}${Unit} - ${SizeString}</p>
                </div>
            </li>
            <li class="bt-item-4">
                <div class="bt-item-4-div-1">
                    备注：${Content}
                </div>
                <div class="bt-item-4-div-2">
                    <p>打印时间${LastPrintTime}</p>
                </div>
            </li>
        </ul>
    </div>

</section>`;
  LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', _PrintInner);
  LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, '');
}

export default function lodopPrint(obj) {
  console.log('lodopPrint');
  CreateOnePage(obj);
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
