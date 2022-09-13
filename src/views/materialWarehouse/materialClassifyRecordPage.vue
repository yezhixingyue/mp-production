<template>
  <div class="material-classify-record-page">
    <header>
      <div class="header-top">
        <el-radio-group v-model="Data.getRecordData.LogType"
        @change="radioGroupChange">
          <el-radio-button :label="1">入库记录</el-radio-button>
          <el-radio-button :label="2">出库记录</el-radio-button>
        </el-radio-group>
      </div>
      <MpCardContainer :TopAndButtomPadding = '12'>
        <div class="top-main">
          <RadioGroupComp
            :title='"物料筛选"'
            :level1Options='CategoryList'
            :level2Options='MaterialTypeList'
            :defaultProps="{
              value:'CategoryID',
              label:'CategoryName',
            }"
            :lv2DefaultProps="{
              value:'TypeID',
              label:'TypeName',
            }"
            :value='twoSelecValue'
            @change="twoSelectChange"
            @requestFunc='getRecordList'
            ></RadioGroupComp>
        </div>
        <div class="top-main">
          <template v-if="Data.getRecordData.LogType === 2">
            <OneLevelSelect
              :title='"出库类型"'
              :options='outStorageType'
              :value='Data.getRecordData.HandleType'
              @change="(ID) => Data.getRecordData.HandleType = ID"
              @requestFunc='getRecordList'
              ></OneLevelSelect>
          </template>
          <template v-if="Data.getRecordData.LogType === 1">
            <OneLevelSelect
              title='入库类型'
              :options='inStorageType'
              :value='Data.getRecordData.HandleType'
              @change="(ID) => Data.getRecordData.HandleType = ID"
              @requestFunc='getRecordList'
              ></OneLevelSelect>
            <OneLevelSelect
              :title='"供应商"'
              :options='SupplierSelectList'
              :defaultProps="{
                value:'SupplierID',
                label:'SupplierName',
              }"
              :value='Data.getRecordData.SupplierID'
              @change="(ID) => Data.getRecordData.SupplierID = ID"
              @requestFunc='getRecordList'
              ></OneLevelSelect>
          </template>
          <OneLevelSelect
            :title='Data.getRecordData.LogType === 1 ? "退料人": "领取人"'
            :options='StaffSelectList'
            :defaultProps="{
              value:'StaffID',
              label:'StaffName',
            }"
            :value='Data.getRecordData.Handler'
            @change="(ID) => Data.getRecordData.Handler = ID"
            @requestFunc='getRecordList'
            ></OneLevelSelect>
          <OneLevelSelect
            :title='"操作人"'
            :options='StaffSelectList'
            :defaultProps="{
              value:'StaffID',
              label:'StaffName',
            }"
            :value='Data.getRecordData.Operater'
            @change="(ID) => Data.getRecordData.Operater = ID"
            @requestFunc='getRecordList'
            ></OneLevelSelect>
        </div>
        <div class="top-main flex-between">
          <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getRecordList'
          :isFull="true"
          :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
          :dateValue='Data.getRecordData.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          :label="Data.getRecordData.LogType === 1 ? '入库时间' : '出库时间'"
          >
          <!-- :dateList="dateList" -->
          </LineDateSelectorComp>
            <SearchInputComp
              :word='Data.getRecordData.KeyWords'
              title="关键词搜索"
              placeholder="请输入搜索关键词"
              resetWords="清空所有筛选条件"
              :changePropsFunc="(words) => Data.getRecordData.KeyWords = words"
              :requestFunc='getRecordList'
              @reset='clearCondition'
              >
            </SearchInputComp>
        </div>
      </MpCardContainer>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.RecordList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="MaterialCode" label="SKU编码" min-width="115"/>
          <el-table-column
          show-overflow-tooltip prop="CategoryName" label="分类" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="TypeName" label="类型" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="物料" label="物料" min-width="152">
            <template #default="scope">
              <template v-for="(item, index) in scope.row.MaterialAttributes"
              :key="item.AttributeID">
                <template v-if="item.NumericValue">
                  <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                </template>
                <template v-else>
                  <span>{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === scope.row.MaterialAttributes.length-1 ? '' : ' ' }}
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="SizeDescribe" label="尺寸规格" min-width="199">
          </el-table-column>
          <el-table-column prop="Stock" label="数量" min-width="158">
            <template #default="scope">
              {{Math.abs(scope.row.Stock)}} {{scope.row.StockUnit}}
              <el-button link type="primary" @click="SeeGoodsAllocation(scope.row)">
                {{Data.getRecordData.LogType === 1 ? '入库货位' : '出库货位'}}
              </el-button>
            </template>
          </el-table-column>
          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="Price" label="单价" min-width="104">
              <template #default="scope">
                {{scope.row.Price}}元/{{scope.row.StockUnit}}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" min-width="112">
              <template #default="scope">
                {{scope.row.amount}}元
              </template>
            </el-table-column>
            <el-table-column prop="HandleType" label="入库类型" min-width="88">
              <template #default="scope">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>
          <template v-if="Data.getRecordData.LogType === 2">
            <el-table-column prop="HandleType" label="出库类型" min-width="88">
              <template #default="scope">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column
            show-overflow-tooltip prop="SupplierName" label="供应商/退料人" min-width="149">
              <template #default="scope">
                {{scope.row.SupplierName}}{{scope.row.HandlerName}}
              </template>
            </el-table-column>
          </template>

          <el-table-column
          show-overflow-tooltip prop="Remark" label="备注" min-width="118"/>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="OperaterName" label="操作人" min-width="79"/>
            <el-table-column
            show-overflow-tooltip prop="CreateTime" label="入库时间" min-width="158">
              <template #default="scope">
                {{$format.format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
              </template>
            </el-table-column>
          </template>

          <template v-if="Data.getRecordData.LogType === 2">
            <el-table-column prop="HandlerName" label="领取人" min-width="79"/>
            <el-table-column prop="OperaterName" label="操作人" min-width="79"/>
            <el-table-column
            show-overflow-tooltip prop="CreateTime" label="出库时间" min-width="158">
              <template #default="scope">
                {{$format.format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
              </template>
            </el-table-column>
          </template>

        </el-table>
        <div>
          <MpPagination
          :nowPage="Data.getRecordData.Page"
          :pageSize="Data.getRecordData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange"
          />
        </div>
      </MpCardContainer>
    </main>
    <!-- 添加物料 -->
    <DialogContainerComp
    :title="`${Data.editTypeID ? '修改' : '添加'}物料`"
    :visible='Data.addMaterialManageShow'
    :width="660"
    :primaryClick="addMaterialManagePrimaryClick"
    :closeClick="addMaterialManageCloseClick"
    :closed="addMaterialManageClosed"
    >
    <template #default>
      <div class="add-material-manage-dialog">
        <el-form :model="Data.addMaterialManageForm" label-width="100px">
          <el-form-item :label="`类型：`">
            <span>{{Data.dialogTypeData.CategoryName}} {{Data.dialogTypeData.TypeName}}</span>
          </el-form-item>
          <el-form-item :label="`编码：`">
            <el-input
            v-model="Data.addMaterialManageForm.MaterialCode" />
          </el-form-item>
          <p>
            编码由 1 到 10 位的英文字母或数字组成，方便记忆，在入库搜索物料时输入编码，可快速定位物料， 类似于超市称重时输入的物品
          </p>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <!-- 仓库货位信息 -->
    <DialogContainerComp
    title="仓库货位信息"
    :visible='Data.StorehouseStockShow'
    :width="660"
    :showPrimary="false"
    :closeBtnText="'关闭'"
    :closeClick="() => Data.StorehouseStockShow = false"
    >
    <template #default>
      <div class="storehouse-stock-dialog">
        <div class="material-manage">
          <p>物料：<template v-for="(item, index) in Data.materialManageInfo.MaterialAttributes"
              :key="item.AttributeID">
                <template v-if="item.NumericValue">
                  <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                </template>
                <template v-else>
                  <span>{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === Data.materialManageInfo.MaterialAttributes.length-1 ? '' : ' ' }}
                </template>
              </template>
          </p>
          <p>
            尺寸规格：{{Data.materialManageInfo.SizeDescribe}}
          </p>
          <p>
            SKU编码：{{Data.materialManageInfo.MaterialCode}}
          </p>
        </div>
        <el-scrollbar>
          <div class="warehouse">
            <div class="warehouse-item"
            v-for="Storehouseitem in Data.StorehouseStockInfo"
            :key="Storehouseitem.StorehouseID">
              <p class="title">
                <span>
                  {{Storehouseitem.StorehouseName}}：
                  {{Data.getRecordData.LogType === 1 ? '入库' : '出库'}}
                  {{Math.abs(getStorehouseInNumber(Storehouseitem.GoodsPositionStockInfos))}}{{Data.materialManageInfo.StockUnit}}
                </span>
              </p>
              <ul>
                <li v-for="GoodsPosition in Storehouseitem.GoodsPositionStockInfos"
                :key="GoodsPosition.PositionID">
                  <span class="ranks">
                    {{GoodsPosition.UpperDimension}}
                    {{GoodsPosition.PositionName}}
                    <!-- A区 001柜 3行 2列 -->
                  </span>
                  <span class="PCS">
                    {{Data.getRecordData.LogType === 1 ? '入库' : '出库'}}
                    {{Math.abs(GoodsPosition.Number)}}{{Data.materialManageInfo.StockUnit}}
                  </span>
                </li>
              </ul>
            </div>
            <p>合计{{Data.getRecordData.LogType === 1 ? '入库' : '出库'}}：{{Math.abs(getStorehouseAllInNumber())}}{{Data.materialManageInfo.StockUnit}}</p>
          </div>
        </el-scrollbar>
        <!-- {{Data.StorehouseStockInfo}} -->
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import ClassType from '@/store/modules/formattingTime/CommonClassType';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface StockListType {
  BrandID: number,
  WarnThreshold: number,
  NoticeMobile: string,
  IsWarn: boolean,
  IsOpenWarn: boolean,
  TotalStock: number,
  MaterialID: number,
  CategoryID: number,
  CategoryName: string,
  TypeID: number,
  TypeName: string,
  StockUnit: string,
  Operater: string|'00000000-0000-0000-0000-000000000000',
  CreateTime: string|'2022-08-11T05:47:45.473Z',
  CodeID: number,
  MaterialCode: string,
  SizeDescribe: string,
  AttributeDescribe: string,
  SizeID: number
}
interface getRecordDataType {
  DateType:string
  LogType: number,
  Handler: string | '00000000-0000-0000-0000-000000000000',
  HandleType: number|string,
  SupplierID: number|string,
  Operater: string | '00000000-0000-0000-0000-000000000000',
  CreateTime: {
    First: string | '2022-08-11T05:47:45.475Z',
    Second: string | '2022-08-11T05:47:45.475Z',
  },

  TypeID:number|string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface RecordListType {
  LogID: number,
  MaterialID: number,
  CategoryID: number,
  CategoryName: string,
  TypeID: number,
  TypeName: string,
  LogType: number,
  Handler: string|'00000000-0000-0000-0000-000000000000',
  HandlerName: string,
  HandleType: number,
  SupplierID: number,
  SupplierName: string,
  Stock: number,
  amount: number,
  Price: number,
  StockUnit: string,
  Operater: string|'00000000-0000-0000-0000-000000000000',
  OperaterName: string,
  Remark: string,
  CreateTime: string|'2022-08-11T05:47:45.473Z',
  CodeID: number,
  MaterialCode: string,
  SizeDescribe: string,
  AttributeDescribe: string,
  SizeID: number
}
interface GoodsPositionStockInfosType {
  StorehouseID: number | string,
  PositionName: string,
  PositionID: number | string,
  Number: number | string,
}
interface StorehouseStockInfoType {
  StorehouseID: number | string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}
interface DataType {
  addMaterialManageShow:boolean,
  StorehouseStockShow:boolean,
  DataTotal: number,
  RecordList:RecordListType[],
  getRecordData: getRecordDataType,
  StorehouseStockInfo: StorehouseStockInfoType[],
  materialManageInfo: StockListType|null,
}

export default {
  name: 'materialClassifyRecordPage',
  components: {
    MpCardContainer,
    RadioGroupComp,
    OneLevelSelect,
    SearchInputComp,
    MpPagination,
    DialogContainerComp,
    LineDateSelectorComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    // 入库类型
    const inStorageType = [
      {
        value: '',
        label: '不限',
      },
      {
        value: 1,
        label: '采购',
      },
      {
        value: 2,
        label: '退料',
      },
      {
        value: 3,
        label: '赠送',
      },
      {
        value: 4,
        label: '成品',
      },

    ];
    const outStorageType = [
      {
        value: '',
        label: '不限',
      },
      {
        value: 51,
        label: '领料',
      },
      {
        value: 52,
        label: '补料',
      },
      {
        value: 53,
        label: '无订单领料',
      },
      {
        value: 54,
        label: '销售',
      },
    ];
    const Data:DataType = reactive({
      addMaterialManageShow: false,
      DataTotal: 0,
      RecordList: [],
      getRecordData: {
        DateType: 'today',

        LogType: 1,
        TypeID: '',
        CategoryID: '',
        Handler: '',
        HandleType: '',
        SupplierID: '',
        Operater: '',
        CreateTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        KeyWords: '',
        PageSize: 20,
        Order: {
          First: '',
          Second: '',
        },
      },
      StorehouseStockInfo: [],
      materialManageInfo: null,
      StorehouseStockShow: false,
    });

    function setCondition4DataList([[key1, key2], value]) {
      if (key2) Data.getRecordData[key1][key2] = value;
      else Data.getRecordData[key1] = value;
    }

    const UserDefinedTimeIsActive = computed(() => Data.getRecordData.DateType === ''
      && !!Data.getRecordData.CreateTime.First && !!Data.getRecordData.CreateTime.Second);

    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getRecordData.CategoryID,
      level2Val: Data.getRecordData.TypeID,
    }));
    const SupplierSelectList = computed(() => [{
      SupplierID: '',
      SupplierName: '不限',
    }, ...MaterialWarehouseStore.SupplierSelectList]);
    const StaffSelectList = computed(() => [{
      StaffID: '',
      StaffName: '不限',
    }, ...CommonStore.StaffSelectList]);

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-classify-record-page header', 20);
    }
    function getRecordList() {
      ClassType.setDate(Data.getRecordData, 'CreateTime');
      const _obj = ClassType.filter(Data.getRecordData, true);

      // if (_obj.Date) {
      //   _obj.ApplyTime = _obj.Date;
      //   delete _obj.Date;
      // }

      api.getStockLogList(_obj).then(res => {
        if (res.data.Status === 1000) {
          Data.RecordList = res.data.Data as RecordListType[];
          Data.DataTotal = res.data.DataNumber as number;
          setHeight();
        }
      });
    }
    function getHandleType(HandleType) {
      const temp = [...outStorageType, ...inStorageType].find(res => res.value === HandleType);
      if (temp) {
        return temp.label;
      }
      return '';
    }
    function PaginationChange(newVal) {
      if (Data.getRecordData.Page === newVal) return;
      Data.getRecordData.Page = newVal;
      getRecordList();
    }
    // 获取全部仓库的出库总数量
    function getStorehouseAllInNumber() {
      let num = 0;
      Data.StorehouseStockInfo.forEach(res => {
        res.GoodsPositionStockInfos.forEach(it => {
          num += Number(it.Number);
        });
      });
      return num;
    }
    function getStorehouseInNumber(GoodsPositionStockInfo) {
      let num = 0;
      GoodsPositionStockInfo.forEach(it => {
        num += Number(it.Number);
      });
      return num;
    }

    // 查看入库货位
    function SeeGoodsAllocation(data) {
      api.getStockLogPosition(data.LogID).then(res => {
        if (res.data.Status === 1000) {
          Data.StorehouseStockInfo = res.data.Data as StorehouseStockInfoType[];
          Data.materialManageInfo = { ...data };
          Data.StorehouseStockShow = true;
        }
      });
    }
    function radioGroupChange(Type) {
      Data.getRecordData.LogType = Type;
      Data.getRecordData.Handler = '';
      Data.getRecordData.Operater = '';
      Data.getRecordData.HandleType = '';
      Data.getRecordData.SupplierID = '';
      Data.getRecordData.DateType = 'today';
      Data.getRecordData.CategoryID = '';
      Data.getRecordData.TypeID = '';
      getRecordList();
      setHeight();
    }
    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.CategoryList]);
    const MaterialTypeList = computed(() => [{ TypeID: '', TypeName: '全部类型' },
      ...MaterialWarehouseStore.MaterialTypeList]);

    function addMaterialManageCloseClick() {
      // 关闭得时候清空弹框
      Data.addMaterialManageShow = false;
    }

    function addMaterialManageClosed() {
      console.log('aaa');
    }

    function addMaterialManagePrimaryClick() {
      console.log('aa');
    }
    // 清空筛选项
    function clearCondition() {
      Data.getRecordData = {
        DateType: 'today',
        LogType: 1,
        TypeID: '',
        CategoryID: '',
        Handler: '',
        HandleType: '',
        SupplierID: '',
        Operater: '',
        CreateTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }

    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      if (level1Val !== undefined) {
        Data.getRecordData.CategoryID = level1Val;
        Data.getRecordData.TypeID = level2Val;
        setHeight();
      }
    }
    watch(() => twoSelecValue.value.level1Val, (newValue) => {
      MaterialWarehouseStore.getMaterialTypeAll({ categoryID: newValue as number });
    });
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      MaterialWarehouseStore.getMaterialCategoryList();
      getRecordList();
      MaterialWarehouseStore.getSupplierSelectList();
      CommonStore.getStaffSelect();
    });

    return {
      setCondition4DataList,
      UserDefinedTimeIsActive,

      h,
      Data,
      getHandleType,
      twoSelecValue,
      CommonStore,
      inStorageType,
      outStorageType,
      CategoryList,
      SupplierSelectList,
      StaffSelectList,
      MaterialTypeList,
      PaginationChange,
      twoSelectChange,
      getRecordList,
      clearCondition,
      radioGroupChange,
      addMaterialManagePrimaryClick,
      addMaterialManageCloseClick,
      addMaterialManageClosed,
      MaterialWarehouseStore,
      SeeGoodsAllocation,
      getStorehouseAllInNumber,
      getStorehouseInNumber,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-classify-record-page{
  >header{
    >.header-top{
      margin-bottom: 20px;
      .el-radio-group{
        margin-bottom: 0;
      }
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        flex-wrap: wrap;
        &.flex-between{
          justify-content: space-between;
          align-items: flex-start;
          .mp-line-date-selector-wrap{
            margin-bottom: 18px;
          }
          .mp-common-comps-search-box{
            margin-bottom: 18px;
          }
        }
        .mp-search-input-comp{
          display: flex;
        }
        // &+.top-main{
        // }
        >ul{
          margin-right: 60px;
          margin-bottom: 18px;
          .text{
            width: 5em;
          }
        }
      }
    }
  }
  >main{
    margin-top: 20px;
    overflow-x: auto;
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
      }
    }
  }
  .storehouse-stock-dialog{
    &.storehouse-stock-dialog{
      display: flex;
      flex-direction: column;
      height: 100%;
      .material-manage{
        font-size: 14px;
        p{
          padding: 0 10px;
        }
      }
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
            span{
              color: #566176;
            }
            margin-bottom: 10px;
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
              .PCS{
                width: 125px;
              }
              .el-button{
                width: 100px;
                margin: 0 20px;
              }
            }
          }
        }
        p{
          font-size: 18px;
          padding: 0 10px;
          padding-top: 15px;
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
}
</style>
