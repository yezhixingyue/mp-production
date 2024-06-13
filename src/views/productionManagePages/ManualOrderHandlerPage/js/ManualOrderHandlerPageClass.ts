import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElMessage } from 'element-plus';
import { getMaterialTypeGroup, IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { PlaceStepEnum } from './enums';
import { PlaceOrderClass } from './PlaceOrderClass';
import { IBaseProperty, IPrintColor, ProductLineSimpleType, SourceOrderData } from './types';

export class ManualOrderHandlerPageClass {
  stepList = [
    { ID: PlaceStepEnum.First, Name: '填写订单信息' },
    { ID: PlaceStepEnum.Second, Name: '设置生产工序' },
    { ID: PlaceStepEnum.Third, Name: '报价汇总' },
    { ID: PlaceStepEnum.Fourth, Name: '下单完成' },
  ]

  curStep = PlaceStepEnum.First

  source: { isManual: boolean, serverID: string | number, orderID: string, sourceOrderData: null | SourceOrderData } = {
    isManual: true, // 是否为手动下单  手动下单|来自销售系统
    serverID: '',
    orderID: '',
    sourceOrderData: null,
  }

  CreateOrderInfo = new PlaceOrderClass()

  oldServerOrderID = ''

  get curServerOrderID() { // 当前订单引入依赖信息
    if (!this.source.isManual) {
      return [this.source.serverID, this.source.orderID].join('-');
    }
    return '';
  }

  onPrevClick() { // 清除价格、运费 - 暂不比对
    switch (this.curStep) {
      case PlaceStepEnum.Second: // 从第二步回退至第一步
        this.curStep = PlaceStepEnum.First;
        // 是否进行相关处理 -- 或许不需要
        this.oldServerOrderID = this.curServerOrderID;
        break;

      case PlaceStepEnum.Third: // 从第三步回退至第二步 --  如果已输入价格 则此时提示 确定回退至上一步吗 回退将会清空已输入的价格
        if (/^\d+(\.\d+)?$/.test(this.CreateOrderInfo.Funds.FinalPrice) || /^\d+(\.\d+)?$/.test(this.CreateOrderInfo.Funds.Freight)) {
          MpMessage.warn({
            title: '确定返回上一步吗?',
            msg: '该操作将会清除已输入的价格运费信息',
            onOk: () => {
              this.CreateOrderInfo.Funds.FinalPrice = '';
              this.CreateOrderInfo.Funds.Freight = '';
              this.curStep = PlaceStepEnum.Second;
            },
          });
        } else {
          this.curStep = PlaceStepEnum.Second;
        }
        // 是否进行相关处理 -- 或许不需要
        break;

      default:
        break;
    }
  }

  async onNextClick(cb?: () => void) { // 下一步 需要校验当前步是否完成 并且根据情况生成下一步数据
    let result = false;
    switch (this.curStep) {
      case PlaceStepEnum.First: // 前往第二步 -- 需要进行前一步内容填写校验
        // 1. 校验
        if (!this.source.isManual && !this.source.sourceOrderData) {
          MpMessage.error('操作失败', '未检索到订单信息');
          return;
        }
        if (this.source.isManual && !this.CreateOrderInfo.validateFirstStep()) {
          return;
        }
        // 2. 校验通过后：跳转第二步
        this.curStep = PlaceStepEnum.Second;
        // 3. 到第二步时需要获取下生产线列表数据
        if (this.curServerOrderID !== this.oldServerOrderID) this._setInfoBySourceOrderInfo();
        this.getProductionLineList();
        this.getFileSuffixList();
        break;

      case PlaceStepEnum.Second: // 前往第三步 -- 需要进行前一步内容填写校验
        // 1. 校验
        result = this.CreateOrderInfo.validateSecondStep();
        if (!result) return;
        // 2. 校验通过后：
        this.curStep = PlaceStepEnum.Third;
        break;

      case PlaceStepEnum.Third: // 前往第四步 -- 需要进行前一步内容填写校验
        // 1. 校验
        result = this.CreateOrderInfo.validateThirdSep();
        if (!result) return;
        // 2. 校验通过后：转换数据格式 准备进行提交
        // 3. 上传文件 --- 已在前面步骤中完成
        // 4. 数据整理 - 提交

        // 5. 提交成功后跳转至第四步
        result = await this.CreateOrderInfo.submit((!this.source.isManual && this.source.sourceOrderData) ? this.source : undefined);
        if (cb) cb();
        if (result) this.curStep = PlaceStepEnum.Fourth;
        // 是否进行相关处理 -- 或许不需要
        break;

      default:
        break;
    }
  }

  /** 从销售系统引入订单信息 */
  async getSourceOrderInfo() {
    const { serverID, orderID } = this.source;
    if (this.source.sourceOrderData && `${this.source.sourceOrderData.SellOrderID}` === `${orderID}`) {
      ElMessage({
        showClose: true,
        message: '订单信息已获取',
        type: 'error',
      });
      return;
    }
    this.source.sourceOrderData = null;
    const resp = await api.ManualOrderHandlerApis.getSellPartOrderDetail(serverID, orderID).catch(() => null);
    if (resp && resp.data?.isSuccess) {
      const t = this.ExpressList.find(it => it.ID === resp.data?.Data.Address?.Express?.Second);
      if (!t) {
        MpMessage.error('订单解析失败', `在生产系统中找不到${resp.data.Data.Address?.ExpressText || '配送方式'}`);
        return;
      }
      this.source.sourceOrderData = resp.data.Data;
    }
  }

  /** 清除并重新设置从销售系统引入的订单信息 */
  private _setInfoBySourceOrderInfo() {
    const { ProducePeriod, Customer, ReceiveType, Address } = this.CreateOrderInfo;
    this.CreateOrderInfo = new PlaceOrderClass();
    this.CreateOrderInfo.ProducePeriod = ProducePeriod;
    this.CreateOrderInfo.Customer = Customer;
    this.CreateOrderInfo.ReceiveType = ReceiveType;
    this.CreateOrderInfo.Address = Address;

    const data = !this.source.isManual ? this.source.sourceOrderData : null;

    this.CreateOrderInfo.Attribute.ProductAmount = data && typeof data.Attribute.ProductAmount === 'number' ? data.Attribute.ProductAmount : '';
    this.CreateOrderInfo.Attribute.Unit = data?.Attribute?.Unit || '';
    this.CreateOrderInfo.Content = data?.Content || '';
    this.CreateOrderInfo.Funds.FinalPrice = data && typeof data.Funds.FinalPrice === 'number' ? data.Funds.FinalPrice : '';
    this.CreateOrderInfo.Funds.Freight = data && typeof data.Funds.Freight === 'number' ? data.Funds.Freight : '';
  }

  ExpressList: IBaseProperty<number>[] = []

  private async getExpressList() {
    const resp = await api.getExpressList().catch(() => null);
    if (resp?.data?.isSuccess) {
      const list = (resp.data.Data as IBaseProperty<number>[]);
      this.ExpressList = [...list];
    }
  }

  ConvertServerList:IBaseProperty<number>[] = []

  private async getConvertServerList() {
    const resp = await api.getConvertServerList().catch(() => null);
    if (resp?.data?.isSuccess) {
      const list = resp.data.Data as IBaseProperty<number>[];
      this.ConvertServerList = list;
    }
  }

  ProductionLineList: ProductLineSimpleType[] = []

  private async getProductionLineList() {
    if (this.ProductionLineList.length > 0) return;
    const resp = await api.getProductionLineAll().catch(() => null);
    if (resp?.data?.isSuccess) {
      this.ProductionLineList = resp.data.Data as ProductLineSimpleType[];
    }
  }

  FactoryMaterialClassList: IMaterialTypeGroupItemType[] = []

  /** 获取物料类型数据 */
  async getFactoryMaterialClassList() {
    if (this.FactoryMaterialClassList.length > 0) return;
    const result = await getMaterialTypeGroup(true);
    const list = result.filter(it => it.MaterialTypes.length > 0);
    this.FactoryMaterialClassList = list;
  }

  /** 专色列表数据 */
  SpecialColorList: IPrintColor[] = [];

  /** 获取专色列表数据 */
  getSpecialColorList = async () => {
    if (this.SpecialColorList.length > 0) return;
    const resp = await api.getPrintColorList(false).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.SpecialColorList = resp.data.Data;
    }
  }

  /** 数值列表数据 */
  AssistNumbericalList: IAssistListItem[] = [];

  /** 获取数值列表数据 */
  getAssistNumbericalList = async () => {
    if (this.AssistNumbericalList.length > 0) return;
    const resp = await api.getNoteAll(AssistInfoTypeEnum.numerical).catch(() => null);
    if (resp?.data?.isSuccess) {
      this.AssistNumbericalList = resp.data.Data;
    }
  }

  _fileAccept = {
    pdf: '.pdf',
    assist: '',
  }

  private async getFileSuffixList() {
    if (this._fileAccept.assist) return;
    const resp = await api.getFileSuffixList().catch(() => null);
    if (resp?.data?.isSuccess) {
      this._fileAccept.assist = resp.data.Data.join(',');
    }
  }

  /** 设置生产线  在此加了一层代理， 目的是在该处获取到选中生产线的详细信息以供下面使用 */
  setCurProdutionLine(e: ProductLineSimpleType) {
    // 1. 获取生产线详细信息 及 物料弹窗类别信息  可使用Promise.all方法 --- 在内部获取
    // api.ManualOrderHandlerApis.getProductionLineDetail(e.ID);
    // 2. 使用获取到的生产线详细信息传与CreateOrderInfo生成生产线实例使用
    this.CreateOrderInfo.setCurProdutionLine(e);
  }

  constructor(origindata?: Pick<ManualOrderHandlerPageClass,
    'ExpressList' | 'ProductionLineList' | 'FactoryMaterialClassList' | 'SpecialColorList' | '_fileAccept' | 'AssistNumbericalList' | 'ConvertServerList'>) {
    if (origindata) {
      this.ExpressList = origindata.ExpressList;
      this.ProductionLineList = origindata.ProductionLineList;
      this.FactoryMaterialClassList = origindata.FactoryMaterialClassList;
      this.SpecialColorList = origindata.SpecialColorList;
      this.AssistNumbericalList = origindata.AssistNumbericalList;
      this.ConvertServerList = origindata.ConvertServerList;
      this._fileAccept.assist = origindata._fileAccept.assist;
    } else {
      this.getExpressList();
      this.getConvertServerList();
      // this.getProductionLineList(); // 临时获取 方便开发 开发完成后需注释掉该行
    }
  }
}
