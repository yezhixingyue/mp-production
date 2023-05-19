<template>
  <div class="out-delivery-page">
    <main>
      <p>出库信息</p>
      <!-- <MpCardContainer> -->
        <el-scrollbar>
          <div class="delivery-info">
            <div class="left">
              <el-form label-width="84px">
                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input size="large" @keyup.enter="getMaterial()"
                    placeholder="请输入完整SKU编码，包括尺寸编码"
                     v-model.trim="Data.getMaterialData.SKUCode">
                     <template #append>
                        <mp-button link type="primary" @click="getMaterial()">
                          <el-icon><Search /></el-icon>
                          查询</mp-button>
                      </template>
                     </el-input>
                    <!-- <mp-button link type="primary" @click="getMaterial()">查询</mp-button> -->
                  </p>
                  <span style="color: #C7C7C7;">或者</span>
                </el-form-item>
                <el-form-item :label="`选择物料：`" class="select-material">
                  <!-- <el-cascader :props="props" /> -->
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
                <el-form-item :label="`出库数量：`" class="out-number">
                  <el-input-number size="large"
                  :max="999999" placeholder="请输入出库数量"
                  :controls="false" v-model="Data.outDeliveryForm.Number" />
                  <OneLevelSelect
                    v-if="Data.checkedMaterial"
                    :options='Data.checkedMaterial.UnitSelects'
                    :defaultProps="{
                      value:'UnitID',
                      label:'Unit',
                    }"
                    :value='Data.outDeliveryForm.UnitID'
                    @change="(ID) => Data.outDeliveryForm.UnitID = ID"
                    :width="100"
                    :filterable='true'
                    :placeholder="'请选择单位'"
                    ></OneLevelSelect>
                    <template v-if="Data.checkedMaterial">
                      {{getTransitionNum}}
                      {{Data.checkedMaterial?.StockUnit}}
                    </template>
                </el-form-item>
                <el-form-item :label="`出库类型：`">

                  <el-radio-group v-model="Data.outDeliveryForm.OutStockType">
                    <el-radio-button :label="51">领料</el-radio-button>
                    <el-radio-button :label="52">补料</el-radio-button>
                    <el-radio-button :label="53">无订单领料</el-radio-button>
                    <el-radio-button :label="54">销售</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="`领取人：`">
                  <OneLevelSelect
                    :options='CommonStore.StaffSelectList'
                    :defaultProps="{
                      value:'StaffID',
                      label:'StaffName',
                    }"
                    :value='Data.outDeliveryForm.Handler'
                    @change="(ID) => Data.outDeliveryForm.Handler = ID"
                    :width="300"
                    :filterable='true'
                    :placeholder="'请选择领料人'"
                    ></OneLevelSelect>
                </el-form-item>
                <el-form-item :label="`备注：`" class="remark">
                  <el-input :maxlength="300" placeholder="请输入备注" size="large" v-model="Data.outDeliveryForm.Remark" /> (选填)
                </el-form-item>
              </el-form>

            </div>
            <div class="line"></div>
            <div class="right">
                <div class="warehouse">
              <el-scrollbar>
                  <div class="warehouse-item"
                  v-for="Storehouse in Data.StorehouseStockInfo" :key="Storehouse.StorehouseID">
                    <p class="title">
                      <span>
                        <span class="StorehouseName">
                          {{Storehouse.StorehouseName}}
                        </span>：{{getStorehouseAllNumber(Storehouse)}}{{Data.checkedMaterial?.StockUnit}}
                      </span>
                      <span>
                        出库：{{getStorehouseOutNumber(Storehouse)}}{{Data.checkedMaterial?.StockUnit}}
                      </span>
                      <span>
                        <mp-button link type="primary"
                        @click="SeeImg(Storehouse.StorehouseImg)">查看平面布局图</mp-button>
                      </span>
                    </p>
                    <ul>
                      <li v-for="GoodsPosition in Storehouse.GoodsPositionStockInfos"
                      :key="GoodsPosition.PositionID">
                        <span class="ranks">
                          {{GoodsPosition.UpperDimension}}
                          {{GoodsPosition.PositionName}}
                          <!-- A区 001柜 3行 2列 -->
                        </span>
                        <span class="PCS">
                          {{GoodsPosition.Number}}{{Data.checkedMaterial?.StockUnit}}
                        </span>
                        <span class="number">
                          <el-checkbox v-model="GoodsPosition.checked" label="出库" size="large" />
                          <div v-if="GoodsPosition.checked"><el-input-number :max="999999"
                          :controls="false" v-model="GoodsPosition.inputValue"></el-input-number>
                            <span class="unit">
                              {{Data.checkedMaterial?.StockUnit}}
                            </span>
                          </div>
                        </span>
                        <mp-button type="text" @click="seePosition(Storehouse,GoodsPosition)">位置</mp-button>
                      </li>
                    </ul>
                  </div>
              </el-scrollbar>
                </div>
              <p class="total" v-if="Data.StorehouseStockInfo.length">
                合计：{{getStorehouseAllOutNumber()}}
                {{Data.checkedMaterial?.StockUnit}}
                （{{getOutUnitNum}} {{outUnitName}}）</p>
            </div>
          </div>
          <div class="btn">
            <mp-button type="primary" @click="outDelvery">出库</mp-button>
          </div>
        </el-scrollbar>
      <!-- </MpCardContainer> -->
    </main>
    <!-- 出库确认 -->
    <DialogContainerComp
    title="出库确认"
    :visible='Data.outVerify'
    :primaryClick="outVerifyPrimaryClick"
    :closeClick="() => Data.outVerify = false"
    :primaryText="'打印并出库'"
    :closeBtnText="'取消出库'"
    :width="600"
    >
    <template #default>
      <div class="out-verify-dialog" id="print">
        <div class="material-info" style="padding:0 20px;display: flex;color:#566176;display: flex;">
          <div style="display: flex;flex-wrap: wrap;width:120px">
            <div>
              <img style="width:120px;height:120px" src="https://img-blog.csdnimg.cn/a2830dd85a9e4cc990b3fd999bf323a7.png" alt="">
            </div>
            <span>ID:</span>
          </div>
          <div class="material"
          style="line-height: 32px;margin-left:50px;font-size:16px;font-weight: 600;padding-top:10px">
            <p style="display: flex;text-align: right;"><span style="width:70px;color:#7A8B9C;">SKU：</span>
              <span style="">{{Data.checkedMaterial?.Code}}</span></p>
            <p style="display: flex;text-align: right;"><span style="width:70px;color:#7A8B9C;">物料：</span>
              <span style="">
                {{Data.checkedMaterial?.AttributeDescribe}}
                      <!-- <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
                      :key="item.AttributeID">
                        <template v-if="item.NumericValue">
                          <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                        </template>
                        <template v-else>
                          <span>{{item.InputSelectValue || item.SelectValue}}</span>
                        </template>
                        <template
                        v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                          {{index === Data.checkedMaterial.MaterialAttributes.length-1 ? '' : ' ' }}
                        </template>
                      </template> -->
              </span>
            </p>
            <p style="display: flex;text-align: right;"><span style="width:70px;color:#7A8B9C;"></span>
              <span style="">{{Data.checkedMaterial?.SizeDescribe}}</span></p>
            <p style="color:#7a8b9c;margin-top:10px">
              出库数量：{{getStorehouseAllOutNumber()}}
                {{Data.checkedMaterial?.StockUnit}}
                （{{getOutUnitNum}} {{outUnitName}}）
            </p>
          </div>
        </div>
        <div style="border-top: 1px dashed #A6B6C6;height:1px;margin:40px 0"></div>
        <div class="storehouse-stock" style="display: flex;padding:0 20px">
          <div style="display: flex;flex-wrap: wrap;width:156px;">
            <div>
              <img style="width:156px;height:156px" src="https://img-blog.csdnimg.cn/a2830dd85a9e4cc990b3fd999bf323a7.png" alt="">
            </div>
            <span>ID:</span>
          </div>
          <div style="display: flex;flex-direction: column;flex:1">

            <div style="line-height: 32px;margin-left:50px;font-size:16px;font-weight: 600;">
              <p style="display: flex;text-align: right;"><span style="color:#7A8B9C;">领料人：</span>
                <span style="">{{getReceiptorName}}</span></p>
              <p style="display: flex;text-align: right;">
                <span style="">名片生产线  印刷机 CD102  3号机</span></p>
            </div>
            <div style="padding-left:40px;margin:5px 0">
              <p style="color:#7A8B9C;">出库位置：</p>
              <ul :style="`border: 1px solid #A6B6C6;border-radius: 8px;padding:0 18px;color:#566176`">
                <template v-for="Storehouse in Data.StorehouseStockInfo" :key="Storehouse.StorehouseID">
                  <template v-for="GoodsPosition in Storehouse.GoodsPositionStockInfos" :key="GoodsPosition.PositionID">

                    <li v-if="GoodsPosition.checked"
                      style="line-height: 45px;border-bottom:1px solid #F2F6FC;display: flex;justify-content: space-between;">
                      <span style="width:33.33%;text-align:center;">{{Storehouse.StorehouseName}}</span>
                      <span style="width:33.33%;text-align:center;">{{GoodsPosition.UpperDimension}} {{GoodsPosition.PositionName}}</span>
                      <span style="width:33.33%;text-align:center;">{{GoodsPosition.inputValue}}{{Data.checkedMaterial?.StockUnit}}</span>
                    </li>
                  </template>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <el-button v-print="print" v-show="false" ref="printBtn">打印</el-button>
    </template>
    </DialogContainerComp>
    <SeeImageDialogComp
    title="仓库货位平面图"
    :visible='Data.SeeImageShow'
    :imgUrl="Data.SeeImageUrl"
    :closeClick="() => Data.SeeImageShow = false"
    >
    </SeeImageDialogComp>

    <OutDeliveryDialog
    :visible='Data.seePositionShow'
    :changeVisible="(visible) => Data.seePositionShow = visible"
    :currentMaterialID="Data.checkedMaterial?.MaterialID"
    :getGoodsPositionData="Data.getGoodsPositionData"
    >
    </OutDeliveryDialog>
  </div>
</template>

<script lang='ts'>

import OutDeliveryDialog from '@/components/materialInventoryManage/outDeliveryDialog.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import {
  ref, Ref, reactive, onMounted, computed,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouter, useRoute } from 'vue-router';
import { MaterialInfoType } from '@/assets/Types/common';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';

interface MaterialGoodsPositionsType {
  PositionID: string,
  Number: number,
}
interface getMaterialDataType {
  MaterialID:string,
  SizeID:string,
  SKUCode:string,
}
interface outDeliveryFormType {
  MaterialID: string,
  Number: number|null,
  UnitID: string,
  OutStockType: number,
  Handler: string,
  Remark: string,
  MaterialGoodsPositions: MaterialGoodsPositionsType[],
}
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
interface GoodsPositionStockInfosType {
  StorehouseID: string,
  PositionName: string,
  PositionID: string,
  Number: number | string,
  checked: boolean,
  inputValue:string,
  UpperDimension: string
}
interface StorehouseStockInfoType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}

export interface DimensionDataType {
  PositionID: string,
  DetailID: string,
  LeftTopX: number,
  LeftTopY: number,
  DimensionX: string,
  DimensionY: string
}
export interface DyadicArrayDimensionDataType {
  DimensionX: string,
  DimensionY: string
  xNum: number,
  yNum: number
}

interface getGoodsPositionDataType {
  StorehouseID:string
  DimensionIDS: Array<string>
  StorehouseGoodsPosition:string
}

interface DataType {
  TypeID:string
  SizeSelects:null|number
  outVerify:boolean,
  SeeImageShow:boolean,
  SeeImageUrl:string,
  checkedMaterial:MaterialInfoType | null,
  getMaterialData:getMaterialDataType,
  outDeliveryForm: outDeliveryFormType,
  StorehouseStockInfo: StorehouseStockInfoType[],
  allSelectTempMaterial:MaterialDataItemType | null,
  itemSelectTempMaterial:MaterialSelectsType | null,
  seePositionShow:boolean

  getGoodsPositionData:getGoodsPositionDataType
}

export default {
  name: 'materialManagePage',
  components: {
    // MpCardContainer,
    OneLevelSelect,
    ThreeCascaderComp,
    SeeImageDialogComp,
    DialogContainerComp,
    OutDeliveryDialog,
  },
  setup() {
    const print = ref({
      id: 'print',
      preview: false,
    });
    const printBtn:Ref = ref(null);
    const ThreeCascaderComp:Ref = ref(null);
    // const h = ref(0);
    const router = useRouter();
    const route = useRoute();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const CommonStore = useCommonStore();
    const Data:DataType = reactive({
      TypeID: '',
      SizeSelects: null,
      SeeImageShow: false,
      seePositionShow: false,
      outVerify: false,
      SeeImageUrl: '',
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
      outDeliveryForm: {
        MaterialID: '',
        Number: null,
        UnitID: '',
        OutStockType: 51,
        Handler: '',
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: '',
            Number: 0,
          },
        ],
      },
      StorehouseStockInfo: [],

      getGoodsPositionData: {
        StorehouseID: '',
        DimensionIDS: [],
        StorehouseGoodsPosition: '',
      },

    });
    const getReceiptorName = computed(() => {
      const staff = CommonStore.StaffSelectList.find(res => res.StaffID === Data.outDeliveryForm.Handler);
      return staff?.StaffName || '';
    });
    const SizeSelects = computed(() => {
      if (Data.itemSelectTempMaterial?.SizeSelects.length && !Data.itemSelectTempMaterial.SizeSelects[0].SizeDescribe) {
        return [];
      }
      // Data.itemSelectTempMaterial.SizeSelects
      return Data.itemSelectTempMaterial?.SizeSelects || [];
    });
    function clearFrom() {
      Data.outDeliveryForm = {
        MaterialID: '',
        Number: null,
        UnitID: '',
        OutStockType: 51,
        Handler: '',
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: '',
            Number: 0,
          },
        ],
      };
    }
    // 获取物料货位数据信息
    function GetGoodsAllocation(MaterialID) {
      api.getStorehouseStock(MaterialID).then(res => {
        if (res.data.Status === 1000) {
          const temp = [...res.data.Data as StorehouseStockInfoType[]];
          temp.map(StorehouseIt => {
            const _StorehouseIt = StorehouseIt.GoodsPositionStockInfos.map(Positionit => ({
              // checked: false,
              // inputValue: '',
              ...Positionit,
            }));
            return _StorehouseIt;
          });
          Data.StorehouseStockInfo = [];
          setTimeout(() => {
            Data.StorehouseStockInfo = temp;
          }, 20);
        }
      });
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
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects.filter(res => res.UnitPurpose === 2),
        AttributeDescribe: Data.itemSelectTempMaterial?.AttributeDescribe,
      };
      Data.checkedMaterial = temp as MaterialInfoType;
      Data.outDeliveryForm.UnitID = '';
      Data.getMaterialData.SKUCode = '';
      GetGoodsAllocation(Data.checkedMaterial.MaterialID);
    }
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial, TypeID) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = allSellectMaterial as MaterialDataItemType;
      Data.itemSelectTempMaterial = itemMaterial as MaterialSelectsType;
      Data.TypeID = TypeID;
      Data.outDeliveryForm.UnitID = '';

      if (itemMaterial?.SizeSelects.length && !itemMaterial.SizeSelects[0].SizeDescribe) {
        SizeSelectChange(itemMaterial.SizeSelects[0].SizeID);
      }
    }
    // 获取转换为库存单位的数量;
    const getTransitionNum = computed(() => {
      let ratio;
      const temp = Data.checkedMaterial?.UnitSelects
        .find(res => res.UnitID === Data.outDeliveryForm.UnitID);
      if (temp) {
        ratio = temp.ProportionDown / temp.ProportionUp;
      } else {
        return 0;
      }
      return ratio * Number(Data.outDeliveryForm.Number);
    });

    // 获取仓库的出库总数量
    function getStorehouseOutNumber(list) {
      let num = 0;
      list.GoodsPositionStockInfos.forEach(it => {
        if (it.checked) {
          num += Number(it.inputValue) || 0;
        }
      });
      return num;
    }
    // 获取仓库的出库总数量
    function getStorehouseAllNumber(list) {
      let num = 0;
      list.GoodsPositionStockInfos.forEach(it => {
        num += Number(it.Number) || 0;
      });
      return num;
    }
    // 获取全部仓库的出库总数量
    function getStorehouseAllOutNumber() {
      let num = 0;
      Data.StorehouseStockInfo.forEach(res => {
        res.GoodsPositionStockInfos.forEach(it => {
          if (it.checked) {
            num += Number(it.inputValue) || 0;
          }
        });
      });
      return num;
    }
    // 获取转换为出入库单位的数量;
    const getOutUnitNum = computed(() => {
      const num = getStorehouseAllOutNumber();
      let ratio;
      const temp = Data.checkedMaterial?.UnitSelects
        .find(res => res.UnitID === Data.outDeliveryForm.UnitID);
      if (temp) {
        ratio = temp.ProportionDown / temp.ProportionUp;
      } else {
        return 0;
      }
      return num / ratio;
    });
    // 出入库单位名;
    const outUnitName = computed(() => {
      const { UnitID } = Data.outDeliveryForm;
      const temp = Data.checkedMaterial?.UnitSelects.find(res => res.UnitID === UnitID);
      if (temp) return temp.Unit;
      return '';
    });
    function SeeImg(url) {
      Data.SeeImageShow = true;
      Data.SeeImageUrl = url;
    }
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

    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      Data.getMaterialData.MaterialID = level1Val;
      Data.getMaterialData.SizeID = level2Val;
    }

    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
        return;
      }
      // 物料筛选
      api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
        if (res.data.Data) {
          Data.checkedMaterial = res.data.Data as MaterialInfoType;
          Data.outDeliveryForm.UnitID = '';
          Data.checkedMaterial.UnitSelects = Data.checkedMaterial.UnitSelects
            .filter(it => it.UnitPurpose === 2);
          GetGoodsAllocation(Data.checkedMaterial.MaterialID);
          ThreeCascaderComp.value.reset();
          clearFrom();
        } else {
          messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
        }
      });
    }
    function outVerifyPrimaryClick() {
      api.getStockOut(Data.outDeliveryForm).then(res => {
        if (res.data.Status === 1000) {
          Data.outVerify = false;
          const cb = () => {
            Data.StorehouseStockInfo = [];
            GetGoodsAllocation(Data.checkedMaterial?.MaterialID);
            clearFrom();
            printBtn.value.ref.click();
          };
          messageBox.successSingle('出库成功', cb, cb);
        }
      });
    }
    function outDelvery() {
      // 两位小数
      const reg = /(^[1-9]+\d*$)|(^[1-9]+\d*\.[0-9]{1}[1-9]{1}$)|(^[1-9]+\d*\.[1-9]{1}$)|(^0\.[1-9]{1}$)|(^0\.\d{1}[1-9]{1}$)/;
      const inventory = () => {
        const inventoryMsgs:string[] = [];
        Data.StorehouseStockInfo.forEach(item => {
          item.GoodsPositionStockInfos.forEach(it => {
            if (it.checked && Number(it.inputValue) > Number(it.Number)) {
              inventoryMsgs.push(`${item.StorehouseName} ${it.UpperDimension} ${it.PositionName}`);
            }
          });
        });
        return inventoryMsgs;
      };
      if (!Data.checkedMaterial?.MaterialID) {
        messageBox.failSingleError('出库失败', '请选择物料', () => null, () => null);
      } else if (!Data.outDeliveryForm.Number) {
        messageBox.failSingleError('出库失败', '请输入出库数量', () => null, () => null);
      } else if (!reg.test(String(Data.outDeliveryForm.Number))) {
        messageBox.failSingleError('出库失败', '出库数量不能超过两位小数', () => null, () => null);
      } else if (!Data.outDeliveryForm.UnitID) {
        messageBox.failSingleError('出库失败', '请选择出库单位', () => null, () => null);
      } else if (!Data.outDeliveryForm.Handler) {
        messageBox.failSingleError('出库失败', '请选择领取人', () => null, () => null);
      } else if (Number(Data.outDeliveryForm.Number) !== Number(getOutUnitNum.value)) {
        messageBox.failSingleError('出库失败', '出库数量与合计出库数量不一致', () => null, () => null);
      } else if (inventory().length) {
        messageBox.failSingleError('出库失败', `货位 ${inventory().join('、')} 出库数量大于库存数量`, () => null, () => null);
      } else {
      // 设置物料id
        Data.outDeliveryForm.MaterialID = Data.checkedMaterial.MaterialID;
        const temp: MaterialGoodsPositionsType[] = [];
        Data.StorehouseStockInfo.forEach(StorehouseIt => {
          StorehouseIt.GoodsPositionStockInfos.forEach(PositionIt => {
            if (PositionIt.checked) {
              temp.push({
                PositionID: PositionIt.PositionID as string,
                Number: Number(PositionIt.inputValue),
              });
            }
          });
        });
        Data.outDeliveryForm.MaterialGoodsPositions = temp;
        // 设置出库货位及数量
        Data.outVerify = true;
      }
    }

    // 查看物料货位
    function seePosition(Storehouse, GoodsPosition) {
      Data.getGoodsPositionData.StorehouseID = Storehouse.StorehouseID;
      Data.getGoodsPositionData.DimensionIDS = GoodsPosition.UpperDimensionIDS.split(',');
      Data.getGoodsPositionData.StorehouseGoodsPosition = `${Storehouse.StorehouseName} ${GoodsPosition.UpperDimension} ${GoodsPosition.PositionName}`;
      Data.seePositionShow = true;
    }

    onMounted(() => {
      const MaterialCode = JSON.parse(route.query.MaterialCode as string);
      if (MaterialCode) {
        Data.getMaterialData.SKUCode = MaterialCode;
        getMaterial();
      }

      MaterialWarehouseStore.getMaterialManageList({});
      if (!CommonStore.StaffSelectList.length) {
        CommonStore.getStaffSelect();
      }
    });

    return {
      SizeSelects,
      print,
      printBtn,
      Data,
      SeeImg,
      ThreeCascaderComp,
      getReceiptorName,
      CommonStore,
      getTransitionNum,
      getOutUnitNum,
      outUnitName,
      seePosition,
      getMaterial,
      ToOutDelivery,
      outDelvery,
      twoSelectChange,
      outVerifyPrimaryClick,
      getStorehouseOutNumber,
      getStorehouseAllNumber,
      getStorehouseAllOutNumber,
      ThreeCascaderCompChange,
      SizeSelectChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-layout-page-content-comp-wrap{
  background-color: #F5F5F5;
  // padding: 50px;
  height: 100%;
  max-height: 100%;
  >div{
    margin: 0;
  }
}
.out-delivery-page{
  height: 100%;
  margin: 0;
  overflow-x: auto;
  background-color: #fff;
  >main{
      >p{
        color: #fff;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        line-height: 60px;
        background-color: #222B3A;
      }
      min-width: 1380px;
      height: 100%;
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
        padding: 0 24px;
        padding-top: 40px;
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
          &.line{
            min-width: 1px;
            width: 1px;
            height: 100%;
            margin: 0 25px;
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
                    height: 40px;
                    line-height: 24px;
                    background-color: #F5F5F5;
                    width: 100%;
                    color: #000;
                  }
                  &.is-active{
                    .el-radio-button__inner{
                      border-color: #222B3A;
                      background-color:#222B3A;
                      color: #fff;
                      box-shadow:none;
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
                  .el-input{
                    height: 40px;
                    font-size: 18px;
                  }
                }
              }
              &.out-number{
                .el-input-number{
                  width: 200px;
                  input{
                    text-align: left;
                  }
                }
                .mp-one-level-select{
                  margin: 0 20px;
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
              display: flex;
              flex-wrap: wrap;
              height: 80px;
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
          min-width: 577px;
          .warehouse{
            height: calc(100% - 37px);
            overflow-x: auto;
            flex: 1;
            padding-top: 10px;
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
                .StorehouseName{
                  font-weight: 700;
                }
                >span{
                  color: #566176;
                }
                .mp-button{
                  font-size: 16px;
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
                  .PCS{
                    width: 125px;
                  }
                  .number{
                    width: 200px;
                    display: flex;
                    .el-checkbox{
                      .el-checkbox__label{

                        font-size: 16px;
                      }
                    }
                    >div{
                      align-items: center;
                      display: flex;
                      justify-content: space-between;
                      .el-input-number{
                        width: 100px;
                        input{
                          text-align: left;
                        }
                      }
                      .el-input{
                        margin: 0 10px;
                      }
                    }
                  }
                  .el-button{
                    // width: 80px;
                    height: 34px;
                    font-size: 15px;
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

  .see-goods-dialog{
    min-height: 600px;
  }
}
</style>
