<template>
  <div class="stock-warn-page">
    <header>
      <div class="header-top">
        <el-breadcrumb >
          <el-breadcrumb-item :to="{ path: '/materialInventoryManage' }">库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>预警记录</el-breadcrumb-item>
        </el-breadcrumb>
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
            ></RadioGroupComp>
        </div>
      </MpCardContainer>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.StockWarnList" style="width: 100%">
          <el-table-column prop="CreateTime" label="预警时间" min-width="197">
            <template #default="scope">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="MaterialCode" label="SKU编码" min-width="152"/>
          <el-table-column prop="AttributeDescribe" label="物料"
          show-overflow-tooltip min-width="190">
            <!-- <template #default="scope">
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
          <el-table-column prop="SizeDescribe" label="可选尺寸" min-width="237">
            <!-- <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template> -->
          </el-table-column>
          <el-table-column prop="WarnThreshold" label="预警数量" min-width="121">
            <!-- <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template> -->
          </el-table-column>
          <el-table-column prop="NoticeMobile" label="接收号码" min-width="279">
            <!-- <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template> -->
          </el-table-column>
          <el-table-column prop="RelieveTime" label="解除时间" min-width="195">
            <template #default="scope">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.RelieveTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="操作" label="解除方式" min-width="186">
            <template #default="scope">
              <span v-if="scope.row.HandleType===1">手动解除</span>
              <span v-if="scope.row.HandleType===2">补充库存</span>
              <span v-if="scope.row.HandleType===3">改动设置</span>
            </template>
          </el-table-column>
        </el-table>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
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
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api/request/MaterialStorage';
import { useRouterStore } from '@/store/modules/routerStore';

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
    MpCardContainer,
    RadioGroupComp,
    SearchInputComp,
    MpPagination,
  },
  setup() {
    const RouterStore = useRouterStore();
    const h = ref(0);
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
      ...MaterialWarehouseStore.CategoryList]);
    const MaterialTypeList = computed(() => [{ TypeID: '', TypeName: '全部类型' },
      ...MaterialWarehouseStore.MaterialTypeList]);
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.stock-warn-page header', 72);
    }
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
        setHeight();
      }
    }
    watch(() => twoSelecValue.value.level1Val, (newValue) => {
      MaterialWarehouseStore.getMaterialTypeAll({ categoryID: newValue as number });
    });

    watch(() => RouterStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      MaterialWarehouseStore.getMaterialCategoryList();
      getStockWarnPageList();
    });

    return {
      h,
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
  >header{
    padding: 20px;
    padding-bottom: 0;
    .header-top{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .el-breadcrumb{
      line-height: 32px;
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        .mp-search-input-comp{
          display: flex;
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
      width: calc((100% - 100px) / 2);
      justify-content: flex-end;
      display: flex;
      align-items: center;
    }
  }
}
</style>
