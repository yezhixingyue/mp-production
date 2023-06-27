<template>
  <div class="stock-warn-page">
    <header>
      <div class="header-top">
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
        <SearchInputComp
          :word='Data.getStockWarnData.KeyWords'
          title="关键词搜索"
          placeholder="请输入搜索关键词"
          resetWords="清空所有筛选条件"
          :changePropsFunc="(words) => Data.getStockWarnData.KeyWords = words"
          :requestFunc='getStockWarnPageList'
          @reset='clearCondition'
          >
        </SearchInputComp>
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
            ></RadioGroupComp>
        </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.StockWarnList" style="width: 100%">
          <el-table-column prop="CreateTime" label="预警时间" min-width="197">
            <template #default="scope:any">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="MaterialCode" label="SKU编码" min-width="152"/>
          <el-table-column show-overflow-tooltip prop="AttributeDescribe" label="物料" min-width="190">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="SizeDescribe" label="可选尺寸" min-width="237">
          </el-table-column>
          <el-table-column prop="WarnThreshold" label="预警数量" min-width="121">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="NoticeMobile" label="接收号码" min-width="279">
          </el-table-column>
          <el-table-column prop="RelieveTime" label="解除时间" min-width="195">
            <template #default="scope:any">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.RelieveTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="操作" label="解除方式" min-width="186">
            <template #default="scope:any">
              <span v-if="scope.row.HandleType===1" style="margin-right: 10px;">{{ scope.row.HandlerName }}</span>
              <span v-if="scope.row.HandleType===1">手动解除</span>
              <span v-if="scope.row.HandleType===2">补充库存</span>
              <span v-if="scope.row.HandleType===3">改动设置</span>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getStockWarnData.Page"
        :pageSize="Data.getStockWarnData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, computed, ComputedRef,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api';
import { MaterialTypeGroupType } from '@/store/modules/materialWarehouse/types';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getStockWarnDataType {
  TypeID:string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface MaterialAttributesType {
  MaterialID: string,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: boolean,
}
interface StockWarnListType {
  LogID: string,
  MaterialID: string,
  CategoryID: number|string,
  TypeID: string,
  SizeID: string,
  CodeID: number|string,
  MaterialCode: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeDescribe: string,
  HandleType: number| string,
  Handler: Date,
  HandlerName: string,
  StockUnit: string,
  Stock: number| string,
  WarnThreshold: number| string,
  NoticeMobile: string,
  RelieveTime: Date,
  CreateTime: Date,
  WarnStatus: number| string,
}

interface DataType {
  DataTotal: number,
  getStockWarnData: getStockWarnDataType,
  StockWarnList: StockWarnListType[]
}

export default {
  name: 'stockWarnPage',
  components: {
    RadioGroupComp,
    SearchInputComp,
    MpPagination,
    MpBreadcrumb,
  },
  setup() {
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      DataTotal: 0,
      getStockWarnData: {
        TypeID: '',
        CategoryID: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      StockWarnList: [],
    });

    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.MaterialTypeGroup]);
    const MaterialTypeList = computed(() => {
      const noType = {
        TypeID: '',
        TypeName: '全部类型',
      };
      const MaterialType = CategoryList.value.find(it => it.CategoryID === Data.getStockWarnData.CategoryID);
      if (MaterialType && MaterialType.CategoryID) {
        const temp = MaterialType as MaterialTypeGroupType;
        return [noType, ...temp.MaterialTypes] || [];
      }
      return [noType];
    });
    const BreadcrumbList = computed(() => [
      { to: { path: '/materialInventoryManage' }, name: '库存管理' },
      { name: '预警记录' },
    ]);
    function getStockWarnPageList() {
      api.getStockWarnList(Data.getStockWarnData).then(res => {
        if (res.data.Status === 1000) {
          Data.StockWarnList = res.data.Data as StockWarnListType[];
          Data.DataTotal = res.data.DataNumber;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getStockWarnData.Page === newVal) return;
      Data.getStockWarnData.Page = newVal;
      getStockWarnPageList();
    }

    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getStockWarnData.CategoryID,
      level2Val: Data.getStockWarnData.TypeID,
    }));
    // 清空筛选项
    function clearCondition() {
      Data.getStockWarnData = {
        TypeID: '',
        CategoryID: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }
    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      if (level1Val !== undefined) {
        Data.getStockWarnData.CategoryID = level1Val;
        Data.getStockWarnData.TypeID = level2Val;
        getStockWarnPageList();
      }
    }
    onMounted(() => {
      if (!MaterialWarehouseStore.MaterialTypeGroup.length) {
        MaterialWarehouseStore.getMaterialTypeGroup();
      }
      getStockWarnPageList();
    });

    return {
      BreadcrumbList,
      Data,
      CategoryList,
      MaterialTypeList,
      clearCondition,
      twoSelectChange,
      getStockWarnPageList,
      twoSelecValue,
      PaginationChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.stock-warn-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    .header-top{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .el-breadcrumb{
      line-height: 32px;
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
    justify-content: flex-end;
    align-items: center;
    .bottom-count-box{
      width: calc((100% - 100px) / 2);
      justify-content: flex-end;
      display: flex;
      align-items: center;
      min-width: 639px;
    }
    .el-button{
      width: 100px;
    }
  }
}
</style>
