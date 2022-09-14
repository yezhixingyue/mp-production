<template>
  <div class="stock-list-page">
    <header>
      <div class="header-top">
        <div class="btns">
          <el-button @click="ToOutDelivery" type="primary">出库</el-button>
          <el-button @click="ToInDelivery" type="danger">入库</el-button>
          <el-button link type="primary" @click="ToStockWarnPage">
            <i class="iconfont icon-zengsongjilu"></i> 预警记录</el-button>
          <el-button link type="primary" @click="ToInventoryPage">
            <i class="iconfont icon-kucunpandian-"></i>
            库存盘点</el-button>
          <el-button link type="primary" @click="seeSMSShow">查看短信(仅测试用)</el-button>
          <!-- <el-button>仅显示预警中物料</el-button> -->
          <p>
            <el-checkbox @change="getStockList"
            v-model="Data.getStockData.IsWarn" label="仅显示预警中物料" size="large" />
          </p>
        </div>
          <SearchInputComp
            :word='Data.getStockData.KeyWords'
            title="关键词搜索"
            placeholder="请输入搜索关键词"
            resetWords="清空所有筛选条件"
            :changePropsFunc="(words) => Data.getStockData.KeyWords = words"
            :requestFunc='getStockList'
            @reset='clearCondition'
            >
          </SearchInputComp>
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
            @requestFunc='getStockList'
            ></RadioGroupComp>

        </div>
      </MpCardContainer>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.StockList" style="width: 100%">

          <el-table-column
          show-overflow-tooltip prop="MaterialCode" label="SKU编码" min-width="132"/>
          <el-table-column
          show-overflow-tooltip prop="CategoryName" label="分类" min-width="84"/>
          <el-table-column
          show-overflow-tooltip prop="TypeName" label="类型" min-width="97"/>
          <el-table-column
          show-overflow-tooltip prop="AttributeDescribe" label="物料" min-width="170">
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
          show-overflow-tooltip prop="SizeDescribe" label="尺寸规格" min-width="217">
            <!-- <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template> -->
          </el-table-column>
          <el-table-column prop="TotalStock" label="当前库存" min-width="145">
            <template #default="scope">
              <template v-if="scope.row.TotalStock">
                {{scope.row.TotalStock}}
                {{scope.row.StockUnit}}
                <el-button link type="primary" :disabled="!scope.row.TotalStock"
                @click="SeeGoodsAllocation(scope.row)">货位</el-button>
              </template>
              <template v-else>
                暂无库存
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="WarnThreshold" label="预警阀值" min-width="103">
            <template #default="scope">
              <template v-if="scope.row.WarnThreshold">
                {{scope.row.WarnThreshold}}
                {{scope.row.StockUnit}}
              </template>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="NoticeMobile" label="接收号码" min-width="259"/>
          <el-table-column label="预警状态" min-width="196">
            <template #default="scope">
              <span style="padding:0 5px;color:#FF3769" v-if="scope.row.IsWarn">预警中</span>
              <el-button v-if="scope.row.IsOpenWarn" type="primary"
              style="margin-left:10px"
              link @click="CancelSMSWarnClick(scope.row)">解除短信预警</el-button>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="物料" label="操作" min-width="138">
            <template #default="scope">
              <el-button
              type="primary"
              link @click="SetSMSWarnClick(scope.row)">
              <i class="iconfont icon-xiangmuyujingshezhi" style="font-size:16px"></i>
              设置预警</el-button>
            </template>
          </el-table-column>
        </el-table>
      </MpCardContainer>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getStockData.Page"
        :pageSize="Data.getStockData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
    <!-- 设置库存预警 -->
    <DialogContainerComp
    title="预警短信"
    :visible='Data.seeSMSShow'
    :showPrimary="false"
    :closeClick="() => Data.seeSMSShow = false"
    :width="900"
    >
    <template #default>
      <div class="set-sms-marn-dialog">
        <p v-for="item in Data.SMSList" :key="item">
          物料：{{item.Material}}；库存：{{item.Stock}}{{item.StockUnit}}; 电话：{{item.Mobiles.join(',')}}
        </p>
        <span v-if="!Data.SMSList.length">无短信</span>
      </div>
    </template>
    </DialogContainerComp>

    <!-- 设置库存预警 -->
    <DialogContainerComp
    title="设置库存预警"
    :visible='Data.SetSMSWarnShow'
    :width="660"
    :primaryClick="SetSMSWarnPrimaryClick"
    :closeClick="SetSMSWarnCloseClick"
    :closed="SetSMSWarnClosed"
    >
    <template #default>
      <div class="set-sms-marn-dialog">
        <el-form :model="Data.SetSMSWarnForm" label-width="120px">
          <el-form-item :label="`设置物料：`">
            <div>
              <template v-for="(item, index) in Data.SetSMSWarnForm.StockName"
              :key="item.AttributeID">
                <template v-if="item.NumericValue">
                  <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                </template>
                <template v-else>
                  <span>{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === Data.SetSMSWarnForm.StockName.length-1 ? ' ' : ' ' }}
                </template>
              </template>
            </div>
          </el-form-item>
          <el-form-item :label="`预警阈值：`">
            <el-input
            style="width:100px; margin-right:10px"
            maxlength="6"
            v-model="Data.SetSMSWarnForm.WarnThreshold" /> {{Data.SetSMSWarnForm.StockUnit}}
          </el-form-item>
          <el-form-item :label="`接收手机号码：`">
            <el-input v-model="Data.SetSMSWarnForm.NoticeMobile" />
            <p class="hint">多个手机号码使用空格分开</p>
          </el-form-item>
          <div class="explain">
            <p>说明：不需要预警时请将所有输入框置空；
            </p>
            <p>
              当库存小于等于设置阈值时，会向此处填写的所有接收手机号码发送短信预警，发送短信频率为每日 8:00-22:00，每30分钟发送一次短信，直至库存超过阈值，或者手动解除预警。
            </p>
          </div>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <!-- 仓库货位信息 -->
    <DialogContainerComp
    title="仓库货位信息"
    :visible='Data.StorehouseStockShow'
    :width="660"
    :primaryClick="StorehouseStockPrimaryClick"
    :closeClick="StorehouseStockCloseClick"
    :primaryText="'出库'"
    :closeBtnText="'关闭'"
    >
    <template #default>
      <div class="storehouse-stock-dialog">
        <div class="material-manage">
          <p>
            物料：<template v-for="(item, index) in Data.materialManageInfo.MaterialAttributes"
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
                  {{getStorehouseStockNumber()}}{{Data.materialManageInfo.StockUnit}}
                </span>
                <span>
                  <el-button type="primary" link
                   @click="SeeImg(Storehouseitem.StorehouseImg)">查看平面布局图</el-button>
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
                    {{GoodsPosition.Number}}
                    {{Data.materialManageInfo.StockUnit}}
                  </span>
                </li>
                <!-- <li>
                  <span class="ranks">
                    A区 001柜 3行 2列
                  </span>
                  <span class="PCS">
                    5112300张
                  </span>
                </li>
                <li>
                  <span class="ranks">
                    A区 001柜 3行 2列
                  </span>
                  <span class="PCS">
                    5112300张
                  </span>
                </li> -->
              </ul>
            </div>
          </div>
        </el-scrollbar>
        <!-- {{Data.StorehouseStockInfo}} -->
      </div>
    </template>
    </DialogContainerComp>
    <SeeImageDialogComp
    title="仓库货位平面图"
    :visible='Data.SeeImageShow'
    :imgUrl="Data.SeeImageUrl"
    :closeClick="() => Data.SeeImageShow = false"
    >
    </SeeImageDialogComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';
import api from '@/api/request/MaterialStorage';
import { useRouter } from 'vue-router';
import { useCommonStore } from '@/store/modules/common';
import { MaterialAttributesType } from '@/assets/Types/common';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getStockDataType {
  IsWarn: boolean,

  TypeID:string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface SetSMSWarnFormType {
  StockName:string,
  MaterialID: string,
  WarnThreshold: number|string,
  NoticeMobile: string
  StockUnit: string
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
  Operater: string|'00000000-0000-0000-0000-000000000000',
  CreateTime: string|'2022-08-11T05:47:45.473Z',
  CodeID: number,
  MaterialCode: string,
  SizeDescribe: string,
  AttributeDescribe: string,
  SizeID: string
  MaterialAttributes:MaterialAttributesType[]
}

interface GoodsPositionStockInfosType {
  StorehouseID: string,
  PositionName: string,
  PositionID: string,
  Number: number | string,
}
interface StorehouseStockInfoType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
  GoodsPositionStockInfos: GoodsPositionStockInfosType[],
}
interface DataType {

  seeSMSShow:any,
  SMSList:any,

  SetSMSWarnShow:boolean,
  StorehouseStockShow:boolean,
  SeeImageShow:boolean,
  SeeImageUrl:string,
  DataTotal: number,
  StockList:StockListType[],
  getStockData: getStockDataType,
  SetSMSWarnForm: SetSMSWarnFormType,
  StorehouseStockInfo:StorehouseStockInfoType[]
  materialManageInfo:StockListType|null
}

export default {
  name: 'materialInventoryManagePage',
  components: {
    MpCardContainer,
    RadioGroupComp,
    SearchInputComp,
    MpPagination,
    DialogContainerComp,
    SeeImageDialogComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({

      seeSMSShow: false,
      SMSList: [],

      SetSMSWarnShow: false,
      StorehouseStockShow: false,
      SeeImageShow: false,
      SeeImageUrl: '',
      DataTotal: 0,
      SupplierSelect: [],
      StockList: [],
      getStockData: {
        TypeID: '',
        CategoryID: '',
        IsWarn: false,
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      SetSMSWarnForm: {
        StockName: '',
        MaterialID: '',
        WarnThreshold: '',
        NoticeMobile: '',
        StockUnit: '',
      },

      // 仓库货位信息
      StorehouseStockInfo: [],
      materialManageInfo: null,
    });
    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getStockData.CategoryID,
      level2Val: Data.getStockData.TypeID,
    }));
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.stock-list-page header', 72);
    }
    function getStockList() {
      api.getStockList(Data.getStockData).then(res => {
        if (res.data.Status === 1000) {
          Data.StockList = res.data.Data as StockListType[];
          Data.DataTotal = res.data.DataNumber as number;
          setHeight();
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getStockData.Page === newVal) return;
      Data.getStockData.Page = newVal;
      getStockList();
    }
    function ToOutDelivery(materialManageInfo) {
      // const routeData = router.resolve({
      //   name: 'outDelivery',
      // });
      const routeData = router.resolve({
        name: 'outDelivery',
        query: { MaterialCode: JSON.stringify(materialManageInfo.MaterialCode || null) },
      });
      window.open(routeData.href, '_blank');
    }
    function ToInDelivery() {
      const routeData = router.resolve({
        name: 'inDelivery',
      });
      window.open(routeData.href, '_blank');
    }
    function ToStockWarnPage() {
      router.push({
        name: 'stockWarn',
      });
    }
    function ToInventoryPage() {
      router.push({
        name: 'inventory',
      });
    }
    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.CategoryList]);
    const MaterialTypeList = computed(() => [{ TypeID: '', TypeName: '全部类型' },
      ...MaterialWarehouseStore.MaterialTypeList]);

    function SeeImg(url) {
      Data.SeeImageShow = true;
      Data.SeeImageUrl = url;
    }
    function seeSMSShow() {
      Data.seeSMSShow = true;
      // 获取所有短信
      api.getIStockSMSList({}).then(res => {
        if (res.data.Status === 1000) {
          Data.SMSList = res.data.Data;
        }
      });
    }
    // 获取仓库的入库总数量
    function getStorehouseStockNumber() {
      let num = 0;
      Data.StorehouseStockInfo.forEach(item => {
        item.GoodsPositionStockInfos.forEach(it => {
          num += Number(it.Number) || 0;
        });
      });
      return num;
    }
    function SetSMSWarnCloseClick() {
      // 关闭得时候清空弹框
      Data.SetSMSWarnShow = false;
    }

    function SetSMSWarnClosed() {
      Data.SetSMSWarnForm = {
        StockName: '',
        MaterialID: '',
        WarnThreshold: '',
        NoticeMobile: '',
        StockUnit: '',
      };
    }
    // 货位弹框
    function StorehouseStockCloseClick() {
      // 关闭得时候清空弹框
      Data.StorehouseStockShow = false;
    }

    function SeeGoodsAllocation(data) {
      api.getStorehouseStock(data.MaterialID).then(res => {
        if (res.data.Status === 1000) {
          Data.StorehouseStockInfo = res.data.Data as StorehouseStockInfoType[];
          Data.materialManageInfo = { ...data };
          Data.StorehouseStockShow = true;
        }
      });
    }
    function SetSMSWarnPrimaryClick() {
      api.getStockSetSMSWarn(Data.SetSMSWarnForm).then(res => {
        if (res.data.Status === 1000) {
          getStockList();
          // 设置成功
          SetSMSWarnCloseClick();
        }
      });
    }
    // 货位弹框
    function StorehouseStockPrimaryClick() {
      if (!Data.materialManageInfo) return;
      // 出库
      ToOutDelivery(Data.materialManageInfo);
    }
    // 清空筛选项
    function clearCondition() {
      Data.getStockData = {
        TypeID: '',
        CategoryID: 0,
        IsWarn: true,
        Page: 0,
        KeyWords: '',
        PageSize: 0,
      };
    }

    function SetSMSWarnClick(item) {
      Data.SetSMSWarnForm.StockName = item.MaterialAttributes;
      Data.SetSMSWarnForm.MaterialID = item.MaterialID;
      Data.SetSMSWarnForm.WarnThreshold = item.WarnThreshold;
      Data.SetSMSWarnForm.NoticeMobile = item.NoticeMobile;
      Data.SetSMSWarnForm.StockUnit = item.StockUnit;
      Data.SetSMSWarnShow = true;
    }
    function CancelSMSWarnClick(item) {
      api.getStockCancelSMSWarn(item.MaterialID).then(res => {
        if (res.data.Status === 1000) {
          // 解除成功
          getStockList();
        }
      });
    }

    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      if (level1Val !== undefined) {
        Data.getStockData.CategoryID = level1Val;
        Data.getStockData.TypeID = level2Val;
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
      getStockList();
    });

    return {
      seeSMSShow,

      h,
      Data,
      SeeImg,
      getStorehouseStockNumber,
      ToOutDelivery,
      ToInDelivery,
      ToStockWarnPage,
      ToInventoryPage,
      twoSelecValue,
      CategoryList,
      MaterialTypeList,
      PaginationChange,
      twoSelectChange,
      getStockList,
      clearCondition,
      SetSMSWarnClick,
      CancelSMSWarnClick,
      SetSMSWarnCloseClick,
      SetSMSWarnClosed,
      SetSMSWarnPrimaryClick,
      StorehouseStockCloseClick,
      StorehouseStockPrimaryClick,
      SeeGoodsAllocation,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.stock-list-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
    >.header-top{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      .el-radio-group{
        margin-bottom: 0;
      }
      .btns{
        display: flex;
        flex: 1;
        .el-button{
          width: 100px;
        }
        .iconfont{
          font-size: 14px;
        }
        p{
          display: flex;
          margin-left: 26px;
        }
      }
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
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
      }
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .bottom-count-box{
      display: flex;
      align-items: center;
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
            >span{
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
  .set-sms-marn-dialog{
      padding: 0 25px;
      .hint, .explain{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 7px;
        }
      }
  }
}
</style>
