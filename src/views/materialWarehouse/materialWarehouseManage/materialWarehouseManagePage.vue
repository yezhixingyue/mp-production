<template>
  <div class="material-warehouse-manage-page">
    <header>
      <div class="header-top">
        <el-button type="primary" @click="Data.SaveStorehouseShow = true">添加仓库</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.StorehouseList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="StorehouseName" label="名称" min-width="302" />
          <el-table-column
          show-overflow-tooltip prop="goodsPositionDimensions" label="货位编号" min-width="702">
            <template #default="scope">
              <span
              v-for="item in scope.row.goodsPositionDimensions" :key="item.DimensionID">
              {{item.StartCode}}-{{item.EndCode}}{{item.DimensionUnit}}；
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" show-overflow-tooltip min-width="573">
            <template #default="scope">
              <el-button type="primary" link
              @click="ToSetPositionNumberPage(scope.row)">设置货位编号</el-button>
              <el-button type="primary" link :disabled="!scope.row.IsLockDimension"
              @click="ToGoodsAllocationPage(scope.row)">规划货位图</el-button>
              <el-button type="primary" link
              @click="seeImg(scope.row.StorehouseImg)">查看平面布局图</el-button>
              <el-button type="primary" link @click="editStorehouse(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delStorehouse(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getStorehouseData.Page"
        :pageSize="Data.getStorehouseData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
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
                :limit="1"
                accept=".png,.jpeg,.gif,.jpg,.bmp"
                :on-success='handllePictureUploaded'
                :before-upload='beforeUpload'
              >
                <template #trigger>
                  <el-button type="primary">上传平面布局图</el-button>
                </template>
                <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                  upload to server
                </el-button> -->
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
    >
    </SeeImageDialogComp>
<!--
    <DialogContainerComp
    title="查看图片"
    :visible='Data.LookImgShow'
    :showPrimary="false"
    :closeClick="() => Data.LookImgShow = false"
    closeBtnText="关闭"
    >
    <template #default>
      <div class="see-img">
        <el-image
          v-if="Data.SeeimgUrl"
          style="width: 100px; height: 100px"
          :src="Data.SeeimgUrl"
          :preview-src-list="[Data.SeeimgUrl]"
          :initial-index="4"
          fit="cover"
        />
        <span v-else>暂无图片</span>
      </div>
    </template>
    </DialogContainerComp> -->
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
// import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';
import api from '@/api/request/MaterialStorage';
import { useRouter } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

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
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
    SeeImageDialogComp,
  },
  setup() {
    const CommonStore = useCommonStore();
    const h = ref(0);
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
        if (res.data.Status === 1000) {
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
      console.log(file);

      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        messageBox.failSingleError('上传失败', '上传文件过大，请上传小于20M的图片', () => null, () => null);
      }
      return isLt15M;
      // Data.SaveStorehouseForm.StorehouseImg = e.Data.Url;
    }

    function submitUpload(e) {
      console.log(e);
    }
    function seeImg(imgUrl:string) {
      Data.SeeimgUrl = imgUrl;
      Data.LookImgShow = true;
    }
    function ToSetPositionNumberPage(item) {
      console.log(item, 'itemitemitem');

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
          if (res.data.Status === 1000) {
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
          if (res.data.Status === 1000) {
            const cb = () => {
              // 保存成功
              getStorehouseList();
              SaveStorehouseCloseClick();
            };
            messageBox.successSingle(`${Data.SaveStorehouseForm.StorehouseID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    // 添加供应商
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-warehouse-manage-page > header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
      const bool = sessionStorage.getItem('updataMaterialWarehouseManagePage') === 'true';
      if (!bool) return;
      getStorehouseList();
      sessionStorage.removeItem('updataMaterialWarehouseManagePage');
    });
    onMounted(() => {
      sessionStorage.removeItem('updataMaterialWarehouseManagePage');
      setHeight();
      getStorehouseList();
    });
    return {
      h,
      Data,
      MaterialWarehouseStore,
      seeImg,
      submitUpload,
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
  >header{
    >.header-top{
      // margin: 20px 0;
      padding: 20px;
      padding-bottom: 0;
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
        .el-table__inner-wrapper{
          height: 100%;
        }
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
