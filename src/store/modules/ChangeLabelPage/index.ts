import { defineStore, DefineStoreOptions } from 'pinia';
import lodopPrint from '@/assets/js/lodopPrint/index';
import messageBox from '@/assets/js/utils/message';
import { IPrintResponse, IGetOrderInfo } from '@/views/ChangeLabelPage/types';
import api from '@/api';

type IgetPrintListOptions = {
  // CreateTime: {
  //   First: string,
  //   Second: string,
  // },
  Page: number,
  KeyWords: string,
  PageSize: number,
};
type IPrintPrintData = {
  OrderID: string,
  Type: number,
  PrintCount: number,
  Number: number,
  OperatorID: string,
};
type IChangeLabelGetters = {
  orderAllNumber: () => number;
  printIsOver: () => boolean;
  PrintCount: () => number;
};
type IChangeLabelState = {
  printSettingNumber: number,
  scanInputValue: string,
  GetOrderInfo: null | IGetOrderInfo
  PrintExpressList: IGetOrderInfo[],
  PrintExpressListTotal: number,
  getPrintListOptions: IgetPrintListOptions
  PrintList: IPrintResponse[],
  _GetOrderInfo: null | IGetOrderInfo,
  printDialogVisible: boolean,
  PrintPrintData: IPrintPrintData
}
type IActions = {
  downloadFiles: (files: string[]) => void;
  setPrintSettingNumber: (num: number) => void;
  setScanInputValue: (str: string) => void;
  getPrintExpressList: (page?:number) => void;
  getPrintExpressPrint: () => void;
  RevocationOrder: (orderInfo: IGetOrderInfo, page?:number) => void;
  getPrintExpressGetOrderInfo: () => void;
  packPrint: (orderInfo: IGetOrderInfo, list:IPrintResponse[]) => void;
}

const options: DefineStoreOptions<string, IChangeLabelState, IChangeLabelGetters, IActions> = {
  id: 'changeLabelPage',
  state: () => ({
    printSettingNumber: 10, // 打印设置的打印数量
    scanInputValue: '', // 输入框
    GetOrderInfo: null, // 查询到的数据 用于后续打印
    PrintExpressList: [], // 已打印订单列表
    PrintExpressListTotal: 0,
    getPrintListOptions: { // 获取已打印订单的条件
      Page: 1,
      KeyWords: '',
      PageSize: 2,
    },
    PrintList: [], // 最近一次打印的返回值
    _GetOrderInfo: null, // 最近一次打印的查询值
    printDialogVisible: false,
    PrintPrintData: { // 打印表单
      OrderID: '00000000-0000-0000-0000-000000000000',
      Type: 0, // 0,全部打成一包；1,按款数打包；2,均打包；3,自定义；255，追加打印
      PrintCount: 0,
      Number: 0,
      OperatorID: '00000000-0000-0000-0000-000000000000',
    },
  }),
  getters: {
    orderAllNumber() {
      return (this.GetOrderInfo?.Number || 1) * (this.GetOrderInfo?.KindCount || 1);
    },
    printIsOver() { // 是否打印完
      return this.orderAllNumber <= (this.GetOrderInfo?.PrintInfo?.PrintNumber || 0);
    },
    PrintCount() { // 打印数量
      if (!this.GetOrderInfo) return 1;
      // 0: // 全部打成一包
      // 3: // 自定义打包
      // 255: // 追加打包
      if ([0, 3, 255].some((it:number) => (it === this.PrintPrintData.Type))) {
        return 1;
      }
      if (this.PrintPrintData.Type === 1) { // 按款打包
        // 未打印款数 总款数 减去 已打印款数
        const noPrintKidCount = this.GetOrderInfo.KindCount - (this.GetOrderInfo.PrintInfo?.Packages?.length || 0);
        // 如果打印设置的标签数量小于等于未打印数量则打印设置标签数量 否则打印剩余款数
        return (this.printSettingNumber <= noPrintKidCount) ? Number(this.printSettingNumber) : noPrintKidCount;
      }
      if (this.PrintPrintData.Type === 2) { // 均打包;
        //  总包裹数量 保存的包裹总数量或者输入
        const allPackageNum = this.GetOrderInfo.PrintInfo?.PackageNumber || this.PrintPrintData.Number || 0;
        // 剩余未打印的包裹数量 总包裹数量减去已打印包裹数量
        const noPrintPackage = allPackageNum - (this.GetOrderInfo.PrintInfo?.Packages.length || 0);
        // 如果打印设置的标签数量小于等于未打印数量则打印设置标签数量 否则打印剩余款数
        return (this.printSettingNumber <= noPrintPackage) ? Number(this.printSettingNumber) : noPrintPackage;
      }
      return 1;
    },
  },
  actions: {
    downloadFiles(files) {
      files.forEach(async element => {
        try {
          const response = await fetch(element);
          if (!response.ok) throw new Error(`请求失败: ${response.status}`);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = element.split('/').pop() || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 释放内存
          URL.revokeObjectURL(blobUrl);
        } catch (error) {
          console.error('下载失败:', error);
        }
      });
    },
    setPrintSettingNumber(num) {
      this.printSettingNumber = num;
    },
    setScanInputValue(str) {
      this.scanInputValue = str;
    },
    async RevocationOrder(item: IGetOrderInfo, page:number|null = null) {
      messageBox.warnCancelBox('确定要撤销此打包吗？', `${item.OrderCode}`, async () => {
        const resp = await api.changeLabelPageApis.getOrderRevocation(item.ID).catch(() => null);
        if (resp?.data?.isSuccess) {
          // 如果撤销的是最后一次打印标签的订单 则置空上次打印标签的列表
          if (item.PrintInfo?.Packages.find(it => it.ID === this.PrintList[0].ID)) {
            this.PrintList = [];
          }
          if (page) {
            this.getPrintExpressList(page);
          } else {
            this.getPrintExpressList();
          }
        }
      }, () => undefined);
    },
    async getPrintExpressGetOrderInfo() {
      const resp = await api.changeLabelPageApis.getPrintExpressGetOrderInfo(this.scanInputValue).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.GetOrderInfo = resp.data.Data;
        this.printDialogVisible = true;
      }
    },
    async getPrintExpressList(page = 1) {
      this.getPrintListOptions.Page = page;
      const resp = await api.changeLabelPageApis.getPrintExpressList(this.getPrintListOptions).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.PrintExpressList = resp.data.Data;
        this.PrintExpressListTotal = resp.data.DataNumber;
      }
    },
    async packPrint(orderInfo, PrintList = []) {
      // 调取打印机打印
      PrintList.forEach(it => {
        lodopPrint(it, orderInfo);
      });
    },
    async getPrintExpressPrint() {
      if (!this.GetOrderInfo) return;
      this.PrintPrintData.OrderID = this.GetOrderInfo?.ID || '';

      this.PrintPrintData.PrintCount = this.PrintCount;
      const resp = await api.changeLabelPageApis.getPrintExpressPrint(this.PrintPrintData).catch(() => null);
      if (resp?.data?.isSuccess) {
        this.PrintList = resp.data.Data;
        this._GetOrderInfo = JSON.parse(JSON.stringify(this.GetOrderInfo));
        const temp = this.PrintExpressList.find(it => it.OrderCode === this.GetOrderInfo?.OrderCode);
        if (temp) {
          const _temp = JSON.parse(JSON.stringify(temp));
          this.PrintExpressList = this.PrintExpressList.filter(it => it.OrderCode !== this.GetOrderInfo?.OrderCode);
          _temp.PrintInfo?.Packages.push(...resp.data.Data);
          this.PrintExpressList.unshift(_temp);
        } else {
          this.PrintExpressList.unshift(this.GetOrderInfo);
          if (this.PrintExpressList.length > 3) {
            this.PrintExpressList.splice(0, 3);
          }
        }
        // 打印
        this.packPrint(this.GetOrderInfo, this.PrintList);
        if (this.PrintPrintData.Type === 0 || this.printIsOver) {
          this.printDialogVisible = false;
        } else {
          const nowPrintMaxNumber = this.printSettingNumber * this.GetOrderInfo.Number; // 本地打印能打的最大数量
          const orderPrintNumber = this.GetOrderInfo.PrintInfo?.PrintNumber || 0; // 已打印数量
          switch (this.PrintPrintData.Type) {
            case 1: // 款数打包
              if (orderPrintNumber + nowPrintMaxNumber >= this.orderAllNumber) {
                this.printDialogVisible = false;
              }
              break;
            case 2: // 均打包
              if ((this.GetOrderInfo.PrintInfo?.Packages.length || 0) + this.PrintCount
              >= (this.GetOrderInfo.PrintInfo?.PackageNumber || this.PrintPrintData.Number)) {
                this.printDialogVisible = false;
              }
              break;
            case 3: // 自定义打包
              if (this.orderAllNumber <= Number(this.PrintPrintData.Number) + Number(orderPrintNumber)) { // 如果订单总数量小于等于设置的打印设置能打印出的最大数量
                this.printDialogVisible = false;
                // 如果有打印过 并且已打印数量加要打印数量大于等于订单的总数量
              }
              break;

            default:
              break;
          }
        }
        let num = 0;
        resp.data.Data.forEach(it => {
          num += it.Number || 0;
        });
        this.GetOrderInfo.PrintInfo = {
          PackageNumber: this.PrintPrintData.Number,
          Packages: [...this.GetOrderInfo.PrintInfo?.Packages || [], ...resp.data.Data],
          PrintNumber: (this.GetOrderInfo.PrintInfo?.PrintNumber || 0) + num,
          Type: this.PrintPrintData.Type || 0,
        };
      }
    },
  },
  persist: {
    // key: process.env.VUE_APP_TARGET === 'My Order App' ? 'my_prod-order_user' : 'my_prod_user', // 自定义缓存中的key键名
    key: 'my_change_label-data', // 自定义缓存中的key键名
    storage: localStorage, // 自定义缓存类型，默认sessionStorage，
    paths: ['printSettingNumber', 'PrintList', '_GetOrderInfo'], // 自定义指定持久化的字段，默认为全部
  },
};

export const useChangeLabelStore = defineStore(options);
