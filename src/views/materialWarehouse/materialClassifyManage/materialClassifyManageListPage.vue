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
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.tableData" style="width: 600px">
          <el-table-column prop="CategoryName" label="分类" min-width="288" />
          <el-table-column prop="name" label="操作" min-width="288">
            <template #default="scope">
              <el-button type="primary" link @click="editCategory(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
              @click="delCategory(scope.row.CategoryID)">
              <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="address" label="Address" /> -->
        </el-table>
        <div class="bottom-count-box">
          <MpPagination
          :total="Data.DataTotal"/>
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="`${Data.classifyInfo.CategoryID ? '修改' : '添加'}物料分类`"
    :visible='dialog'
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    >
    <div class="add-material-classify">
      <span>分类名称:</span><el-input v-model="Data.classifyInfo.CategoryName"></el-input>
    </div>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, reactive, onMounted,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface tableItem {
  CategoryID: number | undefined
  CategoryName: string
}
interface dataType {
  tableData:tableItem[]
  DataTotal:number,
  classifyInfo:tableItem
}
export default {
  name: 'setTheStorageUnitPage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const dialog = ref(false);

    const Data:dataType = reactive({
      tableData: [],
      DataTotal: 0,
      classifyInfo: {
        CategoryID: undefined,
        CategoryName: '',
      },
    });

    function getMaterialCategoryList() {
      api.getMaterialCategoryList({}).then(res => {
        if (res.data.Status === 1000) {
          Data.tableData = res.data.Data as tableItem[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }

    function editCategory(CategoryItem:tableItem) {
      Data.classifyInfo = JSON.parse(JSON.stringify(CategoryItem));
      dialog.value = true;
    }
    function delCategory(CategoryID) {
      messageBox.warnCancelMsgSM('确定要删除此物料分类吗？', () => {
        api.getMaterialCategoryRemove(CategoryID).then(res => {
          if (res.data.Status === 1000) {
            getMaterialCategoryList();
          }
        });
      }, () => undefined);
    }
    function closeClick() {
      Data.classifyInfo = {
        CategoryID: undefined,
        CategoryName: '',
      };
      dialog.value = false;
    }
    function primaryClick() {
      if (!Data.classifyInfo.CategoryName) {
        // 弹窗
      } else {
        api.getMaterialCategorySave(Data.classifyInfo).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              closeClick();
              getMaterialCategoryList();
            };
            // 成功
            messageBox.successSingle(`${Data.classifyInfo.CategoryID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-classify-manage-list-page header', 72);
      window.onresize = () => {
        h.value = getHeight('.material-classify-manage-list-page header', 72);
      };
    }
    onMounted(() => {
      setHeight();
      getMaterialCategoryList();
    });
    return {
      h,
      Data,
      dialog,
      editCategory,
      delCategory,
      primaryClick,
      closeClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-classify-manage-list-page{
  .add-material-classify{
    display: flex;
    justify-content: center;
    .el-input{
      width: 300px;
      height: 30px;
    }
    span{
      width: 5em;
      line-height: 30px;
    }
  }
  >header{
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
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
      .bottom-count-box{
        width: 600px;
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
