<template>
  <div class="material-warehouse-manage-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" v-if="localPermission?.Setup" @click="Data.SaveStorehouseShow = true">添加仓库</mp-button>
      </div>
    </header>
    <main>
      <!-- <MpCardContainer> -->
        <el-table border fit stripe
        :data="Data.StorehouseList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="StorehouseName" label="名称" min-width="302" />
          <el-table-column
          show-overflow-tooltip prop="goodsPositionDimensions" label="货位编号" min-width="702">
            <template #default="scope:any">
              <span
              v-for="item in scope.row.goodsPositionDimensions" :key="item.DimensionID">
              {{item.StartCode}}-{{item.EndCode}}{{item.DimensionUnit}}；
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" show-overflow-tooltip min-width="573">
            <template #default="scope:any">
              <mp-button type="primary" link v-if="localPermission?.SetCode"
              @click="ToSetPositionNumberPage(scope.row)">设置货位编号</mp-button>
              <mp-button type="primary" link v-if="localPermission?.SetupMap" :disabled="!scope.row.IsLockDimension"
              @click="ToGoodsAllocationPage(scope.row)">规划货位图</mp-button>
              <mp-button type="primary" link v-if="localPermission?.QueryMap"
              @click="seeImg(scope.row.StorehouseImg)">查看平面布局图</mp-button>
              <template v-if="localPermission?.Setup">
                <mp-button type="primary" link @click="editStorehouse(scope.row)">
                  <!-- <i class="iconfont icon-bianji"></i> -->
                  编辑</mp-button>
                <mp-button type="danger" link
                  @click="delStorehouse(scope.row)">
                  <!-- <i class="iconfont icon-delete"></i> -->
                  删除</mp-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      <!-- </MpCardContainer> -->
    </main>
    <footer>
      <MpPagination
      style="width: 100%;"
      center
      :nowPage="Data.getStorehouseData.Page"
      :pageSize="Data.getStorehouseData.PageSize"
      :total="Data.DataTotal"
      :handlePageChange="PaginationChange" />
    </footer>
    <DialogContainerComp
    :title="`${Data.SaveStorehouseForm.StorehouseID ? '修改' : '添加'}仓库`"
    :visible='Data.SaveStorehouseShow'
    :width="660"
    :primaryClick="SaveStorehousePrimaryClick"
    :closeClick="SaveStorehouseCloseClick"
    :closed="SaveStorehouseCloseedClick"
    >
    <template #default>
      <div class="add-storehouse-dialog">
        <el-form :show-message="false" :model="Data.SaveStorehouseForm" label-width="112px">
          <el-form-item label="仓库名称："
           class="form-item-required" prop="StorehouseName">
            <el-input :maxlength="30" v-model="Data.SaveStorehouseForm.StorehouseName" />
          </el-form-item>
          <el-form-item label="平面布局图：">
            <!-- <el-input v-model="Data.SaveStorehouseForm.StorehouseName" /> -->
              <el-upload
                ref="upload"
                class="upload-demo"
                action="/Api/Upload/Image?type=1"
                accept=".png,.jpeg,.gif,.jpg,.bmp"
                :on-success='handllePictureUploaded'
                :before-upload='beforeUpload'
              >
                <template #trigger>
                  <mp-button type="primary">上传平面布局图</mp-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    {{Data.SaveStorehouseForm.StorehouseImg? '已上传图片':'未上传'}}
                  </div>
                </template>
              </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>

    <SeeImageDialogComp
    title="仓库货位平面图"
    :visible='Data.LookImgShow'
    :imgUrl="Data.SeeimgUrl"
    :closeClick="() => Data.LookImgShow = false"
    noImgText="未上传平面布局图"
    >
    </SeeImageDialogComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { reactive, onMounted, onActivated, computed } from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';
import api from '@/api';
import { useRouter } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';

interface SaveStorehouseFormType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
}
interface getStorehouseDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface DataType {
  LookImgShow: boolean,
  SeeimgUrl: string,
  fileName: string,
  DataTotal: number,
  SaveStorehouseShow: boolean,
  SaveStorehouseForm:SaveStorehouseFormType,
  getStorehouseData:getStorehouseDataType,
  StorehouseList:SaveStorehouseFormType[],
}
export default {
  name: 'materialWarehouseManagePage',
  components: {
    // MpCardContainer,
    MpPagination,
    DialogContainerComp,
    SeeImageDialogComp,
  },
  setup() {
    const userStore = useUserStore();
    const { user } = userStore;
    const localPermission = computed(() => user?.PermissionList?.PermissionWarehouse?.Obj);

    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      LookImgShow: false,
      SeeimgUrl: '',
      DataTotal: 0,
      // SaveStorehouseTitle: '添加仓库',
      SaveStorehouseShow: false,
      SaveStorehouseForm: {
        StorehouseID: '',
        StorehouseName: '',
        StorehouseImg: '',
      },
      fileName: '',
      getStorehouseData: {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      StorehouseList: [],
    });

    function getStorehouseList() {
      api.getStorehouseList(Data.getStorehouseData).then(res => {
        if (res?.data?.Status === 1000) {
          Data.StorehouseList = res.data.Data as SaveStorehouseFormType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getStorehouseData.Page === newVal) return;
      Data.getStorehouseData.Page = newVal;
      getStorehouseList();
    }
    function handllePictureUploaded(e) {
      if (e.Status === 1000) {
        Data.SaveStorehouseForm.StorehouseImg = e.Data.Url;
      } else {
        messageBox.failSingleError('上传失败', e.Message, () => null, () => null);
      }
    }
    function beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        messageBox.failSingleError('上传失败', '上传文件过大，请上传小于20M的图片', () => null, () => null);
      }
      return isLt15M;
      // Data.SaveStorehouseForm.StorehouseImg = e.Data.Url;
    }

    function seeImg(imgUrl:string) {
      Data.SeeimgUrl = imgUrl;
      Data.LookImgShow = true;
    }
    function ToSetPositionNumberPage(item) {
      router.push({
        name: 'setPositionNumber',
        params: item,
      });
    }
    function ToGoodsAllocationPage(item) {
      router.push({
        name: 'goodsAllocation',
        params: item,
      });
      // messageBox.failSingle('消息', () => null, () => null); // 错误提示框
      // messageBox.failSingleError('标题', '提示内容', () => null, () => null); // 错误提示框，有内容
      // messageBox.warnSingleError('提示内容', () => null, () => null, '标题'); // 警告提示框，有内容
      // messageBox.warnCancelBox('标题', '提示内容', () => null, () => null); // 警告提示框，有内容 用于操作确认
      // messageBox.successSingle('标题', () => null, () => null, true, 'msgmsgmsg'); // 成功提示框
      // messageBox.handleLoadingError('error', () => null, () => null);
    }

    function SaveStorehouseCloseedClick() {
      Data.SaveStorehouseForm = {
        StorehouseID: '',
        StorehouseName: '',
        StorehouseImg: '',
      };
    }
    function SaveStorehouseCloseClick() {
      Data.SaveStorehouseShow = false;
    }
    function editStorehouse(item) {
      Data.SaveStorehouseForm = { ...item };
      Data.SaveStorehouseShow = true;
    }
    function delStorehouse(item) {
      messageBox.warnCancelBox('确定要删除此仓库吗？', `${item.StorehouseName}`, () => {
        api.getStorehouseRemove(item.StorehouseID).then(res => {
          if (res?.data?.Status === 1000) {
            // messageBox.successSingle(
            //   '删除成功',
            //   () => (getStorehouseList()),
            //   () => (getStorehouseList()),
            // );
            // 删除成功
            getStorehouseList();
          }
        });
      }, () => undefined);
    }
    function SaveStorehousePrimaryClick() {
      if (!Data.SaveStorehouseForm.StorehouseName) {
        // 提示为空
        messageBox.failSingleError('保存失败', '请输入仓库名称', () => null, () => null);
      } else {
        // Data.SaveStorehouseForm.StorehouseImg = Data.SaveStorehouseForm.StorehouseName;
        api.getStorehouseSave(Data.SaveStorehouseForm).then(res => {
          if (res?.data?.Status === 1000) {
            const cb = () => {
              // 保存成功
              getStorehouseList();
              SaveStorehouseCloseClick();
            };
            MpMessage.dialogSuccess(`${Data.SaveStorehouseForm.StorehouseID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }

    onActivated(() => {
      const bool = sessionStorage.getItem('updataMaterialWarehouseManagePage') === 'true';
      if (!bool) return;
      getStorehouseList();
      sessionStorage.removeItem('updataMaterialWarehouseManagePage');
    });
    onMounted(() => {
      sessionStorage.removeItem('updataMaterialWarehouseManagePage');
      getStorehouseList();
    });
    return {
      localPermission,
      Data,
      MaterialWarehouseStore,
      seeImg,
      editStorehouse,
      delStorehouse,
      PaginationChange,
      getStorehouseList,
      handllePictureUploaded,
      beforeUpload,
      ToSetPositionNumberPage,
      ToGoodsAllocationPage,
      SaveStorehouseCloseClick,
      SaveStorehouseCloseedClick,
      SaveStorehousePrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-warehouse-manage-page{
  // margin: 0 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    >.header-top{
      // margin: 20px 0;
      padding: 20px;
      // padding-bottom: 0;
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
      .el-button+.el-button{
        margin-left: 50px;
      }
      .el-table__inner-wrapper{
        height: 100%;
      }
    }
  }
  >footer{
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .add-storehouse-dialog{
    .upload-demo{
      display: flex;
      height: 32px;
      .el-upload{
        margin-right: 20px;
      }
      .el-upload-list--text{
        display: none;
      }
      .el-upload__tip{
        margin-top: 0;
      }
    }
  }
  .see-img{
    text-align: center;
  }
}
</style>
