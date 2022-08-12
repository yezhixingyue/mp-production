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
          <TowLevelSelect
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
            ></TowLevelSelect>
          <OneLevelSelect
            :title='"入库类型"'
            :options='StorageType'
            :value='Data.getRecordData.HandleType'
            @change="(ID) => Data.getRecordData.HandleType = ID"
            @requestFunc='getRecordList'
            ></OneLevelSelect>
          <OneLevelSelect
            :title='"供应商"'
            :options='Data.SupplierSelect'
            :defaultProps="{
              value:'SupplierID',
              label:'SupplierName',
            }"
            :value='Data.getRecordData.SupplierID'
            @change="(ID) => Data.getRecordData.SupplierID = ID"
            @requestFunc='getRecordList'
            ></OneLevelSelect>
          <OneLevelSelect
            :title='"退料人"'
            :options='CategoryList'
            :defaultProps="{
              value:'CategoryID',
              label:'CategoryName',
            }"
            :value='Data.getRecordData.Handler'
            @change="(ID) => Data.getRecordData.Handler = ID"
            ></OneLevelSelect>
          <OneLevelSelect
            :title='"操作人"'
            :options='CategoryList'
            :defaultProps="{
              value:'CategoryID',
              label:'CategoryName',
            }"
            :value='Data.getRecordData.Operater'
            @change="(ID) => Data.getRecordData.Operater = ID"
            ></OneLevelSelect>
        </div>
        <div class="top-main">
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
          <el-table-column prop="CategoryName" label="SKU编码" min-width="115"/>
          <el-table-column prop="TypeName" label="分类" min-width="66"/>
          <el-table-column prop="物料" label="物料" min-width="152">
            <template #default>
                物料
              </template>
          </el-table-column>
          <el-table-column prop="可选尺寸" label="尺寸规格" min-width="199">
            <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="TypeName" label="数量" min-width="158"/>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="TypeName" label="单价" min-width="104"/>
            <el-table-column prop="TypeName" label="金额" min-width="112"/>
          </template>

          <el-table-column prop="TypeName" label="类型" min-width="66"/>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="TypeName" label="供应商/退料人" min-width="149"/>
          </template>

          <el-table-column prop="TypeName" label="备注" min-width="118"/>

          <template v-if="Data.getRecordData.LogType === 1">
            <el-table-column prop="TypeName" label="操作人" min-width="79"/>
          </template>

          <el-table-column prop="TypeName" label="操作人" min-width="79"/>
          <el-table-column prop="TypeName" label="入库时间" min-width="158"/>
          <el-table-column prop="TypeName" label="出库时间" min-width="158"/>
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
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getRecordDataType {
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
interface SupplierSelectType {
  SupplierID:number,
  SupplierName:string,
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

interface DataType {
  addMaterialManageShow:boolean,
  DataTotal: number,
  SupplierSelect:SupplierSelectType[],
  RecordList:RecordListType[],
  getRecordData: getRecordDataType,
}

export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    TowLevelSelect,
    OneLevelSelect,
    SearchInputComp,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    // 入库类型
    const StorageType = [
      {
        value: '',
        label: '不限',
      },
      {
        value: '',
        label: '采购',
      },
      {
        value: '',
        label: '退料',
      },
      {
        value: '',
        label: '赠送',
      },
      {
        value: '',
        label: '成品',
      },
    ];
    const Data:DataType = reactive({
      addMaterialManageShow: false,
      DataTotal: 0,
      SupplierSelect: [],
      RecordList: [],
      getRecordData: {
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
    });
    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getRecordData.CategoryID,
      level2Val: Data.getRecordData.TypeID,
    }));

    function getRecordList() {
      api.getStockLogList(Data.getRecordData).then(res => {
        if (res.data.Status === 1000) {
          Data.RecordList = res.data.Data as RecordListType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getRecordData.Page === newVal) return;
      Data.getRecordData.Page = newVal;
      getRecordList();
    }

    function radioGroupChange(Type) {
      Data.getRecordData.LogType = Type;
      getRecordList();
    }
    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '不限' },
      ...MaterialWarehouseStore.CategoryList]);
    const MaterialTypeList = computed(() => [{ TypeID: '', TypeName: '不限' },
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

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-classify-record-page header', 20);
      console.log(h.value);
      window.onresize = () => {
        h.value = getHeight('.material-classify-record-page header', 20);
      };
    }
    function twoSelectChange(levelData) {
      console.log(levelData, 'levelData');

      const { level1Val, level2Val } = levelData;
      Data.getRecordData.CategoryID = level1Val;
      Data.getRecordData.TypeID = level2Val;
    }
    watch(() => twoSelecValue.value.level1Val, (newValue) => {
      MaterialWarehouseStore.getMaterialTypeAll(newValue as number);
    });

    onMounted(() => {
      setHeight();
      MaterialWarehouseStore.getMaterialCategoryList();
      getRecordList();
      api.getMaterialSupplierSelect().then(res => {
        if (res.data.Status === 1000) {
          Data.SupplierSelect = res.data.Data as SupplierSelectType[];
        }
      });
    });

    return {
      h,
      Data,
      twoSelecValue,
      StorageType,
      CategoryList,
      MaterialTypeList,
      PaginationChange,
      twoSelectChange,
      getRecordList,
      clearCondition,
      radioGroupChange,
      addMaterialManagePrimaryClick,
      addMaterialManageCloseClick,
      addMaterialManageClosed,
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
}
</style>
