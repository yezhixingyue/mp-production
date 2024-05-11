<template>
  <div>
    <DialogContainerComp
    title="添加新物料"
    :visible='Dialog'
    :width="660"
    :primaryClick="addMaterialPrimaryClick"
    :closeClick="addMaterialCloseClick"
    :closed="addMaterialClosed"
    :appendToBody="true"
    class="common-add-material-dialog"
    >
    <template #default>
      <div class="add-material-dialog">
        <div style="font-size: 18px;font-weight: 600;margin-top: -10px;margin-bottom: 10px;">
          {{materialInfo?.CurrentPositionName}}
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
              v-if="Dialog"
              ref="ThreeCascaderComp"
              :change="ThreeCascaderCompChange"
              ></ThreeCascaderComp>
              <OneLevelSelect
                :options='SizeSelects'
                :defaultProps="{
                  value:'SizeID',
                  label:'SizeDescribe',
                }"
                :value='Data.SizeSelects'
                @change="SizeSelectChange"
                :width="328"
                :placeholder="'请选择物料尺寸'"
                ></OneLevelSelect>
          </div>
        </div>
        <div style="margin: 10px 0;">
          <span class="label">
            新物料：
          </span>
            <span style="color:#FF0000;" v-if="Data.checkedMaterial">
              {{Data.checkedMaterial.AttributeDescribe}}
              {{Data.checkedMaterial?.SizeDescribe}}
              {{Data.checkedMaterial?.Code}}
            </span>
        </div>
        <div style="margin-top: 10px;">
          <span class="label">
            正确数量：
          </span>
          <el-input-number style="margin-right:5px" placeholder="请输入正确数量"
            :controls="false" v-model="Data.inDeliveryForm.Number" />
            {{Data.checkedMaterial?.StockUnit}}
        </div>
        <div style="margin-top:20px;align-items: flex-start;">
          <span class="label">
            备注(选填)：
          </span>
          <el-input type="textarea" v-model="Data.inDeliveryForm.Remark" placeholder="请输入备注"/>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import messageBox from '@/assets/js/utils/message';
import {
  reactive, computed, Ref, ref,
} from 'vue';
import api from '@/api';
import { MaterialInfoType } from '@/assets/Types/common';
import { MaterialDataItemType, MaterialSelectsType } from '@/assets/Types/materialWarehouse/useSKUandSelectMaterialType';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';

interface getMaterialDataType {
  MaterialID: string,
  SizeID: string,
  SKUCode: string|number,
}
interface inDeliveryFormType {
    MaterialID: string,
    Number: number|null,
    Remark: string|number,
}
interface DataType {
  SizeSelects: null | number,
  addMaterialShow: boolean,
  getMaterialData: getMaterialDataType,
  inDeliveryForm: inDeliveryFormType,
  checkedMaterial:MaterialInfoType | null,
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
    dialogSaveMaterial: {
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
    const Data:DataType = reactive({
      SizeSelects: null,
      addMaterialShow: false,
      // 此货位还有物料时添加物料的物料查询表单
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 此货位还有物料时添加物料的表单
      inDeliveryForm: {
        MaterialID: '',
        Number: null,
        Remark: '',
      },
      // 查询到的物料
      checkedMaterial: null,
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
      if (Data.itemSelectTempMaterial?.SizeSelects?.length && !Data.itemSelectTempMaterial.SizeSelects[0].SizeDescribe) {
        return [];
      }
      return Data.itemSelectTempMaterial?.SizeSelects || [];
    });

    function addMaterialCloseClick() {
      props.changeVisible(false);
    }
    function addMaterialClosed() {
      // 清空表单
      Data.SizeSelects = null;

      Data.getMaterialData = {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      };
      // 此货位还有物料时添加物料的表单
      Data.inDeliveryForm = {
        MaterialID: '',
        Number: null,
        Remark: '',
      };
      // 查询到的物料
      Data.checkedMaterial = null;
      // 下拉选择的临时物料
      Data.allSelectTempMaterial = null;
      Data.itemSelectTempMaterial = null;
    }
    // 此货位还有物料时添加物料的弹框
    function addMaterialPrimaryClick() {
      if (!Data.checkedMaterial) {
        messageBox.failSingleError('保存失败', '请选择物料', () => null, () => null);
      } else if (!Data.inDeliveryForm.Number) {
        messageBox.failSingleError('保存失败', '请输入数量', () => null, () => null);
      } else {
        const temp = {
          ...Data.inDeliveryForm,
        };
        temp.MaterialID = Data.checkedMaterial?.MaterialID as string;
        props.dialogSaveMaterial(temp);
      }
      // 组装 MaterialInfo 数据

      // const msg:string[] = [];
      // Data.checkedMaterial?.MaterialAttributes.forEach((item) => {
      //   if (item.NumericValue) {
      //     msg.push(`${item.NumericValue}${item.AttributeUnit}`);
      //   } else {
      //     msg.push(`${item.InputSelectValue || item.SelectValue || ''}`);
      //   }
      // });
      // msg.push(Data.checkedMaterial?.SizeDescribe || '');
      // msg.push(`（${Data.checkedMaterial?.Code}）`);
    }

    // 格式化数据
    function SizeSelectChange(ID) {
      const SizeObj = Data.itemSelectTempMaterial?.SizeSelects.find(res => res.SizeID === ID);
      const temp = {
        MaterialID: SizeObj?.MaterialID,
        Code: SizeObj?.Code,
        SizeDescribe: SizeObj?.SizeDescribe,
        MaterialAttributes: Data.itemSelectTempMaterial?.MaterialAttributes,
        StockUnit: Data.allSelectTempMaterial?.StockUnit,
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects,
        AttributeDescribe: Data.itemSelectTempMaterial?.AttributeDescribe,
      };
      Data.checkedMaterial = { ...temp } as MaterialInfoType;
      if (ID !== '00000000-0000-0000-0000-000000000000') {
        Data.SizeSelects = ID;
      }
      Data.getMaterialData.SKUCode = '';
    }
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = { ...allSellectMaterial } as MaterialDataItemType;
      Data.itemSelectTempMaterial = { ...itemMaterial } as MaterialSelectsType;

      if (itemMaterial?.SizeSelects.length && !itemMaterial.SizeSelects[0].SizeDescribe) {
        SizeSelectChange(itemMaterial.SizeSelects[0].SizeID);
      }
    }
    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
      } else {
        // 物料筛选
        api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
          if (res?.data.Data) {
            Data.checkedMaterial = res.data.Data as MaterialInfoType;
            Data.checkedMaterial.UnitSelects = Data.checkedMaterial.UnitSelects
              .filter(it => it.UnitPurpose === 1);
            ThreeCascaderComp.value.reset();
          } else {
            messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
          }
        });
      }
    }
    return {
      Data,
      Dialog,
      SizeSelects,
      ThreeCascaderComp,
      getMaterial,
      ThreeCascaderCompChange,
      SizeSelectChange,
      addMaterialCloseClick,
      addMaterialClosed,
      addMaterialPrimaryClick,
    };
  },
};
</script>
<style lang="scss">
.common-add-material-dialog{
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
  .add-material-dialog{
    padding: 0 25px;
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
      .sku-code{
        flex: 1;
        display: flex;
        .el-input{
          height: 40px;
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
            height: 40px;
            font-size: 16px;
          }
        }
        .mp-one-level-select{
          .el-select{
            width: 328px;
            margin-top: 15px;
            .select-trigger, .el-input, &.el-select{
              height: 40px;
              font-size: 16px;
            }
          }
        }
      }
      .el-input-number{
        width: 328px;
        .el-input{
          height: 40px;
          font-size: 16px;
          font-size: 16px;
        }
      }
      .el-textarea{
        flex: 1;
        .el-textarea__inner{
          height: 60px;
          font-size: 16px;
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
    .remark{
      .el-input{
        width: 300px;
        margin-right: 20px;
      }
    }
  }
  .make-an-inventory-error-dialog .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
