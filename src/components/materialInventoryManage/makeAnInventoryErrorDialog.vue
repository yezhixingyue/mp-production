<template>
  <div>
    <DialogContainerComp
    title="修改盘点库存"
    :visible='Dialog'
    :width="660"
    :primaryClick="errorSavePrimaryClick"
    :closeClick="errorSaveCloseClick"
    :closed="errorSaveClosed"
    :appendToBody="true"
    class="common-make-an-inventory-error-dialog"
    >
    <template #default>
      <div class="make-an-inventory-error-dialog">
        <div>{{materialInfo?.CurrentPositionName}}</div>
        <div>
          <div class="between">
            <span class="value">
            {{materialInfo?.AttributeDescribe}}&nbsp;
             {{materialInfo?.SizeDescribe}}
            </span>
          </div>
        </div>
        <div>
          {{materialInfo?.Code}}&nbsp; &nbsp;
          {{`${materialInfo?.Stock}${materialInfo?.StockUnit}`}}&nbsp;&nbsp;
          <mp-button
          type="primary" @click="Data.editMaterialShow = true" link>修改物料</mp-button>
        </div>
        <div>
          正确物料：
          <template v-if="Data.newMaterialInfo">
             <span class="value">
              {{Data.newMaterialInfo.AttributeDescribe}}&nbsp;
               {{Data.newMaterialInfo.Size?.Name}}
             </span>
             &nbsp;&nbsp;
              <mp-button @click="Data.newMaterialInfo = null" link type="danger">删除</mp-button>
            </template>
        </div>
        <div>
          <span class="label">
            正确数量：
          </span>
          <el-input style="margin-right:5px" placeholder="请输入正确数量"
            :controls="false" v-model="Data.editDeliveryForm.Number" />
            {{materialInfo?.StockUnit}}
        </div>
        <div style="margin-top:20px;align-items: flex-start;">
          <span class="label">
            备注(选填)：
          </span>
          <el-input type="textarea" v-model="Data.editDeliveryForm.Remark" placeholder="请输入备注"/>
        </div>

          <DialogContainerComp
          title="修改物料"
          :visible='Data.editMaterialShow'
          :width="660"
          :primaryClick="editMaterialPrimaryClick"
          :closeClick="editMaterialCloseClick"
          :closed="editMaterialClosed"
          primaryText="确定"
          :appendToBody="true"
          class="common-select-material-dialog"
          >
          <template #default>
            <div class="select-material-dialog">
              <div>{{materialInfo?.CurrentPositionName}}</div>
              <div>
                <div class="between">
                  <span class="value">
                  {{materialInfo?.AttributeDescribe}}&nbsp;
                  {{materialInfo?.SizeDescribe}}
                  </span>
                </div>
              </div>
              <div>
                {{materialInfo?.Code}}&nbsp; &nbsp;
                {{`${materialInfo?.Stock}${materialInfo?.StockUnit}`}}&nbsp;&nbsp;
              </div>
              <div>
                新物料：
                  <span class="value red" >
                    {{Data.tempMaterialInfo?.AttributeDescribe}}&nbsp;
                    {{Data.tempMaterialInfo?.Size?.Name}}
                  </span>
              </div>

              <div>
                <span class="label">
                  SKU编码：
                </span>
                  <p class="sku-code">
                    <el-input @keyup.enter="getMaterial()"
                    placeholder="请输入完整SKU编码，包括尺寸编码"
                    v-model.trim="Data.getMaterialData.SKUCode"/>
                    <mp-button link type="primary" @click="getMaterial()">查询</mp-button>
                  </p>
              </div>
              <div>
                <el-divider>
                  <span class="maybe">或者</span>
                </el-divider>
              </div>
              <div class="material" style="align-items: flex-start;">
                <span class="label">
                  选择物料：
                </span>
                <div>
                  <ThreeCascaderComp
                    v-if="Data.editMaterialShow"
                    ref="ThreeCascaderComp"
                    :change="ThreeCascaderCompChange"
                    :MaterialTypeGroup="MaterialTypeGroup"
                    ></ThreeCascaderComp>
                    <OneLevelSelect
                    v-if="Data.itemSelectTempMaterial"
                      :options='SizeSelects.map(it => it.Size)'
                      :defaultProps="{
                        value:'ID',
                        label:'Name',
                      }"
                      :value='Data.SizeSelects'
                      @change="SizeSelectChange"
                      :width="328"
                      :placeholder="'请选择物料尺寸'"
                      ></OneLevelSelect>
                    <OneLevelSelect
                      v-else
                      :options='[]'
                      :width="328"
                      :placeholder="'请选择物料尺寸'"
                      ></OneLevelSelect>
                </div>
              </div>
            </div>
          </template>
          </DialogContainerComp>

      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import messageBox from '@/assets/js/utils/message';
import { MaterialInfoType } from '@/assets/Types/common';
import api from '@/api';

import { MaterialDataItemType, MaterialSelectsType, SizeSelectsType } from '@/assets/Types/materialWarehouse/useSKUandSelectMaterialType';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';

import {
  ref, Ref, reactive, computed, onMounted,
} from 'vue';

interface MaterialTypes {
  TypeID: string,
  TypeName: string
}
interface MaterialTypeGroupType {
  CategoryID: number,
  CategoryName: string,
  MaterialTypes: MaterialTypes[]
}
interface getMaterialDataType {
  MaterialID: string,
  SKUCode: string|number,
}
interface editDeliveryFormType {
    MaterialID: string,
    Number: number|null,
    Remark: string|number,
    MaterialInfo: string
}

interface DataType {
  SizeSelects: null | number,
  editMaterialShow: boolean,
  getMaterialData: getMaterialDataType,
  editDeliveryForm: editDeliveryFormType,
  tempMaterialInfo: MaterialInfoType|null,
  newMaterialInfo: MaterialInfoType|null,
  allSelectTempMaterial:MaterialDataItemType | null,
  itemSelectTempMaterial:MaterialSelectsType | null,
}
export default {
  components: {
    DialogContainerComp,
    OneLevelSelect,
    ThreeCascaderComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    changeVisible: {
      type: Function,
      default: () => null,
    },
    dialogSaveInventoryError: {
      type: Function,
      default: () => null,
    },
    materialInfo: {
      type: Object,
      defalut: null,
    },
  },
  setup(props) {
    const ThreeCascaderComp:Ref = ref(null);
    const MaterialTypeGroup = ref<MaterialTypeGroupType[]>([]);
    const Data:DataType = reactive({
      // 选择的尺寸
      SizeSelects: null,
      editMaterialShow: false,
      // 此货位还有物料时添加物料的物料查询表单
      getMaterialData: {
        MaterialID: '',
        SKUCode: '',
      },
      // 修改物料/数量
      editDeliveryForm: {
        MaterialID: '',
        Number: null,
        Remark: '',
        MaterialInfo: '',
      },
      tempMaterialInfo: null,
      newMaterialInfo: null,
      // 下拉选择的临时物料
      allSelectTempMaterial: null,
      itemSelectTempMaterial: null,
    });
    const Dialog = computed({
      get() {
        return props.visible;
      },
      set(newVal) {
        props.changeVisible(newVal);
      },
    });
    const SizeSelects = computed(() => {
      if (Data.itemSelectTempMaterial?.SizeSelects.length && !Data.itemSelectTempMaterial.SizeSelects[0].Size) {
        return [];
      }
      // Data.itemSelectTempMaterial.SizeSelects
      return Data.itemSelectTempMaterial?.SizeSelects || [];
    });
    function errorSaveCloseClick() {
      props.changeVisible(false);
    }
    function errorSaveClosed() {
      Data.editDeliveryForm.Number = null;
      Data.editDeliveryForm.Remark = '';
      // 清空表单
    }
    // function getMsg(MaterialInfo) {
    //   const msg:string[] = [];
    //   MaterialInfo?.MaterialAttributes.forEach((item) => {
    //     if (item.NumericValue) {
    //       msg.push(`${item.NumericValue}${item.AttributeUnit}`);
    //     } else {
    //       msg.push(`${item.InputSelectValue || item.SelectValue || ''}`);
    //     }
    //   });
    //   msg.push(MaterialInfo.SizeDescribe);
    //   msg.push(`（${MaterialInfo.Code}）`);
    //   return msg;
    // }
    // 此货位还有物料时添加物料的弹框
    function errorSavePrimaryClick() {
      // const MaterialInfo:MaterialInfoType = Data.newMaterialInfo
      // || props.materialInfo as MaterialInfoType;
      // 组装 MaterialInfo 数据
      const temp = { ...Data.editDeliveryForm };
      if (Data.newMaterialInfo) {
        temp.MaterialID = Data.newMaterialInfo.MaterialID;
      } else {
        temp.MaterialID = props.materialInfo?.MaterialID;
      }
      props.dialogSaveInventoryError(temp);
    }

    function editMaterialCloseClick() {
      Data.editMaterialShow = false;
    }
    function editMaterialClosed() {
      // 清空表单
      Data.tempMaterialInfo = null;
      Data.getMaterialData.SKUCode = '';
      Data.SizeSelects = null;
    }
    // 修改物料
    function editMaterialPrimaryClick() {
      if (!Data.tempMaterialInfo) {
        // 请选择物料
        messageBox.failSingle('请选择物料', () => null, () => null);
      } else {
        Data.newMaterialInfo = { ...Data.tempMaterialInfo };
        editMaterialCloseClick();
        Data.tempMaterialInfo = null;
      }
    }

    // 格式化数据
    function SizeSelectChange(ID) {
      let SizeObj:SizeSelectsType|undefined;
      if (ID !== '00000000-0000-0000-0000-000000000000') {
        Data.SizeSelects = ID;
        SizeObj = Data.itemSelectTempMaterial?.SizeSelects.find(res => res.Size.ID === ID);
      } else {
        SizeObj = Data.itemSelectTempMaterial?.SizeSelects[0];
      }
      const temp = {
        MaterialID: SizeObj?.MaterialID,
        Code: SizeObj?.Code,
        Size: SizeObj?.Size,
        MaterialAttributes: Data.itemSelectTempMaterial?.MaterialAttributes,
        StockUnit: Data.allSelectTempMaterial?.StockUnit,
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects,
        AttributeDescribe: Data.itemSelectTempMaterial?.AttributeDescribe,
      };
      Data.tempMaterialInfo = temp as MaterialInfoType;
      Data.getMaterialData.SKUCode = '';
    }
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = allSellectMaterial as MaterialDataItemType;
      Data.itemSelectTempMaterial = itemMaterial as MaterialSelectsType;

      if (itemMaterial?.SizeSelects.length && !itemMaterial.SizeSelects[0].Size) {
        SizeSelectChange('00000000-0000-0000-0000-000000000000');
      }
    }
    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
        return;
      }
      // 物料筛选
      api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
        if (res?.data?.Data) {
          Data.tempMaterialInfo = res.data.Data as MaterialInfoType;
          Data.tempMaterialInfo.UnitSelects = Data.tempMaterialInfo.UnitSelects
            .filter(it => it.UnitPurpose === 1);
          ThreeCascaderComp.value.reset();
        } else {
          messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
        }
      });
    }
    onMounted(() => {
      api.getMaterialTypeGroup(true).then(res => {
        if (res?.data?.isSuccess) {
          MaterialTypeGroup.value = res.data.Data as MaterialTypeGroupType[];
        }
      });
    });
    return {
      Data,
      Dialog,
      SizeSelects,
      ThreeCascaderComp,
      getMaterial,
      errorSaveCloseClick,
      errorSaveClosed,
      errorSavePrimaryClick,
      editMaterialCloseClick,
      editMaterialClosed,
      editMaterialPrimaryClick,
      ThreeCascaderCompChange,
      SizeSelectChange,
      MaterialTypeGroup,
    };
  },
};
</script>
<style lang="scss">
.common-make-an-inventory-error-dialog, .common-select-material-dialog{
  .el-dialog__body{
    padding-top: 20px;
  }
  .el-dialog__footer{
    .el-button{
      width: 200px;
      height: 60px;
      font-size: 30px;
    }
  }
}
  .make-an-inventory-error-dialog{
    padding: 0 14px;
    font-size: 16px;
    line-height: 30px;
    >div{
      display: flex;
      align-items: center;
      .label{
        width:96px;
        font-weight: 600;
        text-align: right;
      }
      .el-input{
        margin-top: 10px;
        width: 204px;
        &.el-input{
          // width: 204px;
          height: 54px;
          font-size: 16px;
          font-size: 16px;
        }
      }
      .el-textarea{
        flex: 1;
        .el-textarea__inner{
          height: 158px;
          font-size: 16px;
        }
      }
    }
    .red{
      color: #FF3769;
      .el-form-item__label{
        color: #FF3769;

      }
    }
  }
  .select-material-dialog{
    padding: 0 52px;
    font-size: 16px;
    line-height: 30px;
    >div{
      display: flex;
      align-items: center;
      .label{
        // width:96px;
        font-weight: 600;
        text-align: right;
      }
      .sku-code{
        flex: 1;
        display: flex;
        .el-input{
          height: 54px;
          font-size: 16px;
        }
      }
      .maybe{
        color: #F4A307;
        font-size: 20px;
        font-weight: 600;
      }
      &.material{
        .el-cascader{
          width: 414px;
          .el-input{
            height: 54px;
            font-size: 16px;
          }
        }
        .mp-one-level-select{
          .el-select{
            width: 328px;
            margin-top: 15px;
            .select-trigger, .el-input, &.el-select{
              height: 54px;
              font-size: 16px;
            }
          }
        }
      }
    }
    .select-material{
      .el-cascader{
        width: 300px;
        margin-right: 20px;
      }
    }
    .red{
      color: #FF3769;
      .el-form-item__label{
        color: #FF3769;

      }
    }
  }
</style>
