<template>
  <div class="inventory-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialManage' }">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="ToInventoryLogPage">查看盘点记录</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.InventoryList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="StorehouseName" label="仓库" min-width="215" />
          <el-table-column
          show-overflow-tooltip prop="LastInventoryStatus" label="上次盘点状态" min-width="271">
            <template #default="scope">
              <span v-if="scope.LastInventoryStatus=== 1">--{{scope.LastInventoryStatus}}--</span>
              <span v-if="scope.LastInventoryStatus=== 50">完成</span>
              <span v-if="scope.LastInventoryStatus=== 1">强制 = 完成</span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="LastInventoryStartTime" label="上次盘点开始时间" min-width="299" />
          <el-table-column
          show-overflow-tooltip prop="LastInventoryEndTime" label="上次盘点结束时间" min-width="299">
          </el-table-column>
          <el-table-column prop="HandlerName" label="操作人"
          show-overflow-tooltip min-width="229" />
          <el-table-column prop="name" label="操作" min-width="243">
            <template #default="scope">
              <el-button type="primary" v-if="scope.row.LastInventoryStatus === 1"
              link @click="ToMakeAnInventory(scope.row)">
                <i class="iconfont icon-bianji"></i>继续盘点</el-button>
              <el-button type="primary" v-else link @click="beginInventory(scope.row)">
                <i class="iconfont icon-bianji"></i>开始盘点</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <MpPagination
          :nowPage="Data.getInventoryListData.Page"
          :pageSize="Data.getInventoryListData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange"/>
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
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, computed, watch, onActivated,
} from 'vue';
import { useRouter } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { useCommonStore } from '@/store/modules/common';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface getInventoryListDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface InventoryListType {
  StorehouseID: number,
  StorehouseName: string,
  LastInventoryStatus: number,
  LastHandler: string,
  HandlerName: string,
  LastInventoryStartTime: Date,
  LastInventoryEndTime: Date,
}

interface DataType {
  DataTotal: number,
  getInventoryListData:getInventoryListDataType,
  InventoryList:InventoryListType[],
}
export default {
  components: {
    MpCardContainer,
    MpPagination,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const router = useRouter();

    const Data:DataType = reactive({
      DataTotal: 0,
      getInventoryListData: {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      InventoryList: [],
    });

    function getInventoryList() {
      api.getInventoryList(Data.getInventoryListData).then(res => {
        if (res.data.Status === 1000) {
          Data.InventoryList = res.data.Data as InventoryListType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getInventoryListData.Page === newVal) return;
      Data.getInventoryListData.Page = newVal;
      getInventoryList();
    }
    function ToInventoryLogPage() {
      router.push({
        name: 'inventoryLog',
      });
    }
    function ToMakeAnInventory(item) {
      localStorage.setItem('DetailID', item.DetailID);
      localStorage.setItem('StorehouseName', item.StorehouseName);
      const routeData = router.resolve({
        name: 'makeAnInventory',
      });
      window.open(routeData.href, '_blank');
    }
    function beginInventory(item) {
      messageBox.warnCancelNullMsg(`确定要开始盘点“${item.StorehouseName}”吗？`, () => {
        api.getInventoryStart(item.StorehouseID).then(res => {
          if (res.data.Status === 1000) {
            ToMakeAnInventory({
              DetailID: res.data.Data,
              StorehouseName: item.StorehouseName,
            });
          }
        });
      }, () => null);
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.inventory-page > header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      getInventoryList();
    });
    return {
      h,
      Data,
      beginInventory,
      ToMakeAnInventory,
      ToInventoryLogPage,
      PaginationChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.inventory-page{
  >header{
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
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
        max-height: calc(100% - 21px);
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
  .add-material-supplier-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
    .material-type{
      padding: 0 36px;
      p{
        line-height: 32px;
      }
      .el-checkbox-group{
        display: flex;
        flex-wrap: wrap;
        .el-checkbox{
          width: 25%;
          margin: 0;
        }
      }
    }
  }
}
</style>