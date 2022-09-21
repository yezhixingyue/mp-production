<template>
  <div class="inventory-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialInventoryManage' }">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="ToInventoryLogPage">查看盘点记录</mp-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.InventoryList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="StorehouseName" label="仓库" min-width="215" />
          <el-table-column
          show-overflow-tooltip prop="LastInventoryStatus" label="上次盘点状态" min-width="271">
            <template #default="scope">
              <span v-if="scope.row.LastInventoryStatus=== 1">盘库中</span>
              <span v-if="scope.row.LastInventoryStatus=== 50" style="color:#428DFA">完成</span>
              <span v-if="scope.row.LastInventoryStatus=== 49" style="color:#FF3769">强制完成</span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="LastInventoryStartTime" label="上次盘点开始时间" min-width="299">
            <template #default="scope">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.LastInventoryStartTime)}}
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="LastInventoryEndTime" label="上次盘点结束时间" min-width="299">
            <template #default="scope">
              {{$format.format2MiddleLangTypeDateFunc2(scope.row.LastInventoryEndTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="HandlerName" label="上次操作人"
          show-overflow-tooltip min-width="229" />
          <el-table-column prop="name" label="操作" min-width="243">
            <template #default="scope">
              <mp-button type="primary" v-if="scope.row.LastInventoryStatus === 1"
              link @click="ToMakeAnInventory(scope.row)">
                <i class="iconfont icon-ico_kufangguanli_wupinpandian" style="font-size:14px"></i>
                继续盘点</mp-button>
              <mp-button type="primary" v-else link @click="beginInventory(scope.row)">
                <i class="iconfont icon-ico_kufangguanli_wupinpandian" style="font-size:14px"></i>
                开始盘点</mp-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <mp-button @click="removeEventListener" @keydown="() => null" style="padding:0;border:0">
        <mp-button type="primary" class="is-goback-button" @click="$goback">返回</mp-button>
      </mp-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getInventoryListData.Page"
        :pageSize="Data.getInventoryListData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import api from '@/api';
import messageBox from '@/assets/js/utils/message';

interface getInventoryListDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface InventoryListType {
  StorehouseID: string,
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
    MpPagination,
  },
  setup() {
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
            localStorage.setItem('updataInventoryState', 'true');
          }
        });
      }, () => null);
    }

    function visibilitychange() {
      if (document.visibilityState === 'visible' && localStorage.getItem('updataInventoryState')) {
        // 切换到该页面时执行
        localStorage.removeItem('updataInventoryState');
        getInventoryList();
      }
    }
    onMounted(() => {
      document.addEventListener('visibilitychange', visibilitychange);
      getInventoryList();
    });
    function removeEventListener() {
      document.removeEventListener('visibilitychange', visibilitychange);
    }

    return {
      Data,
      removeEventListener,
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
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      display: flex;
      justify-content: space-between;
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
        .el-button{
          font-size: 12px;
        }
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
    }
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
