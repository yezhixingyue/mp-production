<template>
  <div class="set-position-number-page">
    <header>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/materialWarehouseManage' }">仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>设置货位编号</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary"
        :disabled="Data.LockStatus"
        @click="Data.addPalletDimensionsShow = true">+ 添加货物维度</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <p class="lock">
          <el-button type="primary" link v-if="!Data.LockStatus"
          @click="PalletDimensionsLockCode">锁定货物编号</el-button>
          <el-button type="danger" link v-else
          @click="PalletDimensionsUnlockCode">解锁</el-button>
        </p>
        <el-table border fit
        :data="Data.PalletDimensionsList" style="width: 100%">
          <el-table-column prop="name" label="操作" min-width="371">
            <template #default="scope">
              <el-button type="primary"
              :disabled="Data.LockStatus" link @click="editStorehouse(scope.row)">
              <i class="iconfont icon-bianji"></i>
              编辑</el-button>
              <el-button type="danger"
              :disabled="Data.LockStatus" link
                @click="delStorehouse(scope.row.DimensionID)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="DimensionUnit" label="维度单位" min-width="399" />
          <el-table-column prop="StorehouseName" label="起止编号" min-width="399">
            <template #default="scope">
              <span>
                {{scope.row.StartCode}} 至 {{scope.row.EndCode}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Sort" label="显示顺序" min-width="399" />
        </el-table>
        <div>
          <!-- <MpPagination /> -->
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="Data.addPalletDimensionsTitle"
    :visible='Data.addPalletDimensionsShow'
    :width="660"
    :primaryClick="addPalletDimensionsPrimaryClick"
    :closeClick="addPalletDimensionsCloseClick"
    >
    <template #default>
      <div class="add-pallet-dimensions-dialog">
        <el-form :model="Data.addPalletDimensionsForm" label-width="112px">
          <el-form-item label="维度单位：">
            <el-input v-model="Data.addPalletDimensionsForm.DimensionUnit" />
          </el-form-item>
          <el-form-item label="起止编号：">
            <el-input v-model="Data.addPalletDimensionsForm.StartCode" />
            <span>至</span>
            <el-input v-model="Data.addPalletDimensionsForm.EndCode" />
          </el-form-item>
          <el-form-item label="显示顺序：">
            <el-input v-model.number="Data.addPalletDimensionsForm.Sort" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <DialogContainerComp
    title="查看图片"
    :visible='Data.LookImgShow'
    :showPrimary="false"
    :closeClick="() => Data.LookImgShow = false"
    >
    <template #default>
      {{Data.SeeimgUrl}}
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import {
  ref, reactive, onMounted,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
// import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';

interface addPalletDimensionsFormType {
  DimensionID: number,
  StorehouseID: number,
  DimensionUnit: string,
  StartCode: string,
  EndCode: string,
  Sort: number,
}
interface getPalletDimensionsListDataType {
  StorehouseID: number,
}
interface DataType {
  LookImgShow: boolean,
  SeeimgUrl: string,
  LockStatus: boolean,
  addPalletDimensionsTitle: string,
  addPalletDimensionsShow: boolean,
  addPalletDimensionsForm:addPalletDimensionsFormType,
  getPalletDimensionsListData:getPalletDimensionsListDataType,
  PalletDimensionsList:addPalletDimensionsFormType[]
}
export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    // MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    // const { getDistrictByParentID } = getDistrictMixins();
    const route = useRoute();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      LookImgShow: false,
      SeeimgUrl: '',
      LockStatus: false,
      addPalletDimensionsTitle: '添加货位维度',
      addPalletDimensionsShow: false,
      addPalletDimensionsForm: {
        DimensionID: 0,
        StorehouseID: 0,
        DimensionUnit: '',
        StartCode: '',
        EndCode: '',
        Sort: 0,
      },
      getPalletDimensionsListData: {
        StorehouseID: 0,
      },
      PalletDimensionsList: [],
    });

    function getPalletDimensionsList() {
      api.getGoodsPositionDimensionList(Data.getPalletDimensionsListData).then(res => {
        if (res.data.Status === 1000) {
          Data.PalletDimensionsList = res.data.Data as addPalletDimensionsFormType[];
        }
      });
    }
    function seeImg(imgUrl:string) {
      Data.SeeimgUrl = imgUrl;
      Data.LookImgShow = true;
    }
    function addPalletDimensionsCloseClick() {
      Data.addPalletDimensionsShow = false;
      Data.addPalletDimensionsForm = {
        DimensionID: 0,
        StorehouseID: Data.addPalletDimensionsForm.StorehouseID,
        DimensionUnit: '',
        StartCode: '',
        EndCode: '',
        Sort: 0,
      };
      console.log('aaa');
    }
    function editStorehouse(item) {
      Data.addPalletDimensionsForm = item;
      Data.addPalletDimensionsShow = true;
      console.log('aaa');
    }
    function delStorehouse(dimensionID) {
      api.getGoodsPositionDimensionRemove(dimensionID).then(res => {
        if (res.data.Status === 1000) {
          // 删除成功
          getPalletDimensionsList();
        }
      });
    }
    function addPalletDimensionsPrimaryClick() {
      if (!Data.addPalletDimensionsForm.DimensionUnit) {
        // 报错
      }
      api.getGoodsPositionDimensionSave(Data.addPalletDimensionsForm).then(res => {
        if (res.data.Status === 1000) {
          // 保存成功
          getPalletDimensionsList();
          addPalletDimensionsCloseClick();
        }
      });
      console.log('aaa');
    }
    // 添加供应商
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.set-position-number-page > header', 20 + 32 + 20);
      window.onresize = () => {
        h.value = getHeight('.set-position-number-page > header', 20 + 32 + 20);
      };
    }
    function getLockStatus() {
      api.getGoodsPositionDimensionLockStatus(
        Data.getPalletDimensionsListData.StorehouseID,
      ).then((res:any) => {
        if (res.data.Status) {
          Data.LockStatus = res.data.Data.LockStatus as boolean;
        }
      });
    }
    function PalletDimensionsLockCode() {
      messageBox.warnCancelMsgSM('确定要锁定货位编号吗？', () => {
        api.getGoodsPositionDimensionLockCode(
          Data.getPalletDimensionsListData.StorehouseID,
        ).then((res) => {
          if (res.data.Status) {
            getLockStatus();
          }
        });
      }, () => undefined);
    }
    function PalletDimensionsUnlockCode() {
      messageBox.warnCancelMsgSM('确定要解锁吗？', () => {
        api.getGoodsPositionDimensionUnlockCode(
          Data.getPalletDimensionsListData.StorehouseID,
        ).then((res) => {
          if (res.data.Status) {
            getLockStatus();
          }
        });
      }, () => undefined);
    }

    onMounted(() => {
      Data.getPalletDimensionsListData.StorehouseID = Number(route.params.StorehouseID);
      Data.addPalletDimensionsForm.StorehouseID = Number(route.params.StorehouseID);
      getLockStatus();
      setHeight();
      getPalletDimensionsList();
    });
    return {
      h,
      Data,
      MaterialWarehouseStore,
      seeImg,
      editStorehouse,
      delStorehouse,
      PalletDimensionsLockCode,
      PalletDimensionsUnlockCode,
      addPalletDimensionsCloseClick,
      addPalletDimensionsPrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-position-number-page{
  >header{
    >.el-breadcrumb{
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
      .lock{
        margin-bottom: 20px;
      }
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
        .el-table__inner-wrapper{
          height: 100%;
        }
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
