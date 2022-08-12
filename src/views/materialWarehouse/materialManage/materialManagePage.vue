<template>
  <div class="material-manage-page">
    <header>
      <div class="header-top">
        <el-button :disabled="!Data.getMaterialManageData.TypeID"
        type="primary" @click="addMaterialManage">+ 添加物料</el-button>
        <el-button :disabled="!Data.getMaterialManageData.TypeID"
        type="primary" @click="batchAddMaterialManage">批量生成</el-button>
      </div>
      <MpCardContainer :TopAndButtomPadding = '12'>
        <div class="top-main">
          <TowLevelSelect
            :title='"二级"'
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
            ></TowLevelSelect>

            <SearchInputComp
              :word='Data.getMaterialManageData.KeyWords'
              title="关键词搜索"
              placeholder="请输入搜索关键词"
              resetWords="清空所有筛选条件"
              :changePropsFunc="(words) => Data.getMaterialManageData.KeyWords = words"
              :requestFunc='getMaterialManageList'
              @reset='clearCondition'
              >
            </SearchInputComp>
        </div>
      </MpCardContainer>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.MaterialManageList" style="width: 100%">

          <el-table-column prop="CategoryName" label="分类" min-width="208"/>
          <el-table-column prop="TypeName" label="类型" min-width="157"/>
          <el-table-column prop="物料" label="物料"
          show-overflow-tooltip min-width="192">
            <template #default="scope">
              <template v-for="(item, index) in scope.row.MaterialAttributes"
              :key="item.AttributeID">
                {{index === 0 ? '' : ' - ' }}
                <template v-if="item.NumericValue">
                  <span>{{item.NumericValue}}</span>
                </template>
                <template v-else>
                  <span>{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="可选尺寸" label="可选尺寸" min-width="608">
            <template #default="scope">
              <template v-for="(it,i) in scope.row.MaterialSizes">
                {{it.SizeName}}
                {{it.SizeWidth}}x{{it.SizeLength}}
                {{i<scope.row.MaterialSizes.length-1?'mm、':'mm'}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="操作" label="操作" min-width="238">
            <template #default="scope">
              <el-button type="primary" link @click="editMaterial(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link @click="delMaterial(scope.row.ID)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <MpPagination
          :nowPage="Data.getMaterialManageData.Page"
          :pageSize="Data.getMaterialManageData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange"/>
        </div>
      </MpCardContainer>
    </main>
    <!-- 添加物料 -->
    <DialogContainerComp
    :title="`${Data.editTypeID ? '修改' : '添加'}物料`"
    :visible='Data.addMaterialManageShow'
    :width="660"
    :primaryClick="addMaterialManagePrimaryClick"
    :closeClick="addMaterialManageCloseClick"
    :closed="addMaterialManageClosed"
    :top="'10vh'"
    >
    <template #default>
      <div class="add-material-manage-dialog">
        <el-form :model="Data.addMaterialManageForm" label-width="120px">
          <el-form-item :label="`类型：`">
            <span>{{Data.dialogTypeData.CategoryName}} {{Data.dialogTypeData.TypeName}}</span>
          </el-form-item>
          <el-form-item :label="`编码：`">
            <el-input
            v-model="Data.addMaterialManageForm.MaterialCode" />
          </el-form-item>
          <p>
            编码由 1 到 10 位的英文字母或数字组成，方便记忆，在入库搜索物料时输入编码，可快速定位物料， 类似于超市称重时输入的物品
          </p>
          <el-form-item :label="`${item.AttributeName}：`"
          v-for="(item, index) in MaterialWarehouseStore.MaterialTypeAttributeAllList"
          :key="item.AttributeID">
            <NumberTypeItemComp
              v-if="item.AttributeType === 1"
              :PropValue="Data.addMaterialManageForm.
              MaterialRelationAttributes[index].NumericValue"
              :InputContent="item.RegularQuantity"
              :Allow="item.IsAllowDecimal"
              :UpdateData="(newVal) => Data.addMaterialManageForm
              .MaterialRelationAttributes[index].NumericValue = newVal">
            </NumberTypeItemComp>
            <OptionTypeItemComp
              v-else
              :PropValue="Data.addMaterialManageForm.
              MaterialRelationAttributes[index].InputSelectValue
              ||Data.addMaterialManageForm.
              MaterialRelationAttributes[index].SelectID"
              :options="item.AttributeSelects"
              :Allow="item.IsAllowDecimal"
              :UpdateData="(newVal) => UpdateData(item.AttributeSelects,newVal,index)">
            </OptionTypeItemComp>
          </el-form-item>
        </el-form>
        <div class="material-type">
          <p>可选尺寸：
            <el-checkbox
              v-model="Data.checkAll"
              :indeterminate="Data.isIndeterminate"
              @change="handleCheckAllChange"
            >所有尺寸</el-checkbox>
          </p>
          <el-checkbox-group
            v-model="Data.addMaterialManageForm.SizeIDS"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
            v-for="city in MaterialWarehouseStore.MaterialTypeSizeAllList"
            :key="city.SizeID" :label="city.SizeID">
            {{city.SizeName}}{{city.SizeLength}}x{{city.SizeWidth}}mm
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import NumberTypeItemComp from '@/components/common/ElementDisplayTypeComps/NumberTypeItemComp.vue';
import OptionTypeItemComp from '@/components/common/ElementDisplayTypeComps/OptionTypeItemComp.vue';
import {
  ref, reactive, onMounted, watch, computed, ComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getMaterialManageDataType {
  TypeID:number|string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface MaterialAttributesType {
  CodeID: number| string,
  AttributeID: number| string,
  SelectID: number| string,
  NumericValue: string,
  InputSelectValue: string,
  SelectValue: string,
}
interface MaterialSizesType {
  CodeID: number| string,
  SizeName: string,
  SizeLength: number,
  SizeWidth: number,
}

interface MaterialManageListType {
  CategoryID: number| string,
  CategoryName: string,
  ID: number| string,
  TypeID: number| string,
  TypeName: string,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  MaterialSizes: MaterialSizesType[]
}
interface MaterialRelationAttributesType {
  AttributeID: number|string,
  NumericValue: string,
  SelectID: number|string,
  InputSelectValue: string,
}
interface addMaterialManageFormType {
  ID: number|string,
  MaterialRelationAttributes: MaterialRelationAttributesType[],
  MaterialCode: string,
  SizeIDS: number[],
  BrandID: number|string,
}
interface dialogTypeDataType {
  CategoryName: string,
  TypeName: string,
}
interface DataType {
  checkAll:boolean,
  isIndeterminate:boolean,
  addMaterialManageShow:boolean,
  addMaterialManageForm:addMaterialManageFormType,
  editTypeID: null|number,
  DataTotal: number,
  dialogTypeData:dialogTypeDataType,
  getMaterialManageData: getMaterialManageDataType,
  MaterialManageList:MaterialManageListType[]
}

export default {
  name: 'materialManagePage',
  components: {
    MpCardContainer,
    TowLevelSelect,
    SearchInputComp,
    MpPagination,
    NumberTypeItemComp,
    OptionTypeItemComp,
    DialogContainerComp,
  },
  setup() {
    const router = useRouter();
    const h = ref(0);
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      addMaterialManageTitle: '',
      addMaterialManageShow: false,
      checkAll: false,
      isIndeterminate: false,
      addMaterialManageForm: {
        ID: 0,
        MaterialRelationAttributes: [],
        MaterialCode: '',
        SizeIDS: [],
        BrandID: 0,
      },
      editTypeID: null,
      dialogTypeData: {
        CategoryName: '',
        TypeName: '',
      },
      DataTotal: 0,
      getMaterialManageData: {
        TypeID: '',
        CategoryID: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      MaterialManageList: [],
    });

    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '不限' },
      ...MaterialWarehouseStore.CategoryList]);
    const MaterialTypeList = computed(() => [{ TypeID: '', TypeName: '不限' },
      ...MaterialWarehouseStore.MaterialTypeList]);
      // 跳转
    function ToMaterialManageSetuepPage(ID) {
      router.push({
        name: 'materialManageSetuep',
        params: { TypeID: ID },
      });
    }

    function getMaterialManageList() {
      api.getMaterialList(Data.getMaterialManageData).then(res => {
        if (res.data.Status === 1000) {
          // 成功
          Data.MaterialManageList = res.data.Data as MaterialManageListType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getMaterialManageData.Page === newVal) return;
      Data.getMaterialManageData.Page = newVal;
      getMaterialManageList();
    }
    function addMaterialManageCloseClick() {
      // 关闭得时候清空弹框
      Data.addMaterialManageShow = false;
    }

    function addMaterialManageClosed() {
      Data.editTypeID = null;
      Data.checkAll = false;
      Data.isIndeterminate = false;
      MaterialWarehouseStore.MaterialTypeAttributeAllList = [];
      Data.addMaterialManageForm = {
        ID: 0,
        MaterialRelationAttributes: [],
        MaterialCode: '',
        SizeIDS: [],
        BrandID: 0,
      };
      Data.dialogTypeData = {
        CategoryName: '',
        TypeName: '',
      };
    }

    // 添加物料;
    function addMaterialManage() {
      if (!Data.getMaterialManageData.TypeID) {
        // 请选择物料类型
      } else {
        const callback = () => {
          Data.addMaterialManageForm.MaterialRelationAttributes = [];
          MaterialWarehouseStore.MaterialTypeAttributeAllList.forEach(res => {
            Data.addMaterialManageForm.MaterialRelationAttributes.push({
              AttributeID: res.AttributeID,
              NumericValue: '',
              SelectID: '',
              InputSelectValue: '',
            });
          });
        };
        MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(
          Data.getMaterialManageData.TypeID as number,
          callback,
        );
        MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(
          Data.getMaterialManageData.TypeID as number,
        );
        const Categoryresp = CategoryList.value.filter(res => res.CategoryID);
        Data.dialogTypeData.CategoryName = Categoryresp[0].CategoryName;
        const Typeresp = MaterialTypeList.value.filter(res => res.TypeID);
        Data.dialogTypeData.TypeName = Typeresp[0].TypeName;

        Data.addMaterialManageShow = true;
      }
    }
    // 批量生成
    function batchAddMaterialManage() {
      if (!Data.getMaterialManageData.TypeID) {
        // 请选择物料类型
      }
      ToMaterialManageSetuepPage(Data.getMaterialManageData.TypeID);
    }
    const handleCheckedCitiesChange = (value:number[]) => {
      console.log(value, MaterialWarehouseStore.MaterialTypeSizeAllList);

      const checkedCount = value.length;
      Data.checkAll = checkedCount === MaterialWarehouseStore.MaterialTypeSizeAllList.length;
      Data.isIndeterminate = checkedCount > 0
       && checkedCount < MaterialWarehouseStore.MaterialTypeSizeAllList.length;
    };
    const handleCheckAllChange = (val: boolean) => {
      if (val) {
        const temp = MaterialWarehouseStore
          .MaterialTypeSizeAllList.map(it => it.SizeID as number);
        Data.addMaterialManageForm.SizeIDS = temp;
      } else {
        Data.addMaterialManageForm.SizeIDS = [];
      }
      Data.isIndeterminate = false;
    };
    function addMaterialManagePrimaryClick() {
      // 表单验证
      MaterialWarehouseStore.MaterialTypeAttributeAllList.forEach((item, index) => {
        // 数字输入或选择
        if (item.AttributeType === 1 && !Data.addMaterialManageForm
          .MaterialRelationAttributes[index].NumericValue) {
          // 数字输入框未填写
          if (item.RegularQuantity) {
            // label  {{item.AttributeName{{ 未填写
          }
        } else if (item.AttributeSelects.length && !Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID) {
          // 未选择
        } else if (!Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue) {
          // 未自定义选项
        } else {
          console.log('a');
        }
      });
      api.getMaterialSave({
        TypeID: Data.editTypeID || Data.getMaterialManageData.TypeID,
        Materials: [
          Data.addMaterialManageForm,
        ],
      }).then(res => {
        if (res.data.Status === 1000) {
          if (res.data.Status === 1000) {
            // 添加成功
            const cb = () => {
              addMaterialManageCloseClick();
              getMaterialManageList();
            };
            // 成功
            messageBox.successSingle(`${Data.editTypeID ? '修改' : '添加'}成功`, cb, cb);
          }
        }
      });
    }
    function editMaterial(item) {
      Data.editTypeID = item.TypeID;
      Data.dialogTypeData.TypeName = item.TypeName;
      Data.dialogTypeData.CategoryName = item.CategoryName;
      if (!Data.editTypeID) {
        // 请选择物料类型
      } else {
        const callback = () => {
          console.log('aaaaaaaaaaaaaaaaaaaaa');

          Data.addMaterialManageForm.ID = item.ID;
          // 根据获取到的所有属性的id查保存的数据并分别赋值给表单
          MaterialWarehouseStore.MaterialTypeAttributeAllList.forEach(res => {
            let temp = item.MaterialAttributes.find((saveAttributeData) => res.AttributeID
              === saveAttributeData.AttributeID);
            console.log(temp);
            if (!temp) { // 处理可能出现的 已经设置物料 的类型中添加属性后没有值的问题
              temp = {
                SelectValue: null,
                AttributeID: res.AttributeID,
                NumericValue: '',
                SelectID: '',
                InputSelectValue: '',
              };
            }
            Data.addMaterialManageForm.MaterialRelationAttributes.push(temp);
          });

          Data.addMaterialManageForm.MaterialCode = item.Code;
          Data.addMaterialManageShow = true;
        };

        MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(
          Data.editTypeID as number,
          callback,
        );
        MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(Data.editTypeID as number, () => {
          Data.addMaterialManageForm.SizeIDS = item.MaterialSizes.map(res => res.SizeID);
          handleCheckedCitiesChange(Data.addMaterialManageForm.SizeIDS);
        });
      }
    }
    function delMaterial(ID) {
      // 确定要删除吗？

      messageBox.warnCancelMsgSM('确定要删除此物料吗？', () => {
        api.getMaterialRemove(ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getMaterialManageList();
          }
        });
      }, () => undefined);
    }
    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: Data.getMaterialManageData.CategoryID,
      level2Val: Data.getMaterialManageData.TypeID,
    }));
    // 清空筛选项
    function clearCondition() {
      Data.getMaterialManageData = {
        TypeID: '',
        CategoryID: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    }
    function UpdateData(AttributeSelects, newVal, index) {
      const temp = AttributeSelects.find(res => res.SelectID === newVal);
      if (temp) {
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID = newVal;
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue = '';
      } else {
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID = 0;
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue = newVal;
      }
    }
    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      Data.getMaterialManageData.CategoryID = level1Val;
      Data.getMaterialManageData.TypeID = level2Val;
      getMaterialManageList();
    }
    watch(() => twoSelecValue.value.level1Val, (newValue) => {
      MaterialWarehouseStore.getMaterialTypeAll(newValue as number);
    });

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-manage-page header', 20);
      console.log(h.value);
      window.onresize = () => {
        h.value = getHeight('.material-manage-page header', 20);
      };
    }

    onMounted(() => {
      setHeight();
      MaterialWarehouseStore.getMaterialCategoryList();
      getMaterialManageList();
    });

    return {
      h,
      Data,
      CategoryList,
      MaterialTypeList,
      editMaterial,
      delMaterial,
      clearCondition,
      twoSelectChange,
      getMaterialManageList,
      addMaterialManage,
      batchAddMaterialManage,
      MaterialWarehouseStore,
      UpdateData,
      twoSelecValue,
      PaginationChange,
      addMaterialManagePrimaryClick,
      addMaterialManageCloseClick,
      addMaterialManageClosed,
      handleCheckedCitiesChange,
      handleCheckAllChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-manage-page{
  >header{
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
    }
  }
  .add-material-manage-dialog{
    .el-form{
      .el-form-item{
        margin: 0 auto;
        margin-bottom: 20px;
        width: 370px;
        .el-input, .el-select{
          width: 100%;
        }
      }
      >p{
        margin-bottom:10px;
        line-height: 30px;
        color: #F4A307;
      }
    }
  }
}
</style>
