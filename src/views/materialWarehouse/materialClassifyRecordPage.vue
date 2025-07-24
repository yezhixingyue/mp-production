<template>
  <div class="material-classify-record-page">
    <header>
      <div class="header-top">
        <el-tabs type="border-card" v-model="Data.getRecordData.LogType" @tab-change="LogTypeChange">
          <el-tab-pane v-if="localPermission?.Intored" label="入库记录" :name="1"></el-tab-pane>
          <el-tab-pane v-if="localPermission?.OutStored" label="出库记录" :name="2"></el-tab-pane>
        </el-tabs>
        <!-- <el-radio-group v-model="Data.getRecordData.LogType"
        @change="LogTypeChange">
          <el-radio-button :label="1">入库记录</el-radio-button>
          <el-radio-button :label="2">出库记录</el-radio-button>
        </el-radio-group> -->
      </div>
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
            @requestFunc='()=>getRecordList()'
            ></RadioGroupComp>
        </div>
        <div class="top-main">
          <template v-if="Data.getRecordData.LogType === 2">
            <OneLevelSelect
              :title='"出库类型"'
              :options='outStorageType'
              :value='Data.getRecordData.HandleType'
              :showLine='true'
              @change="(ID) => Data.getRecordData.HandleType = ID"
              @requestFunc='()=>getRecordList()'
              ></OneLevelSelect>
          </template>
          <template v-if="Data.getRecordData.LogType === 1">
            <OneLevelSelect
              title='入库类型'
              :options='inStorageType'
              :value='Data.getRecordData.HandleType'
              :showLine='true'
              @change="(ID) => Data.getRecordData.HandleType = ID"
              @requestFunc='()=>getRecordList()'
              ></OneLevelSelect>
            <OneLevelSelect
              :title='"供应商"'
              :options='SupplierSelectList'
              :defaultProps="{
                value:'SupplierID',
                label:'SupplierName',
              }"
              :value='Data.getRecordData.SupplierID'
              :showLine='true'
              @change="(ID) => Data.getRecordData.SupplierID = ID"
              @requestFunc='()=>getRecordList()'
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
            :showLine='true'
            @change="(ID) => Data.getRecordData.Handler = ID"
            @requestFunc='()=>getRecordList()'
            ></OneLevelSelect>
          <OneLevelSelect
            :title='"操作人"'
            :options='StaffSelectList'
            :defaultProps="{
              value:'StaffID',
              label:'StaffName',
            }"
            :value='Data.getRecordData.Operater'
            :showLine='true'
            @change="(ID) => Data.getRecordData.Operater = ID"
            @requestFunc='()=>getRecordList()'
            ></OneLevelSelect>
        </div>
        <div class="top-main flex-between">
          <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='()=>getRecordList()'
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
              :requestFunc='()=>getRecordList()'
              @reset='clearCondition'
              >
            </SearchInputComp>
        </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.RecordList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="MaterialCode" label="SKU编码" min-width="115"/>
          <el-table-column
          show-overflow-tooltip prop="CategoryName" label="分类" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="TypeName" label="类型" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="AttributeDescribe" label="物料" min-width="152">
            <!-- <template #default="scope:any">
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
            </template> -->
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="SizeDescribe" label="尺寸规格" min-width="199">
          </el-table-column>
          <el-table-column prop="Stock" label="数量" min-width="158">
            <template #default="scope:any">
              {{Math.abs(scope.row.StoreNumber)}} {{scope.row.StockUnit}}
              <mp-button style="vertical-align: text-top; font-size: 12px;" link type="primary" @click="SeeGoodsAllocation(scope.row)">
                {{Data.getRecordData.LogType === 1 ? '入库货位' : '出库货位'}}
              </mp-button>
            </template>
          </el-table-column>
          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="Price" label="单价" min-width="104">
              <template #default="scope:any">
                {{scope.row.Price}}元/{{scope.row.StockUnit}}
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" min-width="112">
              <template #default="scope:any">
                {{scope.row.amount}}元
              </template>
            </el-table-column>
            <el-table-column prop="HandleType" label="入库类型" min-width="88">
              <template #default="scope:any">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>
          <template v-if="Data.getRecordData.LogType === 2">
            <el-table-column prop="HandleType" label="出库类型" min-width="88">
              <template #default="scope:any">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column
            show-overflow-tooltip prop="SupplierName" label="供应商/退料人" min-width="149">
              <template #default="scope:any">
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
              <template #default="scope:any">
                {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
              </template>
            </el-table-column>
          </template>

          <template v-if="Data.getRecordData.LogType === 2">
            <el-table-column prop="HandlerName" label="领取人" min-width="79"/>
            <el-table-column prop="OperaterName" label="操作人" min-width="79"/>
            <el-table-column
            show-overflow-tooltip prop="CreateTime" label="出库时间" min-width="158">
              <template #default="scope:any">
                {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
              </template>
            </el-table-column>
          </template>

        </el-table>
    </main>
    <footer>
      <MpPagination
      style="width: 100%;"
      spaceBetween
      :nowPage="Data.getRecordData.Page"
      :pageSize="Data.getRecordData.PageSize"
      :total="Data.DataTotal"
      :handlePageChange="PaginationChange">
        <p>
          <template  v-if="Data.getRecordData.LogType === 1">
          总金额：<span>￥{{Data.aggregateAmount}}元</span>
          </template>
        </p>
        <template v-slot:text="{total}">
          <span>共检索出</span>
          <i class="num"> {{total}} </i>
          <span>条记录</span>
          <div class="pagination-left" style="line-height: 30px; padding-left: 20px;">
            <b>总数量：</b> <span class="is-pink is-bold">{{Math.abs(Number(Data.TotalNumber))}}</span>
          </div>
        </template>
      </MpPagination>
    </footer>
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
          <p>物料：{{Data.materialManageInfo?.AttributeDescribe}}
          </p>
          <p>
            尺寸规格：{{Data.materialManageInfo?.SizeDescribe}}
          </p>
          <p>
            SKU编码：{{Data.materialManageInfo?.MaterialCode}}
          </p>
        </div>
        <el-scrollbar  max-height="350px">
          <div class="warehouse">
            <div class="warehouse-item"
            v-for="Storehouseitem in Data.StorehouseStockInfo"
            :key="Storehouseitem.StorehouseID">
              <p class="title">
                <span>
                  {{Storehouseitem.StorehouseName}}：
                  {{Data.getRecordData.LogType === 1 ? '入库' : '出库'}}
                  {{Math.abs(getStorehouseInNumber(Storehouseitem.GoodsPositionStockInfos))}}{{Data.materialManageInfo?.StockUnit}}
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
                    {{Math.abs(GoodsPosition.StoreNumber)}}{{Data.materialManageInfo?.StockUnit}}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </el-scrollbar>
            <p>合计{{Data.getRecordData.LogType === 1 ? '入库' : '出库'}}：{{Math.abs(getStorehouseAllInNumber())}}{{Data.materialManageInfo?.StockUnit}}
              （{{Math.abs(Data.materialManageInfo?.OutInNumber)}}
              {{Data.materialManageInfo?.OutInUnit}}）
            </p>
        <!-- {{Data.StorehouseStockInfo}} -->
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import {
  reactive, onMounted, computed, ComputedRef,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import ClassType from '@/store/modules/formattingTime/CommonClassType';
import { MaterialTypeGroupType } from '@/store/modules/materialWarehouse/types';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { useUserStore } from '@/store/modules/user';

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
  MaterialID: string,
  CategoryID: number,
  CategoryName: string,
  TypeID: string,
  TypeName: string,
  StockUnit: string,
  Operater: string,
  CreateTime: string,
  CodeID: number,
  MaterialCode: string,
  SizeDescribe: string,
  AttributeDescribe: string,
  SizeID: string
  OutInNumber:number,
  OutInUnit:number,
}
interface getRecordDataType {
  DateType:string
  LogType: number,
  Handler: string,
  HandleType: number|string,
  SupplierID: string,
  Operater: string,
  CreateTime: {
    First: string,
    Second: string,
  },

  TypeID:string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface RecordListType {
  LogID: string,
  MaterialID: string,
  CategoryID: number,
  CategoryName: string,
  TypeID: string,
  TypeName: string,
  LogType: number,
  Handler: string,
  HandlerName: string,
  HandleType: number,
  SupplierID: string,
  SupplierName: string,
  Stock: number,
  amount: number,
  Price: number,
  StockUnit: string,
  Operater: string,
  OperaterName: string,
  Remark: string,
  CreateTime: string|'2022-08-11T05:47:45.473Z',
  CodeID: number,
  MaterialCode: string,
  SizeDescribe: string,
  AttributeDescribe: string,
  SizeID: string
}
interface GoodsPositionStockInfosType {
  StorehouseID: string,
  PositionName: string,
  PositionID: string,
  StoreNumber: number | string,
}
interface StorehouseStockInfoType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}
interface DataType {
  StorehouseStockShow:boolean,
  DataTotal: number,
  TotalNumber: string,
  aggregateAmount: string,
  RecordList:RecordListType[],
  getRecordData: getRecordDataType,
  StorehouseStockInfo: StorehouseStockInfoType[],
  materialManageInfo: StockListType|null,
}

export default {
  name: 'materialClassifyRecordPage',
  components: {
    RadioGroupComp,
    OneLevelSelect,
    SearchInputComp,
    MpPagination,
    DialogContainerComp,
    LineDateSelectorComp,
  },
  setup() {
    const userStore = useUserStore();
    const { user } = userStore;
    const localPermission = computed(() => user?.PermissionList?.PermissionInOutStored?.Obj);

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
      // {
      //   value: 5,
      //   label: '盘库',
      // },

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
      aggregateAmount: '',
      DataTotal: 0,
      TotalNumber: '0',
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

    function getRecordList(Page = 1) {
      Data.getRecordData.Page = Page;
      ClassType.setDate(Data.getRecordData, 'CreateTime');
      const _obj = ClassType.filter(Data.getRecordData, true);

      // if (_obj.Date) {
      //   _obj.ApplyTime = _obj.Date;
      //   delete _obj.Date;
      // }

      api.getStockLogList(_obj).then(res => {
        if (res?.data?.Status === 1000) {
          Data.RecordList = res.data.Data as RecordListType[];
          Data.DataTotal = res.data.DataNumber as number;
          Data.aggregateAmount = res.data.Message as string;
          const Messages = res.data.Message.split(',');
          if (Page === 1) {
            Data.TotalNumber = Messages[1] || '0' as string;
          }
          Data.aggregateAmount = Messages[0] || '0' as string;
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
      // if (Data.getRecordData.Page === newVal) return;
      // Data.getRecordData.Page = newVal;
      getRecordList(newVal);
    }
    // 获取全部仓库的出库总数量
    function getStorehouseAllInNumber() {
      let num = 0;
      Data.StorehouseStockInfo.forEach(res => {
        res.GoodsPositionStockInfos.forEach(it => {
          num += Number(it.StoreNumber);
        });
      });
      return num;
    }
    function getStorehouseInNumber(GoodsPositionStockInfo:GoodsPositionStockInfosType[]) {
      let num = 0;
      GoodsPositionStockInfo.forEach(it => {
        num += Number(it.StoreNumber);
      });
      return num;
    }

    // 查看入库货位
    function SeeGoodsAllocation(data) {
      api.getStockLogPosition(data.LogID).then(res => {
        if (res?.data?.Status === 1000) {
          Data.StorehouseStockInfo = res.data.Data as StorehouseStockInfoType[];
          Data.materialManageInfo = { ...data };
          Data.StorehouseStockShow = true;
        }
      });
    }
    function LogTypeChange(Type) {
      Data.getRecordData.LogType = Type;
      Data.getRecordData.Handler = '';
      Data.getRecordData.Operater = '';
      Data.getRecordData.HandleType = '';
      Data.getRecordData.SupplierID = '';
      Data.getRecordData.DateType = 'today';
      Data.getRecordData.CategoryID = '';
      Data.getRecordData.TypeID = '';
      getRecordList();
    }
    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.MaterialTypeGroup]);
    const MaterialTypeList = computed(() => {
      const noType = {
        TypeID: '',
        TypeName: '全部类型',
      };
      const MaterialType = CategoryList.value.find(it => it.CategoryID === Data.getRecordData.CategoryID);
      if (MaterialType && MaterialType.CategoryID) {
        const temp = MaterialType as MaterialTypeGroupType;
        return [noType, ...temp.MaterialTypes] || [];
      }
      return [noType];
    });
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
      }
    }

    onMounted(() => {
      if (!MaterialWarehouseStore.MaterialTypeGroup.length) {
        MaterialWarehouseStore.getMaterialTypeGroup();
      }
      getRecordList();
      MaterialWarehouseStore.getSupplierSelectList();
      if (!CommonStore.StaffSelectList.length) {
        CommonStore.getStaffSelect();
      }
    });

    return {
      localPermission,
      setCondition4DataList,
      UserDefinedTimeIsActive,
      Data,
      getHandleType,
      twoSelecValue,
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
      LogTypeChange,
      MaterialWarehouseStore,
      SeeGoodsAllocation,
      getStorehouseAllInNumber,
      getStorehouseInNumber,
      format2MiddleLangTypeDateFunc2,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-classify-record-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    >.header-top{
      margin-bottom: 20px;
  > .el-tabs {
    border: none;
    .el-tabs__content{
      display: none;
    }
    > .el-tabs__header {
      background-color: rgb(245, 245, 245);
      padding-left: 30px;
      padding-top: 13px;
      .el-tabs__nav {
        margin-left: 1px;
        margin-top: 1px;
        .el-tabs__item{
          border-color: #E4E7ED;
        }
        .el-tabs__item:first-child{
          border-radius: 3px 0 0 0;
        }
        .el-tabs__item:last-child{
          border-radius: 0 3px 0 0;
        }
        > div {
          height: 38px;
          line-height: 36px;
          &.is-active {
            position: relative;
            background-color: #fff;
            border-bottom: none;
            &::before {
              content: "";
              position: absolute;
              height: 2px;
              width: calc(100%);
              background-color: rgb(38, 188, 249);
              left: 0px;
              top: -1px;
              border-radius: 2px;
            }
          }
          font-size: 13px;
          // font-weight: 600;
        }
      }
    }
  }
    }
      >.top-main{
        padding: 0 20px;
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
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
      .el-table{
        height: 100%;
        flex: 1;
      }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    p{
      font-size: 12px;
      font-weight: 600;
      padding-left: 40px;
      line-height: 36px;
      span{
        color: #FF3769;
      }
    }
  }
  .storehouse-stock-dialog{
    > p{
      font-size: 18px;
      padding: 0 10px;
      padding-top: 15px;
    }
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
        padding-right: 10px;
        .warehouse-item{
          .title{
            font-size: 20px;
            font-weight: 400;
            // line-height: 17px;
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
              min-height: 70px;
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
