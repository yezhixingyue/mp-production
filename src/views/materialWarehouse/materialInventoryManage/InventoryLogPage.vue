<template>
  <div class="inventory-log-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialInventoryManage' }">库存管理</el-breadcrumb-item>
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
            <el-radio-button :label="''">
              所有仓库
            </el-radio-button>
            <el-radio-button v-for="item in Data.StorehouseList" :key="item.StorehouseID"
            :label="item.StorehouseID">
              {{item.StorehouseName}}
            </el-radio-button>
          </el-radio-group>
        </el-scrollbar>
      </div>
        <div class="top-main flex-between">
          <LineDateSelectorComp
          :dateList="[
            { name: '不限', ID: 'all' },
            { name: '今年记录', ID: 'toYear' },
            { name: '去年记录', ID: 'lastYear' },
            { name: '前年记录', ID: 'beforeyesterYear' },
          ]"
          :changePropsFunc='setCondition4DataList'
          :requestFunc='getInventoryLogList'
          :isFull="true"
          :typeList="[['DateType', ''], ['CheckTime', 'First'], ['CheckTime', 'Second']]"
          :dateValue='Data.getInventoryLogListData.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          label="时间筛选"
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
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.InventoryLogList" style="width: 100%">
          <el-table-column prop="MaterialCode" label="时间" min-width="200">
            <template #default="scope">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="StorehouseName" label="仓库" min-width="122"/>
          <el-table-column
          show-overflow-tooltip prop="HandlerName" label="操作人" min-width="122"/>
          <el-table-column
          show-overflow-tooltip prop="HandleType" label="动作" min-width="136">
            <template #default="scope">
              <span v-if="scope.row.HandleType === 1">开始盘点</span>
              <span v-if="scope.row.HandleType === 2">修改库存</span>
              <span v-if="scope.row.HandleType === 3">修改物料</span>
              <span v-if="scope.row.HandleType === 4">登记遗漏</span>
              <span v-if="scope.row.HandleType === 49">强制结束</span>
              <span v-if="scope.row.HandleType === 50">结束盘点</span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="HandleContent" label="动作内容" min-width="400">
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="Remark" label="备注" min-width="200"/>

        </el-table>
    </main>
    <footer>
      <!-- <el-button type="primary" @click="saveGenerativeRule">保存</el-button> -->
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getInventoryLogListData.Page"
        :pageSize="Data.getInventoryLogListData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import {
  reactive, onMounted, computed,
} from 'vue';
import { useRouterStore } from '@/store/modules/routerStore';
import api from '@/api/request/MaterialStorage';
import ClassType from '@/store/modules/formattingTime/CommonClassType';

interface getInventoryLogListDataType {
  DateType:string

  StorehouseID: string,
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
  LogID: string,
  InventoryID: string,
  StorehouseID: string,
  StorehouseName: string,
  HandleType: number,
  HandleContent: string,
  Remark: string,
  Handler: string,
  HandlerName: string,
  CreateTime: Date
}

interface StorehouseType {
  StorehouseID: string,
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
    OneLevelSelect,
    SearchInputComp,
    MpPagination,
    LineDateSelectorComp,
  },
  setup() {
    const RouterStore = useRouterStore();
    // 入库类型
    const Data:DataType = reactive({
      DataTotal: 0,
      InventoryLogList: [],
      getInventoryLogListData: {
        DateType: 'all',

        StorehouseID: '',
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
      if (key2) Data.getInventoryLogListData[key1][key2] = value;
      else Data.getInventoryLogListData[key1] = value;
    }

    const UserDefinedTimeIsActive = computed(() => Data.getInventoryLogListData.DateType === ''
      && !!Data.getInventoryLogListData.CheckTime.First
      && !!Data.getInventoryLogListData.CheckTime.Second);

    const StaffSelectList = computed(() => [{
      StaffID: '',
      StaffName: '不限',
    }, ...RouterStore.StaffSelectList]);

    function getInventoryLogList() {
      ClassType.setDate(Data.getInventoryLogListData, 'CheckTime');
      const _obj = ClassType.filter(Data.getInventoryLogListData, true);

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

    function radioGroupChange(StorehouseID) {
      Data.getInventoryLogListData.StorehouseID = StorehouseID;
      getInventoryLogList();
    }

    // 清空筛选项
    function clearCondition() {
      Data.getInventoryLogListData = {
        DateType: 'today',

        StorehouseID: '',
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
          cb();
        }
      });
    }

    onMounted(() => {
      getStorehouseAll(getInventoryLogList);
      RouterStore.getStaffSelect();
    });

    return {
      setCondition4DataList,
      UserDefinedTimeIsActive,

      Data,
      RouterStore,
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
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    padding-bottom: 0px;
    background-color: #fff;
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
      .el-radio-group{
        width: 100%;
        flex-wrap: nowrap;
        // padding-bottom: 8px;
      }
    }
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
    min-height: 50px;
    background-color: #fff;
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
