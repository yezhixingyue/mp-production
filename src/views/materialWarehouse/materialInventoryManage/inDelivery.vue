<template>
  <div class="in-delivery-page">

    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-scrollbar>
          <div class="delivery-info" :style="`height:${h-240}px`">
            <div class="left">
              <el-form label-width="120px">
                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input v-model="Data.getMaterialData.SKUCode"
                     @keyup.enter="getMaterial(false)" size="large"/>
                    <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
                  </p>
                  <span>或者</span>
                </el-form-item>
                <el-form-item :label="`选择物料：`" class="select-material">
                  <el-cascader v-model="value" :options="cascaderOptions" @change="handleChange" />
                  <!-- <TowLevelSelect
                    :level1Options='MaterialManageList'
                    :level2Options='SizeS'
                    :defaultProps="{
                      value:'ID',
                      label:'name',
                    }"
                    :lv2DefaultProps="{
                      value:'SizeID',
                      label:'SizeName',
                    }"
                    :value='twoSelecValue'
                    @change="twoSelectChange"
                    @requestFunc='getMaterial(true)'
                    :width="300"
                    ></TowLevelSelect> -->
                </el-form-item>
                <p class="material-info">
                  <template v-if="Data.checkedMaterial">
                    <!-- <span>{{Data.checkedMaterial.Code}}</span> -->
                    <span>
                      <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
                      :key="item.AttributeID">
                        {{index === 0 ? '' : ' - ' }}
                        <template v-if="item.NumericValue">
                          <span>{{item.NumericValue}}</span>
                          {{item.AttributeUnit}}
                        </template>
                        <template v-else>
                          <span>{{item.InputSelectValue || item.SelectValue}}</span>
                        </template>
                      </template>
                    </span>
                    <span>{{Data.checkedMaterial.SizeDescribe}}</span>
                    <span>{{Data.checkedMaterial.Code}}</span>
                  </template>
                </p>
                <el-form-item :label="`入库数量：`" class="in-number">
                  <el-input-number :controls="false" v-model="Data.inDeliveryForm.Number" />
                  <OneLevelSelect
                    v-if="Data.checkedMaterial"
                    :options='Data.checkedMaterial.UnitSelects'
                    :defaultProps="{
                      value:'UnitID',
                      label:'Unit',
                    }"
                    :value='Data.inDeliveryForm.UnitID'
                    @change="(ID) => Data.inDeliveryForm.UnitID = ID"
                    :width="120"
                    :placeholder="'请选择单位'"
                    ></OneLevelSelect>
                    <template v-if="Data.checkedMaterial">
                      {{getTransitionNum}}
                      {{Data.checkedMaterial?.StockUnit}}
                    </template>
                </el-form-item>
                <el-form-item :label="`入库类型：`">
                  <el-radio-group v-model="Data.inDeliveryForm.InStockType" size="large">
                    <el-radio :label="1">采购</el-radio>
                    <el-radio :label="2">退料</el-radio>
                    <el-radio :label="3">赠送</el-radio>
                    <el-radio :label="4">成品</el-radio>
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
                    :width="300"
                    :placeholder="'请选择供应商'"
                    ></OneLevelSelect>
                    <el-form-item :label="`单价：`" v-if="Data.inDeliveryForm.InStockType === 1"
                      size="large">
                      <el-input-number :controls="false" v-model="Data.inDeliveryForm.Price"
                      size="large"/>
                      <template v-if="Data.checkedMaterial?.StockUnit">
                      元/{{Data.checkedMaterial?.StockUnit}}
                      </template>
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
                    :placeholder="'请选择退料人'"
                    ></OneLevelSelect>
                </el-form-item>
                <el-form-item :label="`共计：`" v-if="Data.inDeliveryForm.InStockType === 1">
                  <p>{{Data.inDeliveryForm.Price * Data.inDeliveryForm.Number}}￥</p>
                </el-form-item>
                <el-form-item :label="`备注：`" class="remark">
                  <el-input v-model="Data.inDeliveryForm.Remark" size="large"/> (选填)
                </el-form-item>
              </el-form>

            </div>
            <div class="line"></div>
            <div class="right">
              <el-button @click="Data.SelectGoods = true">选择货位</el-button>
              <el-scrollbar>
                <div class="warehouse">
                  <div class="warehouse-item"
                  v-for="item in inStorehouseGoodsPosition" :key="item.StorehouseID">
                    <p class="title">
                      <span>
                        {{item.StorehouseName}}：
                        {{getStorehouseInNumber(item.GoodsPositionList)}}
                        {{Data.checkedMaterial?.StockUnit}}
                      </span>
                    </p>
                    <ul>
                      <li v-for="GoodsPosition in item.GoodsPositionList" :key="GoodsPosition">
                        <span class="ranks">
                          A区 001柜 3行 2列
                        </span>
                        <span class="number">
                          <span>
                          入库
                            <el-input v-model="GoodsPosition.Number"></el-input>
                            {{Data.checkedMaterial?.StockUnit}}
                          </span>
                        </span>
                        <el-button type="primary">删除</el-button>
                      </li>
                      <!-- <li>
                        <span class="ranks">
                          A区 001柜 3行 2列
                        </span>
                        <span class="PCS">
                          5112300张
                        </span>
                        <span class="number">
                          <span>
                          入库
                            <el-input></el-input>张
                          </span>
                        </span>
                        <el-button type="primary">删除</el-button>
                      </li>
                      <li>
                        <span class="ranks">
                          A区 001柜 3行 2列
                        </span>
                        <span class="PCS">
                          5112300张
                        </span>
                        <span class="number">
                          <span>
                          入库
                            <el-input></el-input>张
                          </span>
                        </span>
                        <el-button type="primary">删除</el-button>
                      </li> -->
                    </ul>
                  </div>
                </div>
              </el-scrollbar>
              <p class="total" v-if="inStorehouseGoodsPosition.length">
                合计：{{getStorehouseAllInNumber()}}{{Data.checkedMaterial?.StockUnit}}</p>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="inDelivery">入库</el-button>
          </div>
        </el-scrollbar>
      </MpCardContainer>
    <DialogContainerComp
    title="选择货位"
    primaryText='确定'
    :visible='Data.SelectGoods'
    :width="660"
    :primaryClick="SelectGoodsPrimaryClick"
    :closeClick="SelectGoodsCloseClick"
    :closed="SelectGoodsClosed"
    >
    <template #default>
      <div class="select-goods-dialog">
        <el-scrollbar>
          <el-radio-group @change="getGoodsPositionList" v-model="Data.StorehouseID">
            <el-radio-button v-for="item in Data.StorehouseList" :key="item.StorehouseID"
            :label="item.StorehouseID">
              {{item.StorehouseName}}
            </el-radio-button>
          </el-radio-group>
        </el-scrollbar>
        <el-checkbox-group v-model="selectStorehouseGoodsPosition[Data.StorehouseID]">
          <el-checkbox v-for="item in Data.GoodsPositionList"
          :key="item.PositionID" :label="item.PositionID">
          {{item.PositionName}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
    </DialogContainerComp>
    </main>

  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { MaterialInfoType } from '@/assets/Types/common';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface MaterialGoodsPositionsType {
  PositionID: number,
  Number: number,
}
interface getMaterialDataType {
  MaterialID:string|number,
  SizeID:string|number,
  SKUCode:string,
}
interface inDeliveryFormType {
  MaterialID: number,
  UnitID: number|string,
  Number: number|null,
  InStockType: number,
  Handler: string,
  SupplierID: number|string,
  Price: number|null,
  Remark: string,
  MaterialGoodsPositions: MaterialGoodsPositionsType[],
}

interface unitListType {
  UnitID: number| string,
  Unit: number|string,
}
interface GoodsPositionListType {
  PositionID: number| string,
  PositionName: number|string,
}
interface GoodsPositionItemType {
  PositionID: number| string,
  Number: number|string,
}
interface StorehouseType {
  StorehouseID: number,
  StorehouseName: string,
}
interface StorehouseGoodsPositionType {
  StorehouseName: string,
  StorehouseID: number,
  GoodsPositionList: GoodsPositionItemType[],
}
interface DataType {
  StorehouseID: number,
  SelectGoods: boolean,
  checkedMaterial:MaterialInfoType | null,
  getMaterialData:getMaterialDataType,
  inDeliveryForm: inDeliveryFormType,
  // 仓库列表
  StorehouseList:StorehouseType[]
  GoodsPositionList:GoodsPositionListType[]
}

export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    OneLevelSelect,
    // TowLevelSelect,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const CommonStore = useCommonStore();
    // 选择仓库货位弹框的表单数据
    const selectStorehouseGoodsPosition = reactive({});
    // 入库数据表单
    const inStorehouseGoodsPosition:StorehouseGoodsPositionType[] = reactive([]);

    const Data:DataType = reactive({
      SelectGoods: false,
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 选择的物料
      checkedMaterial: null,

      // 仓库列表
      StorehouseList: [],
      // 货位列表
      GoodsPositionList: [],

      inDeliveryForm: {
        MaterialID: 0,
        UnitID: '',
        Number: null,
        InStockType: 1,
        Handler: '589705d2-c0ba-44aa-aab9-ae5900df1dd6',
        SupplierID: '',
        Price: null,
        Remark: '',
        MaterialGoodsPositions: [
          {
            PositionID: 6,
            Number: 10,
          },
        ],
      },

      StorehouseID: 0,
    });
    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getMaterialData.MaterialID,
      level2Val: Data.getMaterialData.SizeID,
    }));
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
    const MaterialManageList = computed(() => [{ ID: '', name: '无', TypeID: '' },
      ...MaterialWarehouseStore.MaterialManageList.map(res => {
        let msg = '';
        // 组合物料名
        res.MaterialAttributes.forEach(item => {
          if (item.NumericValue) {
            msg += item.NumericValue;
            msg += item.AttributeUnit;
          } else {
            msg += item.InputSelectValue || item.SelectValue;
          }
        });

        return {
          name: msg,
          ...res,
        };
      })]);
    const cascaderOptions = computed(() => {
      console.log('aaa');
      return '';
    });

    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      Data.getMaterialData.MaterialID = level1Val;
      Data.getMaterialData.SizeID = level2Val;
    }
    // 入库
    function inDelivery() {
      if (Data.checkedMaterial) {
        Data.inDeliveryForm.MaterialID = Data.checkedMaterial.MaterialID;
      }
      const temp:GoodsPositionItemType[] = [];
      inStorehouseGoodsPosition.forEach(item => {
        temp.push(...item.GoodsPositionList);
      });
      Data.inDeliveryForm.MaterialGoodsPositions = temp as MaterialGoodsPositionsType[];
      api.getStockIn(Data.inDeliveryForm).then(res => {
        if (res.data.Status === 1000) {
          console.log(res);
          messageBox.successSingle('入库成功', () => null, () => null);
        }
      });
    }
    function getGoodsPositionList() {
      api.getGoodsPositionList({ StorehouseID: Data.StorehouseID }).then(res => {
        if (res.data.Status === 1000) {
          console.log(res);
          Data.GoodsPositionList = res.data.Data as GoodsPositionListType[];
        }
      });
    }
    // 获取仓库的入库总数量
    function getStorehouseInNumber(list) {
      let num = 0;
      list.forEach(it => {
        num += Number(it.Number);
      });
      return num;
    }
    // 获取全部仓库的入库总数量
    function getStorehouseAllInNumber() {
      let num = 0;
      inStorehouseGoodsPosition.forEach(res => {
        res.GoodsPositionList.forEach(it => {
          num += Number(it.Number);
        });
      });
      return num;
    }
    function SelectGoodsCloseClick() {
      Data.SelectGoods = false;
    }
    function SelectGoodsClosed() {
      // 清空表单
    }
    function SelectGoodsPrimaryClick() {
      console.log(selectStorehouseGoodsPosition);
      let temp = Data.StorehouseList.map(res => {
        if (selectStorehouseGoodsPosition[res.StorehouseID].length) {
          return {
            ...res,
            actions: selectStorehouseGoodsPosition[res.StorehouseID],
          };
        }
        return null;
      });
      temp = temp.filter(res => res);
      console.log(temp, 'temptemp');
      temp.forEach(res => {
        if (res) {
          inStorehouseGoodsPosition.push({
            StorehouseName: res.StorehouseName,
            StorehouseID: res.StorehouseID,
            GoodsPositionList: res.actions.map(it => ({
              PositionID: it,
              Number: '',
            })),
          });
        }
      });
      SelectGoodsCloseClick();
      // 入库
    }

    // 根据选项或sku编码查物料
    function getMaterial(bol) {
      // 物料筛选
      if (bol) {
        // 没选尺寸的时候不进行下一步
        if (!Data.getMaterialData.SizeID) return;
        Data.getMaterialData.SKUCode = '';
        // temp = MaterialManageList.value.filter((
        //   res:any,
        // ) => res.ID === Data.getMaterialData.MaterialID);
      } else { // sku编码查询
        twoSelectChange({ level1Val: '', level2Val: '' });
        api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
          console.log(res);
          Data.checkedMaterial = res.data.Data as MaterialInfoType;
          Data.checkedMaterial.UnitSelects = Data.checkedMaterial.UnitSelects
            .filter(it => it.UnitPurpose === 1);
        });
      }
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.in-delivery-page header', 20);
      window.onresize = () => {
        h.value = getHeight('.in-delivery-page header', 20);
      };
    }
    // 获取仓库列表
    function getStorehouseAll() {
      api.getStorehouseAll().then(res => {
        if (res.data.Status === 1000) {
          Data.StorehouseList = res.data.Data as StorehouseType[];
          Data.StorehouseList.forEach(item => {
            selectStorehouseGoodsPosition[item.StorehouseID] = [];
          });
        }
      });
    }
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      // 获取所有物料分类
      MaterialWarehouseStore.getMaterialCategoryList();
      // 获取所有物料类型
      // MaterialWarehouseStore.getMaterialTypeAll(newValue as number);

      MaterialWarehouseStore.getMaterialManageList({});
      CommonStore.getStaffSelect();
      MaterialWarehouseStore.getSupplierSelectList();
      getStorehouseAll();
    });

    return {
      h,
      Data,
      CommonStore,
      getTransitionNum,
      getMaterial,
      ToOutDelivery,
      twoSelecValue,
      MaterialManageList,
      twoSelectChange,
      MaterialWarehouseStore,
      SelectGoodsCloseClick,
      inDelivery,
      SelectGoodsClosed,
      SelectGoodsPrimaryClick,
      getGoodsPositionList,
      selectStorehouseGoodsPosition,
      inStorehouseGoodsPosition,
      getStorehouseInNumber,
      getStorehouseAllInNumber,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.in-delivery-page{
  main{
    margin-top: 20px;
    overflow-x: auto;
    .mp-card-container{
      // display: flex;
      height: 100%;
      // flex-direction: column;
      // min-width: 1620px;
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
          min-width: 855px;
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
              .select-material{
                .mp--tow-level-select{
                  .select-box{
                    width: 300px;
                  }
                }
              }
              &.in-number{
                .el-input-number{
                  width: 300px;
                }
                .mp-one-level-select{
                  margin: 0 20px;
                }
              }
              &.supplier{
                >.el-form-item__content{
                  .el-input-number{
                    width: 136px;
                    margin-right: 20px;
                  }
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
          >.el-button{
            width: 120px;
            height: 40px;
          }
          .warehouse{
            // height: calc(100% - 37px);
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
                span{
                  color: #566176;
                }
                margin-bottom: 20px;
                padding: 0 10px;
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
                  .number{
                    width: 240px;
                    align-items: center;
                    display: flex;
                    >span{
                      align-items: center;
                      display: flex;
                      .el-input{
                        margin: 0 10px;
                        width: 100px;
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
  .select-goods-dialog{
    .el-radio-group{
      width: 100%;
      flex-wrap: nowrap;
      padding-bottom: 8px;
    }
  }
}
</style>
