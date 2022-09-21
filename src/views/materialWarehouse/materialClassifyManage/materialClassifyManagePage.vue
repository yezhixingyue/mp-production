<template>
  <div class="material-classify-manage-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" @click="addMaterialClassifyClick">+ 添加物料类型</mp-button>
        <mp-button link type="primary" @click="ToMaterialClassifyManageList">管理物料分类</mp-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.tableData" style="width: 100%">

          <el-table-column prop="CategoryName" label="分类"
          show-overflow-tooltip min-width="123" />
          <el-table-column prop="TypeName" label="类型"
          show-overflow-tooltip min-width="98" />
          <el-table-column prop="TypeCode" label="编码"
          show-overflow-tooltip min-width="81" />
          <el-table-column prop="AttributeDescribe"
          show-overflow-tooltip label="属性" min-width="150" />
          <el-table-column prop="BrandDescribe" label="品牌属性"
          show-overflow-tooltip min-width="83">
          <template #default="scope">
            {{scope.row.BrandDescribe || (scope.row.BrandIsSet ? "无" : '')}}
          </template>
          </el-table-column>
          <el-table-column prop="SizeDescribe" label="尺寸规格"
          show-overflow-tooltip min-width="83" />
          <el-table-column prop="OutInUnitDescribe" label="出入库单位"
          show-overflow-tooltip min-width="378" />
          <!-- <el-table-column prop="name" label="非库存物料"
          show-overflow-tooltip min-width="98">
            <template #default="scope">
              {{!scope.row.IsStock?'非库存物料':''}}
            </template>
          </el-table-column> -->
          <el-table-column prop="name" label="操作" min-width="428">
            <template #default="scope">
              <mp-button type="primary" link
              @click="ToSetAttributesPage(scope.row)">设置属性</mp-button>
              <mp-button type="primary" link :disabled="Boolean(scope.row.BrandIsSet)"
              @click="setBrandClick(scope.row.TypeID)">品牌属性</mp-button>
              <mp-button type="primary" link
              @click="ToSetDimensionsPage(scope.row)">尺寸规格</mp-button>
              <mp-button type="primary" link
              @click="ToSetTheStorageUnitPage(scope.row)" >出入库单位</mp-button>
              <mp-button type="primary" link
              @click="editMaterialClassifyClick(scope.row)">编辑</mp-button>
              <mp-button type="danger" link
              @click="delMaterialClassify(scope.row)">删除</mp-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="address" label="Address" /> -->
        </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getMaterialTypeData.Page"
        :pageSize="Data.getMaterialTypeData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
    <!-- 添加、编辑物料类型 -->
    <DialogContainerComp
    :title="`${Data.materialClassifyDialogForm.TypeID ? '修改' : '添加'}物料类型`"
    :visible='Data.materialClassifyDialogShow'
    :width="660"
    :primaryClick="materialClassifyPrimaryClick"
    :closeClick="materialClassifyCloseClick"
    :closed="materialClassifyCloseedClick"
    >
    <template #default>
      <div class="add-material-classify-dialog">
        <el-form :model="Data.materialClassifyDialogForm">
          <el-form-item label="分类：" class="form-item-required">
            <el-select v-model="Data.materialClassifyDialogForm.CategoryID"
            no-data-text="无数据"
             placeholder="请选择分类">
              <el-option
                v-for="item in MaterialCategoryStore.CategoryList"
                :key="item.CategoryID"
                :label="item.CategoryName"
                :value="item.CategoryID"
              />
            </el-select>
          </el-form-item>
          <el-form-item  label="名称：" class="form-item-required">
            <el-input :maxlength="30" v-model="Data.materialClassifyDialogForm.TypeName" />
          </el-form-item>
          <el-form-item label="编码：" class="form-item-required">
            <el-input :maxlength="4" v-model="Data.materialClassifyDialogForm.TypeCode" />
          </el-form-item>
          <!-- <el-form-item >
            <el-checkbox v-model="IsStock"
            label="非库存物料"/>
          </el-form-item> -->
        </el-form>
        <div class="Prompt">
          <p>1.编码由 1 到 4 位的英文字母或数字组成，方便记忆，在入库搜索物料时输入编码， 可快速定位物料，类似于超市称重时输入的物品编号</p>
          <!-- <p>2.非库存物料指该物料仅用于生产过程，但无需进行出入库操作， 例如：外协工厂加工好的烫印版、模切版</p> -->
        </div>
      </div>
    </template>
    </DialogContainerComp>
    <!-- 设置品牌属性 -->
    <DialogContainerComp
    :title="Data.brandTitle"
    :visible='Data.brandShow'
    :width="440"
    :primaryClick="brandPrimaryClick"
    :closeClick="brandCloseClick"
    >
    <template #default>
      <div class="set-brand-dialog">
        <el-radio-group v-model="Data.setBrandForm.AttributeID">
          <el-radio :label="0" size="large">无</el-radio>
          <el-radio :label="item.AttributeID" size="large"
          v-for="item in MaterialCategoryStore.selectMaterialTypeAttribute"
          :key="item.AttributeID">{{item.AttributeName}}</el-radio>
        </el-radio-group>
        <div class="Prompt">
          <p>品牌属性仅允许设置一次，请谨慎操作</p>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, computed, onActivated,
} from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

interface formType {
  TypeID: string,
  CategoryID: number | undefined,
  TypeName: string,
  TypeCode: string,
  IsStock: boolean,
}
interface tableItemType {
  AttributeDescribe: null
  BrandDescribe: null
  CategoryID: number
  CategoryName: null | string
  IsStock: boolean
  OutInUnitDescribe: null
  SizeDescribe: string,
  StockUnit: null | string,
  TypeCode: string | number,
  TypeID: string,
  TypeName: string
}
interface getMaterialTypeDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface dataType {
  // materialClassifyTitle:string,
  materialClassifyDialogShow:boolean,
  materialClassifyDialogForm:formType,
  tableData: tableItemType[],
  setBrandForm: {
    TypeID: string
    AttributeID: string
  }
  DataTotal: number
  getMaterialTypeData: getMaterialTypeDataType,
  brandTitle:string,
  brandShow:boolean,
}

export default {
  name: 'materialClassifyManagePage',
  components: {
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const router = useRouter();
    const MaterialCategoryStore = useMaterialWarehouseStore();
    // 添加/编辑 物料类型点击
    const Data:dataType = reactive({
      // materialClassifyTitle: '添加物料类型',
      materialClassifyDialogShow: false,
      materialClassifyDialogForm: {
        TypeID: '',
        CategoryID: undefined,
        TypeName: '',
        TypeCode: '',
        IsStock: true,
      },
      tableData: [],
      // 品牌属性
      setBrandForm: {
        TypeID: '',
        AttributeID: '',
      },
      brandTitle: '品牌属性',
      brandShow: false,
      DataTotal: 0,
      getMaterialTypeData: {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
    });
    const IsStock = computed({
      get() {
        return !Data.materialClassifyDialogForm.IsStock;
      },
      set(newVal) {
        Data.materialClassifyDialogForm.IsStock = !newVal;
      },
    });
    // 获取物料类型列表
    function getMaterialClassifyManage() {
      api.getMaterialTypeList(Data.getMaterialTypeData).then(res => {
        if (res.data.Status === 1000) {
          Data.tableData = res.data.Data as tableItemType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getMaterialTypeData.Page === newVal) return;
      Data.getMaterialTypeData.Page = newVal;
      getMaterialClassifyManage();
    }
    function materialClassifyCloseedClick() {
      Data.materialClassifyDialogForm = {
        TypeID: '',
        CategoryID: undefined,
        TypeName: '',
        TypeCode: '',
        IsStock: true,
      };
    }
    function materialClassifyCloseClick() {
      Data.materialClassifyDialogShow = false;
    }
    function brandCloseClick() {
      Data.brandShow = false;
      Data.setBrandForm.AttributeID = '';
    }
    function ToMaterialClassifyManageList() {
      // 管理物料类型;
      router.push('/materialClassifyManageList');
    }
    function ToSetTheStorageUnitPage(itemData) {
      // 出入库单位;
      // router.push('/setTheStorageUnit');
      router.push({ name: 'setTheStorageUnit', params: itemData });
    }
    function ToSetAttributesPage(itemData) {
      // 设置属性;
      router.push({ name: 'setAttributes', params: itemData });
    }
    function ToSetDimensionsPage(itemData) {
      router.push({ name: 'setDimensions', params: itemData });
    }

    // 添加物料类型点击
    function addMaterialClassifyClick() {
      Data.materialClassifyDialogShow = true;
    }
    // 编辑物料类型点击
    function editMaterialClassifyClick(tableItemData) {
      Data.materialClassifyDialogForm = { ...tableItemData };
      Data.materialClassifyDialogShow = true;
    }
    // 删除物料类型点击
    function delMaterialClassify(item) {
      messageBox.warnCancelBox('确定要删除此物料类型吗？', `${item.TypeName}`, () => {
        api.getMaterialTypeRemove(item.TypeID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getMaterialClassifyManage();
          }
        });
      }, () => undefined);
    }

    // 添加、修改弹窗的事件
    function materialClassifyPrimaryClick() {
      if (!Data.materialClassifyDialogForm.CategoryID) {
        // 弹窗
        messageBox.failSingleError('保存失败', '请选择分类', () => null, () => null);
      } else if (!Data.materialClassifyDialogForm.TypeName) {
        messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
        // 弹窗
      } else if (!Data.materialClassifyDialogForm.TypeCode) {
        messageBox.failSingleError('保存失败', '请输入编码', () => null, () => null);
        // 弹窗
      } else {
        api.getMaterialTypeSave(Data.materialClassifyDialogForm).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              getMaterialClassifyManage();
              materialClassifyCloseClick();
            };
              // 成功
            messageBox.successSingle(`${Data.materialClassifyDialogForm.TypeID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    function setBrandClick(typeID) {
      Data.brandShow = true;
      Data.setBrandForm.TypeID = typeID;
      MaterialCategoryStore.getMaterialTypeAttributeAllByTypeID(typeID);
      // api.getMaterialTypeAttributeAll({ TypeID: typeID }).then((res:any) => {
      //   if (res.data.Status === 1000) {
      //     Data.setBrandAttributes = res.data.Data.filter((it) => it.AttributeType === 2);
      //   }
      // });
    }

    function brandPrimaryClick() {
      messageBox.warnCancelBox('您确定要保存吗?', '保存后将不能更改品牌属性，请谨慎操作', () => {
        api.getMaterialTypeAttributeSetBrand(Data.setBrandForm).then(res => {
          if (res.data.Status === 1000) {
            // 设置成功
            const cback = () => {
              brandCloseClick();
              getMaterialClassifyManage();
            };
            // 成功
            messageBox.successSingle('保存成功', cback, cback);
          }
        });
      }, () => null);
    }

    // function getMaterialCategoryList() {
    //   api.getMaterialCategoryAll({}).then(res => {
    //     if (res.data.Status === 1000) {
    //       Data.CategoryList = res.data.Data as tableItem[];
    //     }
    //     console.log(res);
    //   });
    // }
    onActivated(() => {
      const bool = sessionStorage.getItem('updataMaterialClassifyManagePage') === 'true';
      if (!bool) return;
      getMaterialClassifyManage();
      sessionStorage.removeItem('updataMaterialClassifyManagePage');
    });
    onMounted(() => {
      sessionStorage.removeItem('updataMaterialClassifyManagePage');

      getMaterialClassifyManage();
      MaterialCategoryStore.getMaterialCategoryList();
    });
    return {
      Data,
      IsStock,
      MaterialCategoryStore,
      PaginationChange,
      ToMaterialClassifyManageList,
      ToSetTheStorageUnitPage,
      ToSetAttributesPage,
      ToSetDimensionsPage,
      addMaterialClassifyClick,
      editMaterialClassifyClick,
      delMaterialClassify,
      materialClassifyPrimaryClick,
      materialClassifyCloseClick,
      materialClassifyCloseedClick,
      setBrandClick,
      brandPrimaryClick,
      brandCloseClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-classify-manage-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    padding: 20px;
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
    .el-table{
      .el-button{
        font-size: 12px;
      }
      height: 100%;
      flex: 1;
    }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .add-material-classify-dialog{
    .el-form{
      width: 354px;
      margin: 0 auto;
      .el-form-item{
        display: flex;
        .el-form-item__content{
          flex: 1;
        }
      }
    }
    .Prompt{
      padding: 0 90px;
      font-size: 12px;
      line-height: 30px;
      text-indent: -0.8em;
      color: #F4A307;
      p{
        padding-left: 20px;
      }
    }
  }
  .set-brand-dialog{
    .el-radio-group{
      label{
        width: 100px;
      }
    }
    .Prompt{
      color: #FF3769;
      margin-top: 10px;
    }
  }
}
</style>
