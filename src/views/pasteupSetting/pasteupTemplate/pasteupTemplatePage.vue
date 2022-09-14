<template>
  <div class="material-supplier-manage-page">
    <header>
      <div class="header-top">
        <el-button type="primary" @click="addMaterialSupplier">+ 添加拼版模板</el-button>
      </div>
       <div class="top-main">
         <RadioGroupComp
           :level1Options='CategoryList'
           :level2Options='MaterialTypeList'
           :defaultProps="{
             value:'CategoryID',
             label:'CategoryName',
           }"
           :lv2DefaultProps="{
             value:'TypeID',
             label:'TypeName',
           }"
           :value='twoSelecValue'
           @change="twoSelectChange"
           ></RadioGroupComp>
       </div>
    </header>
    <main :style="`height:${h}px`">
        <el-table border fit
        :data="Data.MaterialSupplierList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="SupplierName" label="供应商名称" min-width="233" />
          <el-table-column
          show-overflow-tooltip prop="Linkman" label="联系人" min-width="162" />
          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="电话" min-width="209" />
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="供应物料类型" min-width="178">
            <template #default>
              <span >
              全部分类
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Address" label="地址"
          show-overflow-tooltip min-width="551" />
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope">
              <el-button type="primary" link @click="editMaterialSupplier(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delMaterialSupplier(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getMaterialSupplierData.Page"
        :pageSize="Data.getMaterialSupplierData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';
import { useRouter } from 'vue-router';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

interface MaterialSupplierFormType {
  SupplierID: string,
  SupplierName: string,
  ProvinceID: number|string,
  CityID: number|string,
  Address: string,
  Linkman: string,
  ContactWay: string,
  MaterialTypeIDS: string[],
}
interface getMaterialSupplierDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface DataType {
  DataTotal: number,
  getMaterialSupplierData:getMaterialSupplierDataType,
  MaterialSupplierList:MaterialSupplierFormType[],
}
export default {
  name: 'pasteupTemplatePage',
  components: {
    MpPagination,
  },
  setup() {
    const h = ref(0);
    const router = useRouter();

    const CommonStore = useCommonStore();
    const Data:DataType = reactive({
      DataTotal: 0,
      getMaterialSupplierData: {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      MaterialSupplierList: [],
    });
    function getMaterialSupplierList() {
      api.getMaterialSupplierList(Data.getMaterialSupplierData).then(res => {
        if (res.data.Status === 1000) {
          Data.MaterialSupplierList = res.data.Data as MaterialSupplierFormType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function ToPasteupTemplateSteupPagePage() {
      router.push({
        name: 'pasteupTemplateSteup',
        // params: { TypeID: IDs.TypeID, CategoryID: IDs.CategoryID },
      });
    }
    function PaginationChange(newVal) {
      if (Data.getMaterialSupplierData.Page === newVal) return;
      Data.getMaterialSupplierData.Page = newVal;
      getMaterialSupplierList();
    }
    function clearCondition() {
      Data.getMaterialSupplierData = {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }

    async function editMaterialSupplier() {
      console.log('editMaterialSupplier');
      ToPasteupTemplateSteupPagePage();
    }
    function delMaterialSupplier(item) {
      messageBox.warnCancelBox('确定要删除此供应商吗？', `${item.SupplierName}`, () => {
        api.getMaterialSupplierRemove(item.SupplierID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getMaterialSupplierList();
          }
        });
      }, () => undefined);
    }

    // 添加供应商
    async function addMaterialSupplier() {
      console.log('addMaterialSupplier');
      ToPasteupTemplateSteupPagePage();
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-supplier-manage-page > header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      getMaterialSupplierList();
    });
    return {
      h,
      Data,
      clearCondition,
      getMaterialSupplierList,
      PaginationChange,
      addMaterialSupplier,
      editMaterialSupplier,
      delMaterialSupplier,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-supplier-manage-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
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
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
      }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
          .el-checkbox__label{
            display: inline-block;
            width: calc(100% - 14px - 10px);
            .el-only-child__content{
              max-width: 100%;
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
