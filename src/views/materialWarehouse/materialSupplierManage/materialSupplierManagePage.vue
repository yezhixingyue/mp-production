<template>
  <div class="material-supplier-manage-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" @click="addMaterialSupplier">+ 添加供应商</mp-button>
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
    <main>
        <el-table border fit stripe
        :data="Data.MaterialSupplierList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="SupplierName" label="供应商名称" min-width="233" />
          <el-table-column
          show-overflow-tooltip prop="Linkman" label="联系人" min-width="162" />
          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="电话" min-width="209" />
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="供应物料类型" min-width="178">
            <template #default="scope:any">
              <span v-if="scope.row.MaterialTypeIDS.length
              === Data.MaterialTypeList.length">
              全部分类
              </span>
              <template v-else>
                <template v-if="Data.MaterialTypeList.length">
                  <span v-for="(item, index) in scope.row.MaterialTypeIDS" :key="item">
                    {{index === 0 ? '' : '、'}}{{useIdGetMaterialTypeName(item)}}
                  </span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="Address" label="地址" show-overflow-tooltip min-width="551" >
            <template #default="scope:any">
              {{formatAddress(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope:any">
              <mp-button type="info" link @click="editMaterialSupplier(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="delMaterialSupplier(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
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
    <DialogContainerComp v-if="ProvinceList.length"
    :title="`${Data.MaterialSupplierForm.SupplierID ? '修改' : '添加'}供应商`"
    :visible='Data.addMaterialSupplierShow'
    :width="660"
    :primaryClick="addMaterialSupplierPrimaryClick"
    :closeClick="addMaterialSupplierCloseClick"
    :closed="addMaterialSupplierCloseedClick"
    >
    <template #default>
      <div class="add-material-supplier-dialog">
        <el-form :model="Data.MaterialSupplierForm" label-width="112px">
          <el-form-item label="供应商名称：" class="form-item-required">
            <el-input :maxlength="30" v-model="Data.MaterialSupplierForm.SupplierName" />
          </el-form-item>
          <el-form-item label="所在城市：" class="form-item-required">
            <TowLevelSelect
            :level1Options='ProvinceList'
            :level2Options='CityList'
            :defaultProps="{
              value:'ID',
              label:'Name',
            }"
            :value='twoSelecValue'
            @change="twoSelectChange"
            :width="130"
            ></TowLevelSelect>
          </el-form-item>
          <el-form-item label="详细地址：" class="form-item-required">
            <el-input :maxlength="100" v-model="Data.MaterialSupplierForm.Address" />
          </el-form-item>
          <el-form-item label="联系人：" class="form-item-required">
            <el-input :maxlength="20" v-model="Data.MaterialSupplierForm.Linkman" />
          </el-form-item>
          <el-form-item label="联系电话：" class="form-item-required">
            <el-input v-model="Data.MaterialSupplierForm.ContactWay" />
          </el-form-item>
        </el-form>
        <div class="material-type">
          <p class="required">供应物料类型：
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
            v-for="Material in Data.MaterialTypeList"
            :key="Material.TypeID" :label="Material.TypeID">
              <el-tooltip
                class="box-item"
                effect="dark"
                :content="Material.TypeName"
                placement="top"
                :disabled="Material.TypeName.length<7"
              >
              {{Material.TypeName}}
              </el-tooltip>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, computed,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { useCommonStore } from '@/store/modules/common/index';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { MpMessage } from '@/assets/js/utils/MpMessage';

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
interface MaterialTypeListType {
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
interface DataType {
  checkAll:boolean,
  isIndeterminate:boolean,
  DataTotal: number,
  addMaterialSupplierShow: boolean,
  MaterialSupplierForm:MaterialSupplierFormType,
  getMaterialSupplierData:getMaterialSupplierDataType,
  MaterialSupplierList:MaterialSupplierFormType[],
  MaterialTypeList:MaterialTypeListType[],
}
export default {
  name: 'materialSupplierManagePage',
  components: {
    MpPagination,
    TowLevelSelect,
    SearchInputComp,
    DialogContainerComp,
  },
  setup() {
    const commonStore = useCommonStore();
    const { DistrictTreeList } = storeToRefs(commonStore);
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      checkAll: false,
      isIndeterminate: false,
      DataTotal: 0,
      addMaterialSupplierShow: false,
      MaterialSupplierForm: {
        SupplierID: '',
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
      // 物料类型列表
      MaterialTypeList: [],
    });
    const twoSelecValue = computed(() => ({
      level1Val: Data.MaterialSupplierForm.ProvinceID,
      level2Val: Data.MaterialSupplierForm.CityID,
    }));
    const ProvinceList = computed(() => DistrictTreeList.value);
    const CityList = computed(() => {
      const actionProvince = ProvinceList.value.find(res => res.ID === Data.MaterialSupplierForm.ProvinceID);
      return actionProvince?.children || [];
    });
    const formatAddress = (row) => {
      if (DistrictTreeList.value.length > 0) {
        const province = DistrictTreeList.value.find(it => it.ID === row.ProvinceID);
        if (province && province.children) {
          const city = province.children.find(it => it.ID === row.CityID);
          if (city) {
            return `${province.Name}${city.Name}${row.Address}`;
          }
        }
      }
      return '';
    };
    const useIdGetMaterialTypeName = (ID) => {
      // MaterialWarehouseStore.MaterialTypeList.find;
      // console.log(IDS, 'useIdGetMaterialTypeName');
      const temp = Data.MaterialTypeList.find(res => res.TypeID === ID);
      return temp?.TypeName || '';
    };
    function getMaterialSupplierList() {
      api.getMaterialSupplierList(Data.getMaterialSupplierData).then(res => {
        if (res.data.Status === 1000) {
          Data.MaterialSupplierList = res.data.Data as MaterialSupplierFormType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
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
    const handleCheckedCitiesChange = (value:string[]) => {
      const checkedCount = value.length;
      Data.checkAll = checkedCount === Data.MaterialTypeList.length;
      Data.isIndeterminate = checkedCount > 0
       && checkedCount < Data.MaterialTypeList.length;
    };
    function addMaterialSupplierCloseedClick() {
      Data.checkAll = false;
      Data.isIndeterminate = false;

      Data.MaterialSupplierForm = {
        SupplierID: '',
        SupplierName: '',
        ProvinceID: '',
        CityID: '',
        Address: '',
        Linkman: '',
        ContactWay: '',
        MaterialTypeIDS: [],
      };
    }
    function addMaterialSupplierCloseClick() {
      Data.addMaterialSupplierShow = false;
    }
    async function editMaterialSupplier(item) {
      Data.addMaterialSupplierShow = true;
      Data.MaterialSupplierForm = { ...item };
      handleCheckedCitiesChange(Data.MaterialSupplierForm.MaterialTypeIDS);
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

    function addMaterialSupplierPrimaryClick() {
      const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
      if (!Data.MaterialSupplierForm.SupplierName) {
        // 报错
        messageBox.failSingleError('保存失败', '请输入供应商名称', () => null, () => null);
      } else if (!Data.MaterialSupplierForm.ProvinceID || !Data.MaterialSupplierForm.CityID) {
        // 报错
        messageBox.failSingleError('保存失败', '请选择省市', () => null, () => null);
      } else if (!Data.MaterialSupplierForm.Address) {
        // 报错
        messageBox.failSingleError('保存失败', '请输入详细地址', () => null, () => null);
      } else if (!Data.MaterialSupplierForm.Linkman) {
        // 报错
        messageBox.failSingleError('保存失败', '请输入联系人', () => null, () => null);
      } else if (!Data.MaterialSupplierForm.ContactWay) {
        // 报错
        messageBox.failSingleError('保存失败', '请输入联系电话', () => null, () => null);
      } else if (!reg.test(Data.MaterialSupplierForm.ContactWay)) {
        // 报错
        messageBox.failSingleError('保存失败', '联系电话格式不正确', () => null, () => null);
      } else if (!Data.MaterialSupplierForm.MaterialTypeIDS.length) {
        // 报错
        messageBox.failSingleError('保存失败', '请选择供应物料类型', () => null, () => null);
      } else {
        api.getMaterialSupplierSave(Data.MaterialSupplierForm).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              getMaterialSupplierList();
              addMaterialSupplierCloseClick();
            };
            // 成功
            MpMessage.dialogSuccess(`${Data.MaterialSupplierForm.SupplierID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    function twoSelectChange({ level1Val, level2Val }) {
      Data.MaterialSupplierForm.ProvinceID = level1Val;
      Data.MaterialSupplierForm.CityID = level2Val;
    }
    // 添加供应商
    async function addMaterialSupplier() {
      Data.addMaterialSupplierShow = true;
    }
    const handleCheckAllChange = (val: boolean) => {
      if (val) {
        const a = Data.MaterialTypeList.map(it => it.TypeID as string);
        Data.MaterialSupplierForm.MaterialTypeIDS = a;
      } else {
        Data.MaterialSupplierForm.MaterialTypeIDS = [];
      }
      Data.isIndeterminate = false;
    };
    onMounted(() => {
      if (!commonStore.DistrictTreeList.length) {
        commonStore.getDistrictList();
      }

      getMaterialSupplierList();
      // 获取物料分类
      MaterialWarehouseStore.getMaterialCategoryList();
      api.getMaterialTypeList({}).then(res => {
        if (res.data.Status === 1000) {
          Data.MaterialTypeList = res.data.Data as MaterialTypeListType[];
        }
      });
    });
    return {
      ProvinceList,
      CityList,
      Data,
      commonStore,
      twoSelecValue,
      MaterialWarehouseStore,
      formatAddress,
      useIdGetMaterialTypeName,
      clearCondition,
      getMaterialSupplierList,
      PaginationChange,
      twoSelectChange,
      addMaterialSupplier,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      editMaterialSupplier,
      delMaterialSupplier,
      addMaterialSupplierCloseClick,
      addMaterialSupplierCloseedClick,
      addMaterialSupplierPrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-supplier-manage-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    padding: 20px;
    >.header-top{
      display: flex;
      justify-content: space-between;
    }
    >.top-main{
      display: flex;
      justify-content: space-between;
      .mp-search-input-comp{
        display: flex;
      }
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
