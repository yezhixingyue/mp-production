<template>
  <div class="material-classify-manage-list-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialClassifyManage' }">物料类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>管理物料分类</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="dialog = true">+ 添加物料分类</el-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.tableData" style="width: 600px">
          <el-table-column
          show-overflow-tooltip prop="CategoryName" label="分类" min-width="288" />
          <el-table-column prop="name" label="操作" min-width="288">
            <template #default="scope">
              <el-button type="primary" link @click="editCategory(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
              @click="delCategory(scope.row)">
              <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="address" label="Address" /> -->
        </el-table>

    </main>
    <footer>
        <div class="bottom-count-box">
          <MpPagination
          :nowPage="Data.getMaterialCategoryData.Page"
          :pageSize="Data.getMaterialCategoryData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange" />
        </div>
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="`${Data.classifyInfo.CategoryID ? '修改' : '添加'}物料分类`"
    :visible='dialog'
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    :closed="closeedClick"
    >
    <div class="add-material-classify ">
      <span class="required">分类名称：</span>
      <el-input :maxlength="30" v-model="Data.classifyInfo.CategoryName"></el-input>
    </div>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, reactive, onMounted,
} from 'vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

interface tableItem {
  CategoryID: number | undefined
  CategoryName: string
}
interface getMaterialCategoryDataType {
  Page: number,
  PageSize: number,
}
interface dataType {
  tableData:tableItem[]
  DataTotal:number,
  classifyInfo:tableItem
  getMaterialCategoryData:getMaterialCategoryDataType
}
export default {
  name: 'materialClassifyManageListPage',
  components: {
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const dialog = ref(false);
    const MaterialCategoryStore = useMaterialWarehouseStore();
    const Data:dataType = reactive({
      tableData: [],
      DataTotal: 0,
      getMaterialCategoryData: {
        Page: 1,
        PageSize: 20,
      },
      classifyInfo: {
        CategoryID: undefined,
        CategoryName: '',
      },
    });

    function getMaterialCategoryList() {
      api.getMaterialCategoryList(Data.getMaterialCategoryData).then(res => {
        if (res.data.Status === 1000) {
          Data.tableData = res.data.Data as tableItem[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getMaterialCategoryData.Page === newVal) return;
      Data.getMaterialCategoryData.Page = newVal;
      getMaterialCategoryList();
    }
    function editCategory(CategoryItem:tableItem) {
      Data.classifyInfo = JSON.parse(JSON.stringify(CategoryItem));
      dialog.value = true;
    }
    function delCategory(item) {
      messageBox.warnCancelBox('确定要删除此物料分类吗？', `${item.CategoryName}`, () => {
        api.getMaterialCategoryRemove(item.CategoryID).then(res => {
          if (res.data.Status === 1000) {
            getMaterialCategoryList();
            MaterialCategoryStore.getMaterialCategoryList();
          }
        });
      }, () => undefined);
    }
    function closeedClick() {
      Data.classifyInfo = {
        CategoryID: undefined,
        CategoryName: '',
      };
    }
    function closeClick() {
      dialog.value = false;
    }
    function primaryClick() {
      if (!Data.classifyInfo.CategoryName) {
        messageBox.failSingleError('保存失败', '请输入分类名称', () => null, () => null);

        // 弹窗
      } else {
        api.getMaterialCategorySave(Data.classifyInfo).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              closeClick();
              getMaterialCategoryList();
              MaterialCategoryStore.getMaterialCategoryList();
            };
            // 成功
            messageBox.successSingle(`${Data.classifyInfo.CategoryID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }

    onMounted(() => {
      getMaterialCategoryList();
    });
    return {
      Data,
      dialog,
      PaginationChange,
      editCategory,
      delCategory,
      primaryClick,
      closeClick,
      closeedClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-classify-manage-list-page{
  border: 1px solid #E5E5E5;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  height: 100%;
  .add-material-classify{
    display: flex;
    justify-content: center;
    .el-input{
      width: 300px;
      height: 30px;
    }
    span{
      width: 6em;
      line-height: 30px;
      text-align: right;
    }
  }
  >header{
    padding: 20px;
    background-color: #fff;
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
  }
  >main{
    flex: 1;
    // margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #E5E5E5;
      .el-table{
        height: 100%;
        flex: 1;
        &.el-table--border:after, .el-table__inner-wrapper::before{
          width: 0;
        }
      }
  }
  >footer{
    .bottom-count-box{
      width: calc((100% - 100px) / 2);
      height: 50px;
      display: flex;
      justify-items: center;
      justify-content: flex-start;
    }
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
