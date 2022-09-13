<template>
  <div class="out-delivery-page">
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-scrollbar>
          <div class="delivery-info" :style="`height:${h-240}px`">
            <div class="left">
              <el-form label-width="120px">
                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input size="large" @keyup.enter="getMaterial(false)"
                    placeholder="请输入完整SKU编码，包括尺寸编码"
                     v-model="Data.getMaterialData.SKUCode"/>
                    <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
                  </p>
                  <span>或者</span>
                </el-form-item>
                <el-form-item :label="`选择物料：`" class="select-material">
                  <!-- <el-cascader :props="props" /> -->
                  <ThreeCascaderComp
                  :change="ThreeCascaderCompChange"
                  ></ThreeCascaderComp>
                  <OneLevelSelect
                  v-if="Data.itemSelectTempMaterial"
                    :options='Data.itemSelectTempMaterial.SizeSelects'
                    :defaultProps="{
                      value:'SizeID',
                      label:'SizeDescribe',
                    }"
                    :value='Data.SizeSelects'
                    @change="SizeSelectChange"
                    :width="250"
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
                  <OneLevelSelect
                    v-else
                    :options='[]'
                    :width="250"
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
                </el-form-item>
                <p class="material-info">
                  <template v-if="Data.checkedMaterial">
                    <!-- <span>{{Data.checkedMaterial.Code}}</span> -->
                    <span>
                      <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
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
                      </template>
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
                    :width="120"
                    :placeholder="'请选择单位'"
                    ></OneLevelSelect>
                    <template v-if="Data.checkedMaterial">
                      {{getTransitionNum}}
                      {{Data.checkedMaterial?.StockUnit}}
                    </template>
                </el-form-item>
                <el-form-item :label="`出库类型：`">

                  <el-radio-group v-model="Data.outDeliveryForm.OutStockType">
                    <el-radio :label="51">领料</el-radio>
                    <el-radio :label="52">补料</el-radio>
                    <el-radio :label="53">无订单领料</el-radio>
                    <el-radio :label="54">销售</el-radio>
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
              <el-scrollbar>
                <div class="warehouse">
                  <div class="warehouse-item"
                  v-for="Storehouse in Data.StorehouseStockInfo" :key="Storehouse.StorehouseID">
                    <p class="title">
                      <span>
                        {{Storehouse.StorehouseName}}：{{getStorehouseAllNumber(Storehouse)}}{{Data.checkedMaterial?.StockUnit}}
                      </span>
                      <span>
                        出库：{{getStorehouseOutNumber(Storehouse)}}{{Data.checkedMaterial?.StockUnit}}
                      </span>
                      <span>
                        <el-button link type="primary"
                        @click="SeeImg(Storehouse.StorehouseImg)">查看平面布局图</el-button>
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
                        <el-button type="primary" @click="seePosition(Storehouse,GoodsPosition)">位置</el-button>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-scrollbar>
              <p class="total" v-if="Data.StorehouseStockInfo.length">
                合计：{{getStorehouseAllOutNumber()}}
                {{Data.checkedMaterial?.StockUnit}}
                （{{getOutUnitNum}} {{outUnitName}}）</p>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="outDelvery">出库</el-button>
          </div>
        </el-scrollbar>
      </MpCardContainer>
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
              <span style="">{{Data.checkedMaterial.Code}}</span></p>
            <p style="display: flex;text-align: right;"><span style="width:70px;color:#7A8B9C;">物料：</span>
              <span style="">
                      <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
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
                      </template>
              </span>
            </p>
            <p style="display: flex;text-align: right;"><span style="width:70px;color:#7A8B9C;"></span>
              <span style="">{{Data.checkedMaterial.SizeDescribe}}</span></p>
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
import LocationMap from '@/components/LocationMap/Index.vue';

import OutDeliveryDialog from '@/components/materialInventoryManage/outDeliveryDialog.vue';
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import {
  ref, Ref, reactive, onMounted, computed, onActivated, watch,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useRouter, useRoute } from 'vue-router';
import { MaterialInfoType } from '@/assets/Types/common';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';

interface MaterialGoodsPositionsType {
  PositionID: number,
  Number: number,
}
interface getMaterialDataType {
  MaterialID:string|number,
  SizeID:string|number,
  SKUCode:string,
}
interface outDeliveryFormType {
  MaterialID: number,
  Number: number|null,
  UnitID: number|null,
  OutStockType: number,
  Handler: string,
  Remark: string,
  MaterialGoodsPositions: MaterialGoodsPositionsType[],
}
interface UnitSelectsType {
  UnitID: number,
  Unit: string,
  UnitName: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: number,
  CodeID: number,
  AttributeID: number,
  SelectID: number,
  NumericValue: string,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: true
}
interface SizeSelectsType {
  MaterialID: number,
  SizeID: number,
  Code: string,
  SizeDescribe: string
}
interface MaterialSelectsType {
  CodeID: number,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeSelects: SizeSelectsType[]
}
interface MaterialDataItemType {
  StockUnit: string,
  Code: string,
  UnitSelects: UnitSelectsType[],
  MaterialSelects: MaterialSelectsType[]
}
interface GoodsPositionStockInfosType {
  StorehouseID: number | string,
  PositionName: string,
  PositionID: number | string,
  Number: number | string,
  checked: boolean,
  inputValue:string,
}
interface StorehouseStockInfoType {
  StorehouseID: number | string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}

export interface DimensionDataType {
  PositionID: number,
  DetailID: number,
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
  StorehouseID:string|number
  DimensionIDS: Array<string|number>
  StorehouseGoodsPosition:string
}

interface DataType {
  TypeID:string|number
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
    MpCardContainer,
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
    const h = ref(0);
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
        MaterialID: 0,
        Number: null,
        UnitID: null,
        OutStockType: 51,
        Handler: '',
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: 0,
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
    function clearFrom() {
      Data.outDeliveryForm = {
        MaterialID: 0,
        Number: null,
        UnitID: null,
        OutStockType: 51,
        Handler: '',
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: 0,
            Number: 0,
          },
        ],
      };
    }
    // 获取物料货位数据信息
    function GetGoodsAllocation(MaterialID) {
      api.getStorehouseStock(MaterialID).then(res => {
        if (res.data.Status === 1000) {
          console.log(res);
          const temp = [...res.data.Data as StorehouseStockInfoType[]];
          temp.map(StorehouseIt => {
            const _StorehouseIt = StorehouseIt.GoodsPositionStockInfos.map(Positionit => ({
              // checked: false,
              // inputValue: '',
              ...Positionit,
            }));
            return _StorehouseIt;
          });
          Data.StorehouseStockInfo = temp;
          console.log(Data.StorehouseStockInfo, 'Data.StorehouseStockInfo');
        }
      });
    }
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial, TypeID) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = allSellectMaterial as MaterialDataItemType;
      Data.itemSelectTempMaterial = itemMaterial as MaterialSelectsType;
      Data.TypeID = TypeID;
      Data.outDeliveryForm.UnitID = null;
    }
    // 格式化数据
    function SizeSelectChange(ID) {
      Data.SizeSelects = ID;
      const SizeObj = Data.itemSelectTempMaterial?.SizeSelects.find(res => res.SizeID === ID);
      const temp = {
        MaterialID: SizeObj?.MaterialID,
        TypeID: Data.TypeID,
        Code: SizeObj?.Code,
        SizeDescribe: SizeObj?.SizeDescribe,
        MaterialAttributes: Data.itemSelectTempMaterial?.MaterialAttributes,
        StockUnit: Data.allSelectTempMaterial?.StockUnit,
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects.filter(res => res.UnitPurpose === 2),
      };
      Data.checkedMaterial = temp as MaterialInfoType;
      Data.outDeliveryForm.UnitID = null;
      GetGoodsAllocation(Data.checkedMaterial.MaterialID);
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
        console.log(res);
        if (res.data.Data) {
          Data.checkedMaterial = res.data.Data as MaterialInfoType;
          Data.outDeliveryForm.UnitID = null;
          Data.checkedMaterial.UnitSelects = Data.checkedMaterial.UnitSelects
            .filter(it => it.UnitPurpose === 1);
          GetGoodsAllocation(Data.checkedMaterial.MaterialID);
        } else {
          messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
        }
      });
    }
    function outVerifyPrimaryClick() {
      api.getStockOut(Data.outDeliveryForm).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            Data.StorehouseStockInfo = [];
            GetGoodsAllocation(Data.checkedMaterial?.MaterialID);
            clearFrom();
            Data.outVerify = false;
            printBtn.value.ref.click();
          };
          messageBox.successSingle('出库成功', cb, cb);
        }
      });
    }
    function outDelvery() {
      if (!Data.checkedMaterial?.MaterialID) {
        messageBox.failSingleError('出库失败', '请选择物料', () => null, () => null);
      } else if (!Data.outDeliveryForm.Number) {
        messageBox.failSingleError('出库失败', '请输入出库数量', () => null, () => null);
      } else if (!Data.outDeliveryForm.UnitID) {
        messageBox.failSingleError('出库失败', '请输入出库单位', () => null, () => null);
      } else if (!Data.outDeliveryForm.Handler) {
        messageBox.failSingleError('出库失败', '请选择领取人', () => null, () => null);
      } else if (Number(Data.outDeliveryForm.Number) !== Number(getOutUnitNum.value)) {
        messageBox.failSingleError('出库失败', '出库数量与合计出库数量不一致', () => null, () => null);
      } else {
      // 设置物料id
        Data.outDeliveryForm.MaterialID = Data.checkedMaterial.MaterialID;
        const temp: MaterialGoodsPositionsType[] = [];
        Data.StorehouseStockInfo.forEach(StorehouseIt => {
          StorehouseIt.GoodsPositionStockInfos.forEach(PositionIt => {
            if (PositionIt.checked) {
              temp.push({
                PositionID: PositionIt.PositionID as number,
                Number: Number(PositionIt.inputValue),
              });
            }
          });
        });
        Data.outDeliveryForm.MaterialGoodsPositions = temp;
        // 设置出库货位及数量
        console.log(Data.outDeliveryForm);
        Data.outVerify = true;
      }
    }

    // 查看物料货位
    function seePosition(Storehouse, GoodsPosition) {
      console.log(GoodsPosition);

      Data.getGoodsPositionData.StorehouseID = Storehouse.StorehouseID;
      Data.getGoodsPositionData.DimensionIDS = GoodsPosition.UpperDimensionIDS.split(',');
      Data.getGoodsPositionData.StorehouseGoodsPosition = `${Storehouse.StorehouseName} ${GoodsPosition.UpperDimension} ${GoodsPosition.PositionName}`;
      Data.seePositionShow = true;
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.out-delivery-page header', 20);
      console.log(h.value);
      window.onresize = () => {
        h.value = getHeight('.out-delivery-page header', 20);
      };
    }
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      const MaterialCode = JSON.parse(route.query.MaterialCode as string);
      console.log(MaterialCode, 'MaterialCode');
      if (MaterialCode) {
        Data.getMaterialData.SKUCode = MaterialCode;
        getMaterial();
      }

      setHeight();
      MaterialWarehouseStore.getMaterialManageList({});
      CommonStore.getStaffSelect();
    });

    return {
      print,
      printBtn,
      h,
      Data,
      SeeImg,
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
.out-delivery-page{
  >main{
    margin-top: 20px;
    overflow-x: auto;
    >.mp-card-container{
      display: flex;
      height: 100%;
      flex-direction: column;
      // >div{
      //   width: 50%;
      // }
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
      .delivery-info{
        flex: 1;
        display: flex;
        justify-content: space-between;
        min-height: 480px;
        >div{
          width: 855px;
          &.line{
            min-width: 1px;
            width: 1px;
            height: 100%;
            margin: 0 45px;
            background-color: #A6B6C6;
          }
        }
        .left{
          .el-form{
            font-size: 20px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #7A8B9C;
            .el-form-item{
              .el-form-item__label{
                font-size: 20px;
              }
              .el-input{
                font-weight: 300;
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
                      width: 600px;
                      margin-right: 20px;
                    }
                    .el-button{
                      font-size: 20px;
                      font-weight: 400;
                    }
                  }
                  >span{
                    margin: 10px 0;
                  }
                }
              }
              &.select-material{
                .el-cascader{
                  width: 350px;
                  height: 40px;
                  margin-right: 40px;
                  .el-input{
                    height: 40px;
                  }
                }
              }
              &.out-number{
                .el-input-number{
                  width: 300px;
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
                  width: 600px;
                  margin-right: 20px;
                }
              }
            }
            >.material-info{
              align-items: center;
              margin-bottom: 18px;
              padding-left: 120px;
              display: flex;
              flex-wrap: wrap;
              height: 80px;
              line-height: 40px;
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
          .warehouse{
            height: calc(100% - 37px);
            overflow-x: auto;
            flex: 1;
            padding-top: 10px;
            .warehouse-item{
              .title{
                font-size: 20px;
                font-weight: 400;
                line-height: 17px;
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 0 10px;
                margin-top: 10px;
                >span{
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
                    width: 240px;
                    display: flex;
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
                      >span{
                        margin-left: 15px;
                      }
                      .el-input{
                        margin: 0 10px;
                      }
                    }
                  }
                  .el-button{
                    width: 100px;
                    margin: 0 20px;
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

  .see-goods-dialog{
    min-height: 580px;
  }
}
</style>
