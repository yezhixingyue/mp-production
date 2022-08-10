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
          <el-table-column prop="name" label="操作" min-width="573">
            <template #default="scope">
              <el-button type="primary" link
              @click="ToSetPositionNumberPage(scope.row)">设置货位编号</el-button>
              <el-button type="primary" link>规划货位图</el-button>
              <el-button type="primary" link
              @click="seeImg(scope.row.StorehouseImg)">查看平面布局图</el-button>
              <el-button type="primary" link @click="editStorehouse(scope.row)">编辑</el-button>
              <el-button type="danger" link
                @click="delStorehouse(scope.row.StorehouseID)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="StorehouseName" label="名称" min-width="302" />
          <el-table-column prop="Linkman" label="货柜编号" min-width="702" />
        </el-table>
        <div>
          <MpPagination />
        </div>
      </MpCardContainer>
    </main>
    <DialogContainerComp
    :title="`${Data.SaveStorehouseForm.StorehouseID ? '修改' : '添加'}仓库`"
    :visible='Data.SaveStorehouseShow'
    :width="660"
    :primaryClick="SaveStorehousePrimaryClick"
    :closeClick="SaveStorehouseCloseClick"
    >
    <template #default>
      <div class="add-material-supplier-dialog">
        <el-form :model="Data.SaveStorehouseForm" label-width="112px">
          <el-form-item label="仓库名称：">
            <el-input v-model="Data.SaveStorehouseForm.StorehouseName" />
          </el-form-item>
          <el-form-item label="平面布局图：">
            <el-input v-model="Data.SaveStorehouseForm.StorehouseName" />
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
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
// import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import { useRouter } from 'vue-router';
import messageBox from '@/assets/js/utils/message';

interface SaveStorehouseFormType {
  StorehouseID: number,
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
  // SaveStorehouseTitle: string,
  SaveStorehouseShow: boolean,
  SaveStorehouseForm:SaveStorehouseFormType,
  getStorehouseData:getStorehouseDataType,
  StorehouseList:SaveStorehouseFormType[],
}
export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      LookImgShow: false,
      SeeimgUrl: '',
      // SaveStorehouseTitle: '添加仓库',
      SaveStorehouseShow: false,
      SaveStorehouseForm: {
        StorehouseID: 0,
        StorehouseName: '',
        StorehouseImg: '',
      },
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
        }
      });
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

    function SaveStorehouseCloseClick() {
      Data.SaveStorehouseForm = {
        StorehouseID: 0,
        StorehouseName: '',
        StorehouseImg: '',
      };
      Data.SaveStorehouseShow = false;
    }
    function editStorehouse(item) {
      Data.SaveStorehouseForm = item;
      Data.SaveStorehouseShow = true;
    }
    function delStorehouse(storehouseID) {
      messageBox.warnCancelMsgSM('确定要删除此仓库吗？', () => {
        api.getStorehouseRemove(storehouseID).then(res => {
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
      }
      Data.SaveStorehouseForm.StorehouseImg = Data.SaveStorehouseForm.StorehouseName;
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
    // 添加供应商
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-warehouse-manage-page > header', 20);
      window.onresize = () => {
        h.value = getHeight('.material-warehouse-manage-page > header', 20);
      };
    }
    onMounted(() => {
      setHeight();
      getStorehouseList();
    });
    return {
      h,
      Data,
      MaterialWarehouseStore,
      seeImg,
      editStorehouse,
      delStorehouse,
      getStorehouseList,
      ToSetPositionNumberPage,
      SaveStorehouseCloseClick,
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
}
</style>
