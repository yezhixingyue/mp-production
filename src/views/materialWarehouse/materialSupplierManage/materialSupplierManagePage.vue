<template>
  <div class="material-supplier-manage-page">
    <header>
      <div class="header-top">
        <el-button type="primary" @click="addMaterialSupplier">+ 添加供应商</el-button>
        <SearchInputComp
          :word='Data.getMaterialSupplierData.KeyWords'
          title="关键词搜索"
          placeholder="请输入搜索关键词"
          resetWords="清空所有筛选条件"
          :changePropsFunc="(words) => Data.getMaterialSupplierData.KeyWords = words"
          :requestFunc='getMaterialSupplierList'
          @reset='clearCondition'
          >
        </SearchInputComp>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.MaterialSupplierList" style="width: 100%">
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope">
              <el-button type="primary" link @click="editMaterialSupplier(scope.row)">编辑</el-button>
              <el-button type="danger" link
                @click="delMaterialSupplier(scope.row.SupplierID)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="SupplierName" label="供应商名称" min-width="233" />
          <el-table-column prop="Linkman" label="联系人" min-width="162" />
          <el-table-column prop="Linkman" label="电话" min-width="209" />
          <el-table-column prop="MaterialTypeIDS" label="供应物料类型" min-width="178"/>
          <el-table-column prop="Address" label="地址" min-width="551" />
        </el-table>
        <div>
          <MpPagination />
        </div>
      </MpCardContainer>
    </main>
    <DialogContainerComp
    :title="`${Data.MaterialSupplierForm.SupplierID ? '修改' : '添加'}供应商`"
    :visible='Data.addMaterialSupplierShow'
    :width="660"
    :primaryClick="addMaterialSupplierPrimaryClick"
    :closeClick="addMaterialSupplierCloseClick"
    >
    <template #default>
      <div class="add-material-supplier-dialog">
        <el-form :model="Data.MaterialSupplierForm" label-width="112px">
          <el-form-item label="供应商名称：">
            <el-input v-model="Data.MaterialSupplierForm.SupplierName" />
          </el-form-item>
          <el-form-item label="所在城市：">
            <TowLevelSelect
            :level1Options='Data.ProvinceList'
            :level2Options='Data.CityList'
            :defaultProps="{
              value:'ID',
              label:'Name',
            }"
            :value='twoSelecValue'
            @change="twoSelectChange"
            ></TowLevelSelect>
          </el-form-item>
          <el-form-item label="详细地址：">
            <el-input v-model="Data.MaterialSupplierForm.Address" />
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="Data.MaterialSupplierForm.Linkman" />
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="Data.MaterialSupplierForm.ContactWay" />
          </el-form-item>
        </el-form>
        <div class="material-type">
          <p>供应物料类型：
            <el-checkbox
              v-model="Data.checkAll"
              :indeterminate="Data.isIndeterminate"
              @change="handleCheckAllChange"
            >全部分类</el-checkbox>
          </p>
          <el-checkbox-group
            v-model="Data.MaterialSupplierForm.MaterialTypeIDS"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
            v-for="city in MaterialWarehouseStore.CategoryList"
            :key="city.CategoryID" :label="city.CategoryID">{{
              city.CategoryName
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, computed, watch,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface DistrictType {
  ID: number|string,
  Name: string,
  ParentID: number|string,
  IsVirtual: boolean,
  Level: number
}
interface MaterialSupplierFormType {
  SupplierID: number,
  SupplierName: string,
  ProvinceID: number|string,
  CityID: number|string,
  Address: string,
  Linkman: string,
  ContactWay: string,
  MaterialTypeIDS: number[],
}
interface getMaterialSupplierDataType {
  Page: number,
  KeyWords: string,
  PageSize: number|string,
}
interface DataType {
  checkAll:boolean,
  isIndeterminate:boolean,
  ProvinceList:DistrictType[],
  CityList:DistrictType[],
  // addMaterialSupplierTitle: string,
  addMaterialSupplierShow: boolean,
  MaterialSupplierForm:MaterialSupplierFormType,
  getMaterialSupplierData:getMaterialSupplierDataType,
  MaterialSupplierList:MaterialSupplierFormType[],
}
export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    MpPagination,
    TowLevelSelect,
    SearchInputComp,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const { getDistrictByParentID } = getDistrictMixins();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      checkAll: false,
      isIndeterminate: false,
      // addMaterialSupplierTitle: '添加供应商',
      addMaterialSupplierShow: false,
      // 省级列表
      ProvinceList: [],
      CityList: [],
      MaterialSupplierForm: {
        SupplierID: 0,
        SupplierName: '',
        ProvinceID: '',
        CityID: '',
        Address: '',
        Linkman: '',
        ContactWay: '',
        MaterialTypeIDS: [],
      },
      getMaterialSupplierData: {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      MaterialSupplierList: [],
    });
    const twoSelecValue = computed(() => ({
      level1Val: Data.MaterialSupplierForm.ProvinceID,
      level2Val: Data.MaterialSupplierForm.CityID,
    }));
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-08',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-06',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ];

    function getMaterialSupplierList() {
      api.getMaterialSupplierList(Data.getMaterialSupplierData).then(res => {
        if (res.data.Status === 1000) {
          Data.MaterialSupplierList = res.data.Data as MaterialSupplierFormType[];
        }
      });
    }
    function clearCondition() {
      Data.getMaterialSupplierData = {
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }
    const handleCheckedCitiesChange = (value:number[]) => {
      const checkedCount = value.length;
      Data.checkAll = checkedCount === MaterialWarehouseStore.CategoryList.length;
      Data.isIndeterminate = checkedCount > 0
       && checkedCount < MaterialWarehouseStore.CategoryList.length;
    };
    function addMaterialSupplierCloseClick() {
      Data.addMaterialSupplierShow = false;
      Data.checkAll = false;
      Data.isIndeterminate = false;

      Data.MaterialSupplierForm = {
        SupplierID: 0,
        SupplierName: '',
        ProvinceID: '',
        CityID: '',
        Address: '',
        Linkman: '',
        ContactWay: '',
        MaterialTypeIDS: [],
      };
    }
    async function editMaterialSupplier(item) {
      Data.ProvinceList = await getDistrictByParentID(1) as DistrictType[];
      Data.addMaterialSupplierShow = true;
      Data.MaterialSupplierForm = item;
      handleCheckedCitiesChange(Data.MaterialSupplierForm.MaterialTypeIDS);
    }
    function delMaterialSupplier(ID) {
      messageBox.warnCancelMsgSM('确定要删除此供应商吗？', () => {
        api.getMaterialSupplierRemove(ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getMaterialSupplierList();
          }
        });
      }, () => undefined);
    }

    function addMaterialSupplierPrimaryClick() {
      if (!Data.MaterialSupplierForm.SupplierName) {
        // 报错
      } else {
        api.getMaterialSupplierSave(Data.MaterialSupplierForm).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              getMaterialSupplierList();
              addMaterialSupplierCloseClick();
            };
            // 成功
            messageBox.successSingle(`${Data.MaterialSupplierForm.SupplierID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    function twoSelectChange({ level1Val, level2Val }) {
      Data.MaterialSupplierForm.ProvinceID = level1Val;
      Data.MaterialSupplierForm.CityID = level2Val;
    }
    watch(() => twoSelecValue.value.level1Val, async (newValue) => {
      Data.CityList = await getDistrictByParentID(newValue) as DistrictType[];
    });
    // 添加供应商
    async function addMaterialSupplier() {
      Data.ProvinceList = await getDistrictByParentID(1) as DistrictType[];
      Data.CityList = [];
      Data.addMaterialSupplierShow = true;
    }
    const handleCheckAllChange = (val: boolean) => {
      if (val) {
        const a = MaterialWarehouseStore.CategoryList.map(it => it.CategoryID as number);
        Data.MaterialSupplierForm.MaterialTypeIDS = a;
      } else {
        Data.MaterialSupplierForm.MaterialTypeIDS = [];
      }
      Data.isIndeterminate = false;
    };
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-supplier-manage-page > header', 20);
      window.onresize = () => {
        h.value = getHeight('.material-supplier-manage-page > header', 20);
      };
    }
    onMounted(() => {
      setHeight();
      getMaterialSupplierList();
      // 获取物料分类
      MaterialWarehouseStore.getMaterialCategoryList();
    });
    return {
      h,
      tableData,
      Data,
      twoSelecValue,
      MaterialWarehouseStore,
      clearCondition,
      getMaterialSupplierList,
      twoSelectChange,
      addMaterialSupplier,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      editMaterialSupplier,
      delMaterialSupplier,
      addMaterialSupplierCloseClick,
      addMaterialSupplierPrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-supplier-manage-page{
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
