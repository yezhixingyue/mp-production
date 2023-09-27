<template>
  <div class="material-manage-page">
    <header>
      <div class="header-top">
        <div class="bt">
          <mp-button
          type="primary" @click="addMaterialManage">+ 添加物料</mp-button>
          <mp-button
          type="primary" @click="batchAddMaterialManage">批量生成</mp-button>
        </div>
        <SearchInputComp
          :word='Data.getMaterialManageData.KeyWords'
          title="关键词搜索"
          placeholder="请输入搜索关键词"
          resetWords="清空所有筛选条件"
          :changePropsFunc="(words) => Data.getMaterialManageData.KeyWords = words"
          :requestFunc='() => getMaterialManageList()'
          @reset='clearCondition'
          >
        </SearchInputComp>
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
    <main >
        <el-table border fit stripe
        :data="MaterialWarehouseStore.MaterialManageList" style="width: 100%">
          <el-table-column prop="CategoryName" label="分类" min-width="208"/>
          <el-table-column show-overflow-tooltip prop="TypeName" label="类型" min-width="157">
            <template #default="scope:any">
              {{scope.row.TypeName}}（{{scope.row.TypeCode}}）
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Code" label="编码" min-width="157"/>
          <el-table-column prop="AttributeDescribe" label="物料"
          show-overflow-tooltip min-width="192">
          </el-table-column>
          <el-table-column prop="SizeDescribe" label="可选尺寸"
          show-overflow-tooltip min-width="608">
          </el-table-column>
          <el-table-column prop="操作" label="操作" min-width="238">
            <template #default="scope:any">
              <mp-button type="info" link @click="editMaterial(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link @click="delMaterial(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <MpPagination
      style="width: 100%;"
      center
      :nowPage="Data.getMaterialManageData.Page"
      :pageSize="Data.getMaterialManageData.PageSize"
      :total="Data.DataTotal"
      :handlePageChange="PaginationChange" />
    </footer>
    <!-- 添加物料 -->
    <DialogContainerComp
    :title="`${Data.editTypeID ? '修改' : '添加'}物料`"
    :visible='Data.addMaterialManageShow'
    :width="760"
    :primaryClick="addMaterialManagePrimaryClick"
    :closeClick="addMaterialManageCloseClick"
    :closed="addMaterialManageClosed"
    :top="'4vh'"
    class="add-material-manage-dialog-box"
    >
    <template #default>
        <el-scrollbar @scroll="addMaterialManageScroll">
      <div class="add-material-manage-dialog">

        <el-form :model="Data.addMaterialManageForm" label-width="305px">
          <el-form-item :label="`类型：`">
            <span style="height: 32px;max-width: 100%;">
              <MpTip
              effect="dark"
              :content="`${Data.dialogTypeData.CategoryName} ${Data.dialogTypeData.TypeName}（编码：${Data.dialogTypeData.TypeCode}）`"
              placement="top"
              :disabled="`${Data.dialogTypeData.CategoryName} ${Data.dialogTypeData.TypeName}（编码：${Data.dialogTypeData.TypeCode}）`.length < 34">
              {{Data.dialogTypeData.CategoryName}} {{Data.dialogTypeData.TypeName}}（编码：{{Data.dialogTypeData.TypeCode}}）
              </MpTip>
            </span>
            <!-- <span>{{Data.dialogTypeData.CategoryName}} {{Data.dialogTypeData.TypeName}}</span> -->
          </el-form-item>
          <el-form-item :label="`编码：`" class="form-item-required" prop="MaterialCode">
            <el-input
            style="width: 150px;"
            maxlength="10" show-word-limit
            v-model.trim="Data.addMaterialManageForm.MaterialCode" />
          </el-form-item>
          <p>
            编码由 1 到 10 位的英文字母或数字组成，方便记忆，在入库搜索物料时输入编码，可快速定位物料， 类似于超市称重时输入的物品
          </p>
          <el-form-item :label="`${item.AttributeName}：`" class="attributes"
          :class="item.IsRequired?'form-item-required':''"
          v-for="(item, index) in Data.addMaterialManageForm.MaterialRelationAttributes"
          :key="item.AttributeID" :prop="['NumericValue','SelectID','InputSelectValue']">
            <template #label>
              <span style="height: 32px;max-width: 100%;">
                <MpTip
                effect="dark"
                :content="item.AttributeName"
                placement="top"
                :disabled="item.AttributeName.length < 11">
                {{item.AttributeName}}：
                </MpTip>
              </span>
            </template>

          <p v-if="item.AttributeType === 1">
            <NumberTypeItemComp
              ref="NumberTypeItemRef"
              :PropValue="item.NumericValue"
              :InputContent="item.RegularQuantity"
              :Allow="item.IsCustom"
              :AllowDecimal="item.IsAllowDecimal"
              :IsRequired="item.IsRequired"
              :UpdateData="(newVal) => item.NumericValue = newVal">
            </NumberTypeItemComp>
            <span>{{item.AttributeUnit}}</span>
          </p>
            <OptionTypeItemComp
              ref="OptionTypeItemRef"
              v-else
              :PropValue="item.InputSelectValue
              ||item.SelectID"
              :options="item.IsRequired?item.AttributeSelects : [
                {SelectID:'00000000-0000-0000-0000-000000000000', SelectItemValue:`请选择`},
                ...item.AttributeSelects]"
              :Allow="item.IsCustom"
              :UpdateData="(newVal) => UpdateData(item.AttributeSelects || [],newVal,index)">
            </OptionTypeItemComp>
          </el-form-item>
        </el-form>
        <div class="material-type" v-if="MaterialWarehouseStore.MaterialTypeSizeAllList.length">
          <p class="required">可选尺寸：
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
            v-for="size in MaterialWarehouseStore.MaterialTypeSizeAllList"
            :key="size.SizeID" :label="size.SizeID">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="size.SizeDescribe"
                  placement="top"
                  :disabled="size.SizeDescribe.length<15"
                >
                {{size.SizeDescribe}}
                </el-tooltip>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
        </el-scrollbar>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import NumberTypeItemComp from '@/components/common/ElementDisplayTypeComps/NumberTypeItemComp.vue';
import OptionTypeItemComp from '@/components/common/ElementDisplayTypeComps/OptionTypeItemComp.vue';
import {
  reactive, onMounted, computed, ComputedRef, onActivated, Ref, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import { MaterialTypeGroupType } from '@/store/modules/materialWarehouse/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}
interface getMaterialManageDataType {
  TypeID:string,
  CategoryID:number|string,
  Page:number,
  KeyWords: string,
  PageSize:number,
}
interface AttributeSelectsType {
  SelectID: string;
  Sort: number;
  SelectItemValue: string;
}

interface MaterialRelationAttributesType {
  AttributeID: string,
  NumericValue: number|null,
  SelectID: string,
  InputSelectValue: string,
  AttributeName:string
  AttributeType:number
  RegularQuantity:string
  IsAllowDecimal:boolean
  AttributeUnit:string
  IsRequired:boolean
  AttributeSelects:AttributeSelectsType[]
  IsCustom:boolean
  // [a:string]:any
}
interface addMaterialManageFormType {
  ID: string,
  MaterialRelationAttributes: MaterialRelationAttributesType[],
  MaterialCode: string,
  SizeIDS: string[],
  BrandID: number|string,
}
interface dialogTypeDataType {
  CategoryName: string,
  TypeName: string,
  TypeCode:string,
}
interface DataType {
  checkAll:boolean,
  isIndeterminate:boolean,
  addMaterialManageShow:boolean,
  addMaterialManageForm:addMaterialManageFormType,
  editTypeID: string,
  DataTotal: number,
  dialogTypeData:dialogTypeDataType,
  getMaterialManageData: getMaterialManageDataType,
}

export default {
  name: 'materialManagePage',
  components: {
    RadioGroupComp,
    SearchInputComp,
    MpPagination,
    NumberTypeItemComp,
    OptionTypeItemComp,
    DialogContainerComp,
  },
  setup() {
    const NumberTypeItemRef = ref<Ref|null>(null);
    const OptionTypeItemRef = ref<Ref|null>(null);
    const throttleBool = ref(true);
    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      addMaterialManageTitle: '',
      addMaterialManageShow: false,
      checkAll: false,
      isIndeterminate: false,
      addMaterialManageForm: {
        ID: '',
        MaterialRelationAttributes: [],
        MaterialCode: '',
        SizeIDS: [],
        BrandID: 0,
      },
      editTypeID: '',
      dialogTypeData: {
        CategoryName: '',
        TypeName: '',
        TypeCode: '',
      },
      DataTotal: 0,
      getMaterialManageData: {
        TypeID: '',
        CategoryID: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
    });

    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.MaterialTypeGroup]);
    const MaterialTypeList = computed(() => {
      const noType = {
        TypeID: '',
        TypeName: '全部类型',
        TypeCode: '',
      };
      const MaterialType = CategoryList.value.find(it => it.CategoryID === Data.getMaterialManageData.CategoryID);
      if (MaterialType && MaterialType.CategoryID) {
        const temp = MaterialType as MaterialTypeGroupType;
        return [noType, ...temp.MaterialTypes] || [];
      }
      return [noType];
    });
      // 跳转
    function ToMaterialManageSetuepPage(IDs) {
      router.push({
        name: 'materialManageSetuep',
        params: { TypeID: IDs.TypeID, CategoryID: IDs.CategoryID },
      });
    }

    function getMaterialManageList(Page = 1) {
      Data.getMaterialManageData.Page = Page;
      MaterialWarehouseStore.getMaterialManageList(Data.getMaterialManageData, (DataNumber) => {
        Data.DataTotal = DataNumber as number;
      });
    }
    function PaginationChange(newVal) {
      // if (Data.getMaterialManageData.Page === newVal) return;
      // Data.getMaterialManageData.Page = newVal;
      getMaterialManageList(newVal);
    }
    function addMaterialManageCloseClick() {
      // 关闭得时候清空弹框
      Data.addMaterialManageShow = false;
    }

    function addMaterialManageClosed() {
      Data.editTypeID = '';
      Data.checkAll = false;
      Data.isIndeterminate = false;
      MaterialWarehouseStore.MaterialTypeAttributeAllList = [];
      Data.addMaterialManageForm = {
        ID: '',
        MaterialRelationAttributes: [],
        MaterialCode: '',
        SizeIDS: [],
        BrandID: 0,
      };
      Data.dialogTypeData = {
        CategoryName: '',
        TypeName: '',
        TypeCode: '',
      };
    }

    function addMaterialManageScroll() {
      if (throttleBool.value) {
        NumberTypeItemRef.value?.forEach(it => {
          it.blur();
        });
        OptionTypeItemRef.value?.forEach(it => {
          it.blur();
        });
        throttleBool.value = false;
        setTimeout(() => {
          throttleBool.value = true;
        }, 1000);
      }
    }
    // 添加物料;
    function addMaterialManage() {
      if (!Data.getMaterialManageData.TypeID) {
        // 请选择物料类型
        messageBox.failSingle('请选择物料类型', () => null, () => null);
      } else {
        const callback = () => {
          Data.addMaterialManageForm.MaterialRelationAttributes = [];

          MaterialWarehouseStore.MaterialTypeAttributeAllList.forEach(res => {
            Data.addMaterialManageForm.MaterialRelationAttributes.push({
              AttributeID: res.AttributeID,
              NumericValue: null,
              SelectID: '',
              InputSelectValue: '',
              AttributeName: res.AttributeName,
              AttributeType: res.AttributeType,
              RegularQuantity: res.RegularQuantity,
              IsAllowDecimal: res.IsAllowDecimal,
              AttributeUnit: res.AttributeUnit,
              IsRequired: res.IsRequired,
              AttributeSelects: res.AttributeSelects,
              IsCustom: res.IsCustom,
            });
          });
        };
        MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(
          Data.getMaterialManageData.TypeID as string,
          callback,
        );
        MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(
          Data.getMaterialManageData.TypeID as string,
        );

        const Categoryresp = CategoryList.value.filter(res => res.CategoryID === Data.getMaterialManageData.CategoryID);
        Data.dialogTypeData.CategoryName = Categoryresp[0].CategoryName;
        const Typeresp = MaterialTypeList.value.filter(res => res.TypeID === Data.getMaterialManageData.TypeID);
        Data.dialogTypeData.TypeName = Typeresp[0].TypeName;
        Data.dialogTypeData.TypeCode = Typeresp[0].TypeCode;

        Data.addMaterialManageShow = true;
      }
    }
    // 批量生成
    function batchAddMaterialManage() {
      if (!Data.getMaterialManageData.TypeID) {
        // 请选择物料类型
        messageBox.failSingle('请选择物料类型', () => null, () => null);
      } else {
        ToMaterialManageSetuepPage({
          TypeID: Data.getMaterialManageData.TypeID,
          CategoryID: Data.getMaterialManageData.CategoryID,
        });
      }
    }
    const handleCheckedCitiesChange = (value:string[]) => {
      const checkedCount = value.length;
      Data.checkAll = checkedCount === MaterialWarehouseStore.MaterialTypeSizeAllList.length;
      Data.isIndeterminate = checkedCount > 0
       && checkedCount < MaterialWarehouseStore.MaterialTypeSizeAllList.length;
    };
    const handleCheckAllChange = (val: boolean) => {
      if (val) {
        const temp = MaterialWarehouseStore
          .MaterialTypeSizeAllList.map(it => it.SizeID as string);
        Data.addMaterialManageForm.SizeIDS = temp;
      } else {
        Data.addMaterialManageForm.SizeIDS = [];
      }
      Data.isIndeterminate = false;
    };
    function addMaterialManagePrimaryClick() {
      const msg:string[] = [];
      const NoNumber:string[] = [];
      // 表单验证
      Data.addMaterialManageForm.MaterialRelationAttributes.forEach((item) => {
        // 数字输入或选择
        if (item.AttributeType === 1 && item.IsRequired && (!item.NumericValue && item.NumericValue !== 0)) {
          msg.push(item.AttributeName);
          // 选择项选择未填写
        } else if (
          // 是选择项并且是必填项
          item.AttributeType === 2 && item.IsRequired
          // 没选择并且没输入
          && !item.SelectID && !item.InputSelectValue) {
          msg.push(item.AttributeName);
        }
        if (item.AttributeType === 1 && Number.isNaN(Number(item.NumericValue))) {
          NoNumber.push(item.AttributeName);
        }
      });
      // 过滤必填项
      const IsRequired = Data.addMaterialManageForm.MaterialRelationAttributes.some(res => res.IsRequired);
      if (!IsRequired) {
        const noAction = Data.addMaterialManageForm.MaterialRelationAttributes.some(res => !(res.NumericValue || res.InputSelectValue || res.SelectID));
        if (noAction) {
          messageBox.failSingleError('保存失败', '请至少输入一个属性的值', () => null, () => null);
          return;
        }
      }
      if (!Data.addMaterialManageForm.MaterialCode) {
        messageBox.failSingleError('保存失败', '请输入编码', () => null, () => null);
      } else if (NoNumber.length) {
        messageBox.failSingleError('保存失败', `${NoNumber.join('、')}为数字值，请输入数字`, () => null, () => null);
      } else if (msg.length) {
        messageBox.failSingleError('保存失败', `请输入或选择：${msg.join('、')}属性`, () => null, () => null);
      } else if (MaterialWarehouseStore
        .MaterialTypeSizeAllList.length && !Data
        .addMaterialManageForm.SizeIDS.length) {
        messageBox.failSingleError('保存失败', '请选择物料尺寸', () => null, () => null);
      } else {
        // 发送请求
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
              MpMessage.dialogSuccess(`${Data.editTypeID ? '修改' : '添加'}成功`, cb, cb);
            }
          }
        });
      }
    }
    function editMaterial(item) {
      Data.editTypeID = item.TypeID;
      Data.dialogTypeData.TypeName = item.TypeName;
      Data.dialogTypeData.CategoryName = item.CategoryName;
      Data.dialogTypeData.TypeCode = item.TypeCode;
      if (!Data.editTypeID) {
        // 请选择物料类型
      } else {
        const callback = () => {
          Data.addMaterialManageForm.ID = item.ID;
          // 根据获取到的所有属性的id查保存的数据并分别赋值给表单
          MaterialWarehouseStore.MaterialTypeAttributeAllList.forEach(res => {
            let temp = item.MaterialAttributes.find((saveAttributeData) => res.AttributeID
              === saveAttributeData.AttributeID);

            if (!temp) { // 处理可能出现的 已经设置物料 的类型中添加属性后没有值的问题
              temp = {
                SelectValue: null,
                AttributeID: res.AttributeID,
                NumericValue: null,
                SelectID: '',
                InputSelectValue: '',
                AttributeName: res.AttributeName,
                AttributeType: res.AttributeType,
                RegularQuantity: res.RegularQuantity,
                IsAllowDecimal: res.IsAllowDecimal,
                AttributeUnit: res.AttributeUnit,
                IsRequired: res.IsRequired,
                AttributeSelects: res.AttributeSelects,
              };
            } else {
              temp = {
                AttributeID: res.AttributeID,
                NumericValue: temp.NumericValue,
                SelectID: temp.SelectID === '00000000-0000-0000-0000-000000000000' ? '' : temp.SelectID,
                InputSelectValue: temp.InputSelectValue,
                AttributeName: res.AttributeName,
                AttributeType: res.AttributeType,
                RegularQuantity: res.RegularQuantity,
                IsAllowDecimal: res.IsAllowDecimal,
                AttributeUnit: res.AttributeUnit,
                IsRequired: res.IsRequired,
                AttributeSelects: res.AttributeSelects,
                IsCustom: res.IsCustom,
              };
            }
            Data.addMaterialManageForm.MaterialRelationAttributes.push(temp);
          });

          Data.addMaterialManageForm.MaterialCode = item.Code;
          Data.addMaterialManageShow = true;
        };

        MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(
          Data.editTypeID as string,
          callback,
        );
        MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(Data.editTypeID as string, () => {
          Data.addMaterialManageForm.SizeIDS = item.MaterialSizes.map(res => res.SizeID);
          handleCheckedCitiesChange(Data.addMaterialManageForm.SizeIDS);
        });
      }
    }
    function delMaterial(item) {
      // 确定要删除吗？
      let msg = '';
      item.MaterialAttributes.forEach(res => {
        if (res.NumericValue) {
          msg += res.NumericValue || '';
          msg += res.AttributeUnit || '';
        } else {
          msg += res.InputSelectValue || res.SelectValue || '';
        }
      });
      messageBox.warnCancelBox('确定要删除此物料吗？', msg, () => {
        api.getMaterialRemove(item.ID).then(res => {
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
      if (newVal === '00000000-0000-0000-0000-000000000000' || newVal === null || newVal === '') {
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID = '';
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue = '';
        return;
      }
      if (temp) {
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID = newVal;
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue = '';
      } else {
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].SelectID = '';
        Data.addMaterialManageForm
          .MaterialRelationAttributes[index].InputSelectValue = newVal;
      }
    }

    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      if (level1Val !== undefined) {
        Data.getMaterialManageData.CategoryID = level1Val;
        Data.getMaterialManageData.TypeID = level2Val;
        getMaterialManageList();
      }
    }
    onActivated(() => {
      const bool = sessionStorage.getItem('saveGenerative') === 'true';
      if (!bool) return;
      getMaterialManageList();
      sessionStorage.removeItem('saveGenerative');
    });
    onMounted(() => {
      sessionStorage.removeItem('saveGenerative');
      if (!MaterialWarehouseStore.MaterialTypeGroup.length) {
        MaterialWarehouseStore.getMaterialTypeGroup();
      }
      getMaterialManageList();
    });

    return {
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
      addMaterialManageScroll,
      NumberTypeItemRef,
      OptionTypeItemRef,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-manage-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    >.header-top{
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
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
    // margin-top: 10px;
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
    align-items: center;
  }
  .add-material-manage-dialog-box{
    margin-bottom: 0;
  }
  .add-material-manage-dialog{
    min-height: 670px;
    max-height: 670px;
    .el-form{
      .el-form-item{
        margin: 0 auto;
        margin-bottom: 20px;
        // width: ;
        margin-left: 10px;
        align-items: flex-end;
        &.attributes {
          .el-input, .el-select, .el-input-number{
            input{
              text-align: left;
            }
            width: 150px;
          }
          p{
            display: flex;
            >span{
              margin-left: 5px;
              white-space: nowrap;
            }
          }
        }
        .el-form-item__label{
          min-height: 32px;
          height: auto;
          text-align: right;
        }
      }

      >p{
        margin: 0 auto;
        margin-bottom:10px;
        font-size: 12px;
        line-height: 20px;
        color: #F4A307;
        width: 60%;
        margin-top: -14px;
        margin-bottom: 20px;
      }
    }
    .material-type{
      padding: 0 30px;
    }
      .el-checkbox-group{
        width: 100%;
        .el-checkbox{
          max-width: 213px;
          min-width: 213px;
          margin-right: 0px;
          .el-checkbox__label{
            display: inline-block;
            width: calc(100% - 14px - 10px);
            .el-only-child__content{
              max-width: 200px;
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
</style>
