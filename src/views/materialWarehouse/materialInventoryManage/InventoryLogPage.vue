<template>
  <div class="inventory-log-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialManage' }">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/inventory' }">库存盘点</el-breadcrumb-item>
        <el-breadcrumb-item>盘点记录</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <!-- <el-radio-group v-model="Data.getInventoryLogListData.StorehouseID"
        @change="radioGroupChange">
          <el-radio-button :label="item.StorehouseID"
          v-for="item in Data.StorehouseList" :key="item.StorehouseID">
          {{item.StorehouseName}}
          </el-radio-button>
        </el-radio-group> -->
        <el-scrollbar>
          <el-radio-group @change="getInventoryLogList"
          v-model="Data.getInventoryLogListData.StorehouseID">
            <el-radio-button v-for="item in Data.StorehouseList" :key="item.StorehouseID"
            :label="item.StorehouseID">
              {{item.StorehouseName}}
            </el-radio-button>
          </el-radio-group>
        </el-scrollbar>
      </div>
      <MpCardContainer :TopAndButtomPadding = '12'>
        <div class="top-main">

        </div>
        <div class="top-main flex-between">
          <LineDateSelectorComp
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getInventoryLogList'
          :isFull="true"
          :typeList="[['DateType', ''], ['CheckTime', 'First'], ['CheckTime', 'Second']]"
          :dateValue='Data.getInventoryLogListData.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="申请时间"
          >
          <!-- :dateList="dateList" -->
          </LineDateSelectorComp>
          <OneLevelSelect
            :title='"操作人"'
            :options='StaffSelectList'
            :defaultProps="{
              value:'StaffID',
              label:'StaffName',
            }"
            :value='Data.getInventoryLogListData.Handler'
            @change="(ID) => Data.getInventoryLogListData.Handler = ID"
            @requestFunc='getInventoryLogList'
            ></OneLevelSelect>
            <SearchInputComp
              :word='Data.getInventoryLogListData.KeyWords'
              title="关键词搜索"
              placeholder="请输入搜索关键词"
              resetWords="清空所有筛选条件"
              :changePropsFunc="(words) => Data.getInventoryLogListData.KeyWords = words"
              :requestFunc='getInventoryLogList'
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
          <el-table-column prop="MaterialCode" label="SKU编码" min-width="115"/>
          <el-table-column
          show-overflow-tooltip prop="CategoryName" label="分类" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="TypeName" label="类型" min-width="66"/>
          <el-table-column
          show-overflow-tooltip prop="物料" label="物料" min-width="152">
            <template #default="scope">
              <template v-for="(item, index) in scope.row.MaterialAttributes"
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
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="SizeDescribe" label="尺寸规格" min-width="199">
          </el-table-column>
          <el-table-column prop="Stock" label="数量" min-width="158"/>

          <template v-if="Data.getInventoryLogListData.LogType === 1">
            <el-table-column prop="Price" label="单价" min-width="104"/>
            <el-table-column prop="amount" label="金额" min-width="112"/>
            <el-table-column prop="HandleType" label="入库类型" min-width="88">
              <template #default="scope">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>
          <template v-if="Data.getInventoryLogListData.LogType === 2">
            <el-table-column prop="HandleType" label="出库类型" min-width="88">
              <template #default="scope">
                {{getHandleType(scope.row.HandleType)}}
              </template>
            </el-table-column>
          </template>

          <template v-if="Data.getInventoryLogListData.LogType === 1">
            <el-table-column
            show-overflow-tooltip prop="SupplierName" label="供应商/退料人" min-width="149">
              <template #default="scope">
                {{scope.row.SupplierName}}{{scope.row.HandlerName}}
              </template>
            </el-table-column>
          </template>

          <el-table-column
          show-overflow-tooltip prop="Remark" label="备注" min-width="118"/>

          <template v-if="Data.getInventoryLogListData.LogType === 1">
            <el-table-column prop="OperaterName" label="操作人" min-width="79"/>
            <el-table-column
            show-overflow-tooltip prop="CreateTime" label="入库时间" min-width="158"/>
          </template>

          <template v-if="Data.getInventoryLogListData.LogType === 2">
            <el-table-column prop="HandlerName" label="领取人" min-width="79"/>
            <el-table-column prop="OperaterName" label="操作人" min-width="79"/>
            <el-table-column
            show-overflow-tooltip prop="CreateTime" label="出库时间" min-width="158"/>
          </template>

        </el-table>
        <div>
          <MpPagination
          :nowPage="Data.getInventoryLogListData.Page"
          :pageSize="Data.getInventoryLogListData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange"
          />
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <!-- <el-button type="primary" @click="saveGenerativeRule">保存</el-button> -->
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef, nextTick, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useCommonStore } from '@/store/modules/common';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import ClassType from '@/store/modules/formattingTime/CommonClassType';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getInventoryLogListDataType {
  DateType:string

  StorehouseID: number|string,
  Handler: string | '00000000-0000-0000-0000-000000000000',
  Page:number,
  KeyWords: string,
  PageSize:number,
  CheckTime: {
    First: string | '2022-08-11T05:47:45.475Z',
    Second: string | '2022-08-11T05:47:45.475Z',
  },
}
interface InventoryLogListType {
  LogID: number,
  InventoryID: number,
  StorehouseID: number,
  StorehouseName: string,
  HandleType: number,
  HandleContent: string,
  Remark: string,
  Handler: string,
  HandlerName: string,
  CreateTime: Date
}

interface StorehouseType {
  StorehouseID: number,
  StorehouseName: string,
}
interface DataType {
  DataTotal: number,
  InventoryLogList:InventoryLogListType[],
  getInventoryLogListData: getInventoryLogListDataType,
  StorehouseList:StorehouseType[]
}

export default {
  name: 'InventoryLogPage',
  components: {
    MpCardContainer,
    OneLevelSelect,
    SearchInputComp,
    MpPagination,
    LineDateSelectorComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    // 入库类型
    const Data:DataType = reactive({
      DataTotal: 0,
      InventoryLogList: [],
      getInventoryLogListData: {
        DateType: 'today',

        StorehouseID: 0,
        Handler: '',
        CheckTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        KeyWords: '',
        PageSize: 20,
        Order: {
          First: '',
          Second: 0,
        },
      },
      StorehouseList: [],
    });

    function setCondition4DataList([[key1, key2], value]) {
      console.log([[key1, key2], value], '[[key1, key2], value]');

      if (key2) Data.getInventoryLogListData[key1][key2] = value;
      else Data.getInventoryLogListData[key1] = value;
    }

    const UserDefinedTimeIsActive = computed(() => Data.getInventoryLogListData.DateType === ''
      && !!Data.getInventoryLogListData.CheckTime.First
      && !!Data.getInventoryLogListData.CheckTime.Second);

    const StaffSelectList = computed(() => [{
      StaffID: '',
      StaffName: '不限',
    }, ...CommonStore.StaffSelectList]);

    function getInventoryLogList() {
      console.log(ClassType, 'aaaaaaaaaaa');

      ClassType.setDate(Data.getInventoryLogListData, 'CheckTime');
      const _obj = ClassType.filter(Data.getInventoryLogListData, true);
      console.log(_obj);

      // if (_obj.Date) {
      //   _obj.ApplyTime = _obj.Date;
      //   delete _obj.Date;
      // }

      api.getInventoryLogList(_obj).then(res => {
        if (res.data.Status === 1000) {
          Data.InventoryLogList = res.data.Data as InventoryLogListType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }

    function PaginationChange(newVal) {
      if (Data.getInventoryLogListData.Page === newVal) return;
      Data.getInventoryLogListData.Page = newVal;
      getInventoryLogList();
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.inventory-log-page header', 72);
    }
    function radioGroupChange(StorehouseID) {
      Data.getInventoryLogListData.StorehouseID = StorehouseID;
      getInventoryLogList();
    }

    // 清空筛选项
    function clearCondition() {
      Data.getInventoryLogListData = {
        DateType: 'today',

        StorehouseID: 0,
        Handler: '',
        CheckTime: {
          First: '',
          Second: '',
        },
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }
    // 获取仓库列表
    function getStorehouseAll(cb) {
      api.getStorehouseAll().then(res => {
        if (res.data.Status === 1000) {
          Data.StorehouseList = res.data.Data as StorehouseType[];
          Data.getInventoryLogListData.StorehouseID = Data.StorehouseList[0].StorehouseID;
          cb();
          nextTick(() => {
            setHeight();
          });
        }
      });
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      getStorehouseAll(getInventoryLogList);
      CommonStore.getStaffSelect();
    });

    return {
      setCondition4DataList,
      UserDefinedTimeIsActive,

      h,
      Data,
      CommonStore,
      StaffSelectList,
      PaginationChange,
      getInventoryLogList,
      clearCondition,
      radioGroupChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.inventory-log-page{
  >header{
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
      .el-radio-group{
        width: 100%;
        flex-wrap: nowrap;
        padding-bottom: 8px;
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
  >footer{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
