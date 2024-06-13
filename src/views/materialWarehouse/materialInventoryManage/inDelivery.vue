<template>
  <div class="in-delivery-page">
    <main>
      <p>入库信息</p>
      <!-- <MpCardContainer> -->
        <el-scrollbar>
          <div class="delivery-info">
            <div class="left">
              <el-form label-width="84px" :rules="rules" :model="Data.inDeliveryForm">
                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input v-model.trim="Data.getMaterialData.SKUCode"
                    placeholder="请输入完整SKU编码，包括尺寸编码"
                     @keyup.enter="getMaterial()" size="large">
                      <template #append>
                        <mp-button link type="primary" @click="getMaterial()">
                          <el-icon><Search /></el-icon>
                          查询</mp-button>
                      </template>
                     </el-input>
                  </p>
                  <span style="color: #C7C7C7;">或者</span>
                </el-form-item>
                <el-form-item :label="`选择物料：`" class="select-material">
                  <ThreeCascaderComp
                  ref="ThreeCascaderComp"
                  :change="ThreeCascaderCompChange"
                  ></ThreeCascaderComp>
                  <OneLevelSelect
                  v-if="Data.itemSelectTempMaterial"
                    :options='SizeSelects'
                    :defaultProps="{
                      value:'SizeID',
                      label:'SizeDescribe',
                    }"
                    :value='Data.SizeSelects'
                    @change="SizeSelectChange"
                    :width="266"
                    :filterable='true'
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
                  <OneLevelSelect
                    v-else
                    :options='[]'
                    :width="266"
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
                </el-form-item>
                <p class="material-info">
                  <template v-if="Data.checkedMaterial">
                    <span>
                      {{Data.checkedMaterial.AttributeDescribe}}
                    </span>
                    <span>{{Data.checkedMaterial.SizeDescribe}}</span>
                    <span>{{Data.checkedMaterial.Code}}</span>
                  </template>
                </p>
                <div style="display: flex;">
                  <el-form-item :label="`入库数量：`" class="in-number" prop="Number">
                    <el-input placeholder="请输入入库数量"
                    class="number" v-model="Data.inDeliveryForm.Number" />
                    </el-form-item>
                    <p style="margin-bottom: 18px;display: flex; align-items: center;">
                      <OneLevelSelect
                        v-if="Data.checkedMaterial"
                        :options='Data.checkedMaterial.UnitSelects'
                        :defaultProps="{
                          value:'UnitID',
                          label:'Unit',
                        }"
                        :value='Data.inDeliveryForm.UnitID'
                        @change="(ID) => Data.inDeliveryForm.UnitID = ID"
                        :width="140"
                        :filterable='true'
                        :placeholder="'请选择单位'"
                        style="margin: 0 10px;"
                        ></OneLevelSelect>
                        <template v-if="Data.checkedMaterial">
                          {{getTransitionNum}}
                          {{Data.checkedMaterial?.StockUnit}}
                        </template>
                    </p>

                </div>
                <el-form-item :label="`入库类型：`" class="StockType">
                  <el-radio-group v-model="Data.inDeliveryForm.InStockType" size="large">
                    <el-radio-button :label="1">采购</el-radio-button>
                    <el-radio-button :label="2">退料</el-radio-button>
                    <el-radio-button :label="3">赠送</el-radio-button>
                    <el-radio-button :label="4">成品</el-radio-button>
                    <!-- <el-radio :label="5">盘库</el-radio> -->
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="`供应商：`"
                v-if="Data.inDeliveryForm.InStockType === 1
                || Data.inDeliveryForm.InStockType === 3"
                class="supplier">
                  <OneLevelSelect
                    :options='MaterialWarehouseStore.SupplierSelectList'
                    :defaultProps="{
                      value:'SupplierID',
                      label:'SupplierName',
                    }"
                    :value='Data.inDeliveryForm.SupplierID'
                    @change="(ID) => Data.inDeliveryForm.SupplierID = ID"
                    :width="166"
                    :filterable='true'
                    :placeholder="'请选择供应商'"
                    ></OneLevelSelect>
                    <el-form-item :label="`单价：`" v-if="Data.inDeliveryForm.InStockType === 1"
                      size="large" prop="Price">
                      <el-input
                      class="price-number"
                      :max="999999.99"
                      placeholder="请输入单价"
                      :controls="false" :min="0" v-model="Data.inDeliveryForm.Price"
                      size="large"/>
                      <template v-if="inUnitName">
                      元/{{inUnitName}}
                      </template>
                    </el-form-item>
                    <el-form-item :label="`共计：`" v-if="Data.inDeliveryForm.InStockType === 1">
                      <p style="font-size: 16px;">
                        ￥  <span style="color:red">{{Math.floor(Number(Data.inDeliveryForm.Price) * Number(Data.inDeliveryForm.Number) * 1000) / 1000}}</span>元
                      </p>
                    </el-form-item>
                </el-form-item>
                <el-form-item :label="`退料人：`"
                v-if="Data.inDeliveryForm.InStockType === 2
                || Data.inDeliveryForm.InStockType === 4"
                class="supplier">
                  <OneLevelSelect
                    :options='CommonStore.StaffSelectList'
                    :defaultProps="{
                      value:'StaffID',
                      label:'StaffName',
                    }"
                    :value='Data.inDeliveryForm.Handler'
                    @change="(ID) => Data.inDeliveryForm.Handler = ID"
                    :width="300"
                    :filterable='true'
                    :placeholder="'请选择退料人'"
                    ></OneLevelSelect>
                </el-form-item>
                <el-form-item :label="`备注：`" class="remark">
                  <el-input :maxlength="300" placeholder="请输入备注" v-model="Data.inDeliveryForm.Remark" size="large"/> (选填)
                </el-form-item>
              </el-form>

            </div>
            <div class="line"></div>
            <div class="right">
              <mp-button type="primary" @click="Data.SelectGoods = true">
                <img src="@/assets/images/selectGoodsAllocation.png" alt="">
                选择货位
              </mp-button>
                <div class="warehouse">
              <el-scrollbar>
                  <div class="warehouse-item"
                  v-for="(item, index) in Data.inStorehouseGoodsPosition" :key="item.StorehouseID">
                    <p class="title">
                      <span>
                        <b>{{item.StorehouseName}}</b>：
                        入库
                        {{getStorehouseInNumber(item.GoodsPositionList)}}
                        {{Data.checkedMaterial?.StockUnit}}
                      </span>
                    </p>
                    <ul>
                      <li v-for="(GoodsPosition, i) in item.GoodsPositionList" :key="GoodsPosition.PositionID">
                        <span class="ranks">
                          <MpTip
                          effect="dark"
                          :content="`${GoodsPosition.LocationName} ${GoodsPosition.PositionName}`"
                          placement="top"
                          :disabled="`${GoodsPosition.LocationName} ${GoodsPosition.PositionName}`.length < 10">
                            {{GoodsPosition.LocationName}}
                            {{GoodsPosition.PositionName}}
                          </MpTip>
                        </span>
                        <span class="number">
                          <span>
                          入库
                              <el-form :rules="formRules" :model="GoodsPosition">
                                <el-form-item prop="Number" style="margin: 0 10px;">
                                  <el-input :disabled="!Data.checkedMaterial || !getTransitionNum"
                                  v-model="GoodsPosition.Number"
                                  ></el-input>
                                </el-form-item>
                              </el-form>
                            {{Data.checkedMaterial?.StockUnit}}
                          </span>
                        </span>
                        <mp-button type="danger"
                        @click="delGoodsPosition(index, i, item.StorehouseID, GoodsPosition.selectedLocationID)">
                        <i class="iconfont icon-delete"></i>删除
                      </mp-button>
                      </li>
                    </ul>
                  </div>
              </el-scrollbar>
                </div>
              <p class="total" v-if="Data.inStorehouseGoodsPosition.length">
                合计：{{getStorehouseAllInNumber()}}{{Data.checkedMaterial?.StockUnit}}
                （{{getInUnitNum}}{{inUnitName}}）
              </p>
            </div>
          </div>
          <div class="btn">
            <mp-button type="danger" @click="inDelivery">入库</mp-button>
          </div>
        </el-scrollbar>
      <!-- </MpCardContainer> -->
    <InDeliveryDialog
    :visible='Data.SelectGoods'
    :primaryClick="SelectGoodsPrimaryClick"
    :changeVisible="(visible) => Data.SelectGoods = visible"
    :StorehouseList="Data.StorehouseList"
    :currentMaterialID="Data.checkedMaterial?.MaterialID"
    :_selectStorehouseGoodsPosition="selectStorehouseGoodsPosition"
    ref="InDeliveryDialogRef"
    >
    </InDeliveryDialog>
    </main>

  </div>
</template>

<script lang='ts'>
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';
import {
  ref, Ref, reactive, onMounted, computed,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { MaterialInfoType } from '@/assets/Types/common';
import InDeliveryDialog from '@/components/materialInventoryManage/inDeliveryDialog.vue';

interface UnitSelectsType {
  UnitID: string,
  Unit: string,
  UnitName: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: string,
  CodeID: number,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: true
}
interface SizeSelectsType {
  MaterialID: string,
  SizeID: string,
  Code: string,
  SizeDescribe: string
}
interface MaterialSelectsType {
  CodeID: number,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeSelects: SizeSelectsType[]
  AttributeDescribe:string
}
interface MaterialDataItemType {
  StockUnit: string,
  Code: string,
  UnitSelects: UnitSelectsType[],
  MaterialSelects: MaterialSelectsType[]
}

interface MaterialGoodsPositionsType {
  PositionID: string,
  Number: number,
}
interface getMaterialDataType {
  MaterialID:string,
  SizeID:string,
  SKUCode:string,
}
interface inDeliveryFormType {
  MaterialID: string,
  UnitID: string,
  Number: number|null,
  InStockType: number,
  Handler: string,
  SupplierID: string,
  Price: number|null,
  Remark: string,
  MaterialGoodsPositions: MaterialGoodsPositionsType[],
}

interface GoodsPositionListType {
  PositionID: string,
  PositionName: number|string,
}
interface GoodsPositionItemType {
  PositionID: string,
  Number: number|string | null,
  PositionName: number|string,
  LocationName: number|string,
  selectedLocationID: number|string,
}
interface StorehouseType {
  StorehouseID: string,
  StorehouseName: string,
}
interface StorehouseGoodsPositionType {
  StorehouseName: string,
  StorehouseID: string,
  GoodsPositionList: GoodsPositionItemType[],
}
interface DataType {
  TypeID:string
  SizeSelects:null|number
  StorehouseID: string,
  SelectGoods: boolean,
  checkedMaterial:MaterialInfoType | null,
  getMaterialData:getMaterialDataType,
  inDeliveryForm: inDeliveryFormType,
  // 仓库列表
  StorehouseList:StorehouseType[]
  GoodsPositionList:GoodsPositionListType[]
  allSelectTempMaterial:MaterialDataItemType | null,
  itemSelectTempMaterial:MaterialSelectsType | null,
  inStorehouseGoodsPosition:StorehouseGoodsPositionType[]
}

export default {
  name: 'materialManagePage',
  components: {
    // MpCardContainer,
    OneLevelSelect,
    // TowLevelSelect,
    ThreeCascaderComp,
    InDeliveryDialog,
  },
  setup() {
    const router = useRouter();
    const ThreeCascaderComp:Ref = ref(null);
    const InDeliveryDialogRef:Ref = ref(null);
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    // 两位小数
    const reg = /(^[1-9]+\d*$)|(^[1-9]+\d*\.[0-9]{1}[1-9]{1}$)|(^[1-9]+\d*\.[1-9]{1}$)|(^0\.[1-9]{1}$)|(^0\.\d{1}[1-9]{1}$)/;
    const CommonStore = useCommonStore();
    // 选择仓库货位弹框的表单数据
    const selectStorehouseGoodsPosition = ref({});
    const Data:DataType = reactive({
      TypeID: '',
      SizeSelects: null,
      SelectGoods: false,
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 选择的物料
      checkedMaterial: null,
      // 下拉选择的临时物料
      allSelectTempMaterial: null,
      itemSelectTempMaterial: null,
      // 仓库列表
      StorehouseList: [],
      // 货位列表
      GoodsPositionList: [],

      inDeliveryForm: {
        MaterialID: '',
        UnitID: '',
        Number: null,
        InStockType: 1,
        Handler: '',
        SupplierID: '',
        Price: null,
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: '',
            Number: 10,
          },
        ],
      },
      // 入库数据表单
      inStorehouseGoodsPosition: [],
      StorehouseID: '',
    });
    const numberRules = (rule, value: number, callback: (ErrorConstructor?) => void) => {
      if (!value) {
        callback(new Error('请输入入库数量'));
      } else if (value && Number(value) > 999999.99) {
        callback(new Error('请输入小于1000000的入库数量'));
      } else if (value && !reg.test(String(value))) {
        callback(new Error('入库数量不能超过两位小数'));
      } else {
        callback();
      }
    };
    const priceRules = (rule, value: number, callback: (ErrorConstructor?) => void) => {
      if (!value) {
        callback(new Error('请输入单价'));
      } else if (value && Number(value) > 999999.99) {
        callback(new Error('请输入小于1000000的单价'));
      } else if (value && !reg.test(String(value))) {
        callback(new Error('单价不能超过两位小数'));
      } else {
        callback();
      }
    };

    const rules = reactive({
      Number: [
        { validator: numberRules, trigger: 'change' },
      ],
      Price: [
        { validator: priceRules, trigger: 'change' },
      ],
    });
    const SizeSelects = computed(() => {
      if (Data.itemSelectTempMaterial?.SizeSelects.length && !Data.itemSelectTempMaterial.SizeSelects[0].SizeDescribe) {
        return [];
      }
      // Data.itemSelectTempMaterial.SizeSelects
      return Data.itemSelectTempMaterial?.SizeSelects || [];
    });

    function clearFrom() {
      Data.inDeliveryForm = {
        MaterialID: '',
        UnitID: Data.inDeliveryForm.UnitID,
        Number: null,
        InStockType: 1,
        Handler: '',
        SupplierID: '',
        Price: null,
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: '',
            Number: 0,
          },
        ],
      };
      Data.inStorehouseGoodsPosition = [];
      selectStorehouseGoodsPosition.value = {};
    }
    // 格式化数据
    function SizeSelectChange(ID) {
      clearFrom();
      if (ID !== '00000000-0000-0000-0000-000000000000') {
        Data.SizeSelects = ID;
      }
      const SizeObj = Data.itemSelectTempMaterial?.SizeSelects.find(res => res.SizeID === ID);
      const temp = {
        MaterialID: SizeObj?.MaterialID,
        TypeID: Data.TypeID,
        Code: SizeObj?.Code,
        SizeDescribe: SizeObj?.SizeDescribe,
        MaterialAttributes: Data.itemSelectTempMaterial?.MaterialAttributes,
        StockUnit: Data.allSelectTempMaterial?.StockUnit,
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects.filter(res => res.UnitPurpose === 1),
        AttributeDescribe: Data.itemSelectTempMaterial?.AttributeDescribe,
      };
      Data.checkedMaterial = temp as MaterialInfoType;
      if (Data.checkedMaterial.UnitSelects.length) {
        Data.inDeliveryForm.UnitID = Data.checkedMaterial.UnitSelects[0].UnitID;
      }
      // Data.inDeliveryForm.UnitID = '';
      Data.getMaterialData.SKUCode = '';
      MaterialWarehouseStore.getSupplierSelectList(Data.checkedMaterial.TypeID);
    }
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial, TypeID) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = allSellectMaterial as MaterialDataItemType;
      Data.itemSelectTempMaterial = itemMaterial as MaterialSelectsType;
      Data.TypeID = TypeID;
      // Data.inDeliveryForm.UnitID = '';

      if (itemMaterial?.SizeSelects.length && !itemMaterial.SizeSelects[0].SizeDescribe) {
        SizeSelectChange(itemMaterial.SizeSelects[0].SizeID);
      }
    }
    // 获取转换为库存单位的数量;
    const getTransitionNum = computed(() => {
      let ratio;
      const temp = Data.checkedMaterial?.UnitSelects
        .find(res => res.UnitID === Data.inDeliveryForm.UnitID);
      if (temp) {
        ratio = temp.ProportionDown / temp.ProportionUp;
      } else {
        return 0;
      }
      return ratio * Number(Data.inDeliveryForm.Number);
    });
    // 获取仓库的入库总数量
    function getStorehouseInNumber(list) {
      let num = 0;
      list.forEach(it => {
        num += Number(it.Number);
      });
      return Math.floor(num * 100) / 100;
    }
    // 获取全部仓库的入库总数量
    function getStorehouseAllInNumber() {
      let num = 0;
      Data.inStorehouseGoodsPosition.forEach(res => {
        res.GoodsPositionList.forEach(it => {
          num += Number(it.Number);
        });
      });
      return Math.floor(num * 100) / 100;
    }
    // 获取转换为出入库单位的数量;
    const getInUnitNum = computed(() => {
      const num = getStorehouseAllInNumber();
      let ratio;
      const temp = Data.checkedMaterial?.UnitSelects
        .find(res => res.UnitID === Data.inDeliveryForm.UnitID);
      if (temp) {
        ratio = temp.ProportionDown / temp.ProportionUp;
      } else {
        return 0;
      }
      // return num / ratio;
      return Math.floor((num / ratio) * 100) / 100;
    });
    const inNumberRules = (rule, value: number, callback: (ErrorConstructor?) => void) => {
      if (!value) {
        callback(new Error('请输入入库数量'));
      } else if (value && Number(value) > getTransitionNum.value) {
        callback(new Error(`请小于${getTransitionNum.value}`));
      } else if (value && !reg.test(String(value))) {
        callback(new Error('不能超过两位小数'));
      } else {
        callback();
      }
    };

    const formRules = reactive({
      Number: [
        { validator: inNumberRules, trigger: 'change' },
      ],
    });
    function ToOutDelivery() {
      const routeData = router.resolve({
        name: 'outDelivery',
      });
      // let routeData = this.$router.resolve({
      //   name: "searchGoods",
      //   query: params,
      //   params:{ catId:params.catId }
      // });
      window.open(routeData.href, '_blank');
    }

    // 入库
    function inDelivery() {
      const getMsgs = () => {
        const Msgs:string[] = [];
        Data.inStorehouseGoodsPosition.forEach(item => {
          item.GoodsPositionList.forEach(it => {
            if (!it.Number) {
              Msgs.push(`${item.StorehouseName} ${it.LocationName} ${it.PositionName}`);
            }
          });
        });
        return Msgs;
      };
      if (!Data.checkedMaterial?.MaterialID) {
        messageBox.failSingleError('入库失败', '请选择物料', () => null, () => null);
      } else if (!Data.inDeliveryForm.Number) {
        messageBox.failSingleError('入库失败', '请输入入库数量', () => null, () => null);
      } else if (Data.inDeliveryForm.Number < 0) {
        messageBox.failSingleError('入库失败', '入库数量请输入正数', () => null, () => null);
      } else if (Data.inDeliveryForm.Number > 999999.99) {
        messageBox.failSingleError('入库失败', '请输入小于1000000的入库数量', () => null, () => null);
      } else if (!reg.test(String(Data.inDeliveryForm.Number))) {
        messageBox.failSingleError('入库失败', '入库数量不能超过两位小数', () => null, () => null);
      } else if (!Data.inDeliveryForm.UnitID) {
        messageBox.failSingleError('入库失败', '请选择入库单位', () => null, () => null);
      } else if ((Data.inDeliveryForm.InStockType === 1 || Data.inDeliveryForm.InStockType === 3) && !Data.inDeliveryForm.SupplierID) {
        messageBox.failSingleError('入库失败', '请选择供应商', () => null, () => null);
      } else if (Data.inDeliveryForm.InStockType === 1 && !Data.inDeliveryForm.Price) {
        messageBox.failSingleError('入库失败', '请输入单价', () => null, () => null);
      } else if (Data.inDeliveryForm.InStockType === 1 && !reg.test(String(Data.inDeliveryForm.Price))) {
        messageBox.failSingleError('入库失败', '单价不能超过两位小数', () => null, () => null);
      } else if ((Data.inDeliveryForm.InStockType === 2 || Data.inDeliveryForm.InStockType === 4) && !Data.inDeliveryForm.Handler) {
        messageBox.failSingleError('入库失败', '请选择退料人', () => null, () => null);
      } else if (getMsgs().length) {
        messageBox.failSingleError('入库失败', `请输入${getMsgs().join('、')}的入库数量`, () => null, () => null);
      } else if (Number(Data.inDeliveryForm.Number) !== Number(getInUnitNum.value)) {
        messageBox.failSingleError('入库失败', '入库数量与合计入库数量不一致', () => null, () => null);
      } else {
        if (Data.checkedMaterial) {
          Data.inDeliveryForm.MaterialID = Data.checkedMaterial.MaterialID;
        }
        const temp:GoodsPositionItemType[] = [];
        Data.inStorehouseGoodsPosition.forEach(item => {
          temp.push(...item.GoodsPositionList);
        });
        Data.inDeliveryForm.MaterialGoodsPositions = temp as MaterialGoodsPositionsType[];
        api.getStockIn(Data.inDeliveryForm).then(res => {
          if (res?.data?.Status === 1000) {
            // InDeliveryDialogRef.value.clearselectStorehouseGoodsPosition();
            messageBox.successSingle('入库成功', () => {
              clearFrom();
            }, () => {
              clearFrom();
            });
          }
        });
      }
    }
    function getGoodsPositionList() {
      api.getGoodsPositionList({ StorehouseID: Data.StorehouseID }).then(res => {
        if (res?.data?.Status === 1000) {
          Data.GoodsPositionList = res.data.Data as GoodsPositionListType[];
        }
      });
    }
    // 出入库单位名;
    const inUnitName = computed(() => {
      const { UnitID } = Data.inDeliveryForm;
      const temp = Data.checkedMaterial?.UnitSelects.find(res => res.UnitID === UnitID);
      if (temp) return temp.Unit;
      return '';
    });
    function SelectGoodsCloseClick() {
      Data.SelectGoods = false;
    }
    function SelectGoodsClosed() {
      // 清空表单
    }
    function SelectGoodsPrimaryClick(_selectStorehouseGoodsPosition) {
      Object.keys(_selectStorehouseGoodsPosition).forEach(res => {
        selectStorehouseGoodsPosition.value[res] = { ..._selectStorehouseGoodsPosition[res] };
      });

      const StorehouseKeys = Object.keys(selectStorehouseGoodsPosition.value);
      StorehouseKeys.forEach(StorehouseKey => {
        if (selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation) {
          const selectedLocationKeys = Object.keys(selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation);

          const list:GoodsPositionItemType[] = [];
          selectedLocationKeys.forEach(selectedLocationKey => {
            if (selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation[selectedLocationKey].length) {
              list.push(...selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation[selectedLocationKey]);
            }
          });
          // 是否已经有这个仓库
          const haveStorehouse = Data.inStorehouseGoodsPosition
            .find(StorehouseIt => StorehouseIt.StorehouseID === StorehouseKey);
          // 如果有了就添加货位
          if (haveStorehouse) { // haveStorehouse已经有的仓库
          // 查找新选择的货位
            selectedLocationKeys.forEach(selectedLocationKey => {
              if (selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation[selectedLocationKey]) {
                const noHave = selectStorehouseGoodsPosition.value[StorehouseKey].selectedLocation[selectedLocationKey]
                  .filter(actionIt => !haveStorehouse.GoodsPositionList
                    .find(PositionIt => PositionIt.PositionID === actionIt.PositionID));
                // 把没有的货位添加上去
                noHave.forEach(noHaveIt => {
                  haveStorehouse.GoodsPositionList.push({
                    PositionID: noHaveIt.PositionID,
                    Number: null,
                    PositionName: noHaveIt.PositionName,
                    LocationName: noHaveIt.LocationName,
                    selectedLocationID: noHaveIt.selectedLocationID,
                  });
                });
                // list.push(...);
              }
            });
          // 如果没有就添加仓库和货位
          } else if (list.length) {
            const Storehouse = Data.StorehouseList.find(it => it.StorehouseID === StorehouseKey);
            Data.inStorehouseGoodsPosition.push({
              StorehouseName: Storehouse?.StorehouseName || '',
              StorehouseID: Storehouse?.StorehouseID || '',
              GoodsPositionList: list.map(it => ({
                PositionID: it.PositionID,
                Number: null,
                PositionName: it.PositionName,
                LocationName: it.LocationName,
                selectedLocationID: it.selectedLocationID,
              })),
            });
          }
        }

        // }
      });
      if (Data.inStorehouseGoodsPosition.length === 1
      && Data.inStorehouseGoodsPosition[0].GoodsPositionList.length === 1
      && !Data.inStorehouseGoodsPosition[0].GoodsPositionList[0].Number) {
        Data.inStorehouseGoodsPosition[0].GoodsPositionList[0].Number = getTransitionNum.value;
      }
      SelectGoodsCloseClick();
      // 入库
    }
    function delGoodsPosition(index, i, StorehouseID, selectedLocationID) {
      // 删除货位选择 StorehouseID
      selectStorehouseGoodsPosition.value[StorehouseID]
        .selectedLocation[selectedLocationID] = selectStorehouseGoodsPosition.value[StorehouseID]
          .selectedLocation[selectedLocationID]
          .filter(res => res.PositionID !== Data.inStorehouseGoodsPosition[index]
            .GoodsPositionList[i].PositionID);

      if (Data.inStorehouseGoodsPosition[index].GoodsPositionList.length > 1) {
        // 删除表单输入项
        Data.inStorehouseGoodsPosition[index].GoodsPositionList.splice(i, 1);
      } else {
        Data.inStorehouseGoodsPosition.splice(index, 1);
      }
    }
    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
        return;
      }
      // 物料筛选
      api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
        if (res?.data?.Data) {
          Data.checkedMaterial = res.data.Data as MaterialInfoType;
          // Data.inDeliveryForm.UnitID = '';
          Data.checkedMaterial.UnitSelects = Data.checkedMaterial.UnitSelects
            .filter(it => it.UnitPurpose === 1);
          if (Data.checkedMaterial.UnitSelects.length) {
            Data.inDeliveryForm.UnitID = Data.checkedMaterial.UnitSelects[0].UnitID;
          }
          ThreeCascaderComp.value.reset();
          MaterialWarehouseStore.getSupplierSelectList(Data.checkedMaterial.TypeID);
          clearFrom();
        } else {
          messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
        }
      });
    }
    // 获取仓库列表
    function getStorehouseAll() {
      api.getStorehouseAll().then(res => {
        if (res?.data?.Status === 1000) {
          Data.StorehouseList = res.data.Data as StorehouseType[];
        }
      });
    }

    onMounted(() => {
      // 获取所有物料类型
      // MaterialWarehouseStore.getMaterialTypeAll(newValue as number);

      MaterialWarehouseStore.getMaterialManageList({});
      if (!CommonStore.StaffSelectList.length) {
        CommonStore.getStaffSelect();
      }
      getStorehouseAll();
    });

    return {
      formRules,
      inNumberRules,
      rules,
      InDeliveryDialogRef,
      SizeSelects,
      Data,
      ThreeCascaderComp,
      CommonStore,
      getTransitionNum,
      getInUnitNum,
      inUnitName,
      delGoodsPosition,
      getMaterial,
      ToOutDelivery,
      ThreeCascaderCompChange,
      SizeSelectChange,
      MaterialWarehouseStore,
      SelectGoodsCloseClick,
      inDelivery,
      SelectGoodsClosed,
      SelectGoodsPrimaryClick,
      getGoodsPositionList,
      selectStorehouseGoodsPosition,
      getStorehouseInNumber,
      getStorehouseAllInNumber,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-layout-page-content-comp-wrap{
  margin: 0;
  // background-color: #F5F5F5;
  // padding: 50px;
  height: 100%;
  max-height: 100%;
  >div{
    margin: 0;
  }
}
.in-delivery-page{
  height: 100%;
  margin: 0;
  overflow-x: auto;
  background-color: #fff;
  main{
    >p{
      color: #fff;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      line-height: 60px;
      background-color: #222B3A;
    }
      min-width: 1340px;
      height: calc(100%);
      background-color: #fff;
      // border-radius: 8px;
      // padding: 20px;
      box-sizing: border-box;
      overflow-x: auto;
      .el-scrollbar{
        height: calc(100% - 60px);
      }
      .el-scrollbar__view{
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .delivery-info{
        flex: 1;
        display: flex;
        justify-content: center;
        min-height: 480px;
        padding: 40px 24px 0 40px;
        box-sizing: border-box;
        .el-input-number{
          height: 40px;
          .el-input{
            height: 40px;
          }
        }
        .el-select{
          height: 40px;
          .el-input{
            height: 40px;
          }
        }
        >div{
          width: 855px;
          // min-width: 855px;
          &.line{
            min-width: 1px;
            width: 1px;
            height: 100%;
            margin: 0 36px;
            background-color: #A6B6C6;
          }
        }
        .left{
          min-width: 740px;
          .el-form{
            font-size: 20px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #7A8B9C;
            .el-form-item{
              color: #444444;
              .el-form-item__label{
                font-size: 14px;
                color: #C7C7C7;
              }
              .el-form-item__content{
                font-size: 16px;
              }
              .el-input{
                font-weight: 300;
                font-size: 18px;
                .el-input__inner{
                  color: #444444;
                  &::placeholder{
                    color: #A8A8A8;
                  }
                }
              }
              .el-radio-group{
                .el-radio-button{
                  width: 147px;
                  .el-radio-button__inner{
                    background-color: #F5F5F5;
                    width: 100%;
                    color: #000;
                    box-shadow: none;
                  }
                  &.is-active{
                    .el-radio-button__inner{
                      border-color: #222B3A;
                      background-color:#222B3A;
                      color: #fff;
                    }
                  }
                }
              }
              &.sku{
                margin-bottom: 0;
                .el-form-item__content{
                  flex-direction: column;
                  align-items: flex-start;
                  font-size: 20px;
                  >p{
                    display: flex;
                    .el-input{
                      width: 476px;
                      // margin-right: 20px;
                      font-size: 18px;
                      .el-input-group__append{
                        background-color: #26BCF9;
                        margin-left: -2px;
                      }
                    }
                    .el-button{
                      font-size: 20px;
                      font-weight: 400;
                      width: 109px;
                      color: #fff;
                    }
                  }
                  >span{
                    margin: 10px 0;
                  }
                }
              }
              &.select-material{
                .el-cascader{
                  width: 367px;
                  height: 40px;
                  margin-right: 17px;
                }
                .el-input{
                  height: 40px;
                  font-size: 18px;
                }
              }
              &.in-number{
                .number{
                  width: 200px;
                  height: 40px;
                  input{
                    text-align: left;
                  }
                }
                .mp-one-level-select{
                  margin: 0 20px;
                }
              }
              &.supplier{
                >.el-form-item__content{
                  .el-form-item__label{
                    color: #444444;
                  }
                  .price-number{
                    width: 136px;
                    margin-right: 20px;
                    input{
                      text-align: left;
                      color: #f00;
                      font-weight: 700;
                      &::placeholder{
                          color: #A8A8A8;
                          font-weight: 300;
                        }
                    }
                  }
                }
              }
              &.remark{
                .el-input{
                  width: 533px;
                  margin-right: 20px;
                }
              }
            }
            >.material-info{
              align-items: center;
              margin-bottom: 18px;
              padding-left: 82px;
              // display: flex;
              flex-wrap: wrap;
              min-height: 80px;
              line-height: 40px;
              font-size: 22px;
              color: #444444;
              span{
                margin-right: 15px;
              }
            }
          }
        }
        .right{
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 502px;
          >.el-button{
            width: 120px;
            height: 40px;
            img{
              width: 16px;
              height: 16px;
              margin-right: 4px;
              margin-top: 1px;
            }
          }
          .warehouse{
            // height: calc(100% - 37px);
            overflow-x: auto;
            flex: 1;
            padding-top: 10px;
            .el-scrollbar__wrap{
              padding-right: 10px;
            }
            .warehouse-item{
              .title{
                font-size: 16px;
                font-weight: 400;
                line-height: 17px;
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 0 10px;
                margin-top: 10px;
                span{
                  color: #566176;
                }
              }
                &.warehouse-item + .warehouse-item {
                  .title{
                    margin-top: 20px;
                  }
                }
              ul{
                border: 1px solid #A6B6C6;
                border-radius: 8px;
                padding: 0 20px;
                li{
                  display: flex;
                  border-bottom: 1px solid #F2F6FC;
                  height: 70px;
                  align-items: center;
                  text-align: center;
                  justify-content: space-between;
                  font-size: 16px;
                  &li:last-child{
                    display: flex;
                    border-bottom: none;
                    height: 70px;
                  }
                  .ranks{
                    width: 180px;
                  }
                  .number{
                    width: 200px;
                    align-items: center;
                    display: flex;
                    >span{
                      align-items: center;
                      display: flex;
                      .el-input{
                        width: 100px;
                        input{
                          text-align: left;
                        }
                      }
                    }
                  }
                  .el-button{
                    width: 80px;
                    height: 34px;
                    // margin: 0 20px;
                  }
                }
              }
            }
          }
          .total{
            font-size: 20px;
            font-weight: 400;
            line-height: 17px;
            margin-top: 20px;
            padding: 0 10px;
          }
        }
      }
      .btn{
        padding: 80px;
        padding-bottom: 60px;
        text-align: center;
        .el-button{
          width: 200px;
          height: 60px;
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: #F9FCFF;
          line-height: 17px;
        }
      }
  }
}
</style>
