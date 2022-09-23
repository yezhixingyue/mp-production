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
    >
    <template #default>
      <div class="add-material-dialog">
        <el-form label-width="120px">
          <el-form-item :label="`当前货位：`">
            {{materialInfo.CurrentPositionName}}
          </el-form-item>
          <el-form-item :label="`SKU编码：`" class="sku">
            <p>
              <el-input  @keyup.enter="getMaterial(false)" placeholder="请输入完整SKU编码，包括尺寸编码" v-model.trim="Data.getMaterialData.SKUCode"/>
              <mp-button link type="primary" @click="getMaterial(false)">查询</mp-button>
            </p>
            <span>或者</span>
          </el-form-item>
          <el-form-item :label="`选择物料：`" class="select-material">
                  <ThreeCascaderComp
                  v-if="Dialog"
                  ref="ThreeCascaderComp"
                  :change="ThreeCascaderCompChange"
                  ></ThreeCascaderComp>
                  <OneLevelSelect
                  v-if="Data.itemSelectTempMaterial"
                    :options='Data.itemSelectTempMaterial.SizeSelects || []'
                    :defaultProps="{
                      value:'SizeID',
                      label:'SizeDescribe',
                    }"
                    :value='Data.SizeSelects'
                    @change="SizeSelectChange"
                    :width="140"
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
                  <OneLevelSelect
                    v-else
                    :options='[]'
                    :width="140"
                    :placeholder="'请选择物料尺寸'"
                    ></OneLevelSelect>
          </el-form-item>
          <el-form-item :label="`物料：`" class="red">
            <template v-if="Data.checkedMaterial">
              {{Data.checkedMaterial.AttributeDescribe}}
              <!-- <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
              :key="item.AttributeID">
                <template v-if="item.NumericValue">
                  <span style="margin-right:5px">{{item.NumericValue}}{{item.AttributeUnit}}</span>
                </template>
                <template v-else>
                  <span style="margin-right:5px">{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === Data.checkedMaterial.MaterialAttributes.length-1 ? '' : ' ' }}
                </template>
              </template> -->
            </template>
            {{Data.checkedMaterial?.SizeDescribe}}
          </el-form-item>
          <el-form-item :label="`物料编码：`" class="red">
           {{Data.checkedMaterial?.Code}}
          </el-form-item>

          <el-form-item :label="`入库数量：`" class="in-number">
            <el-input-number style="margin-right:5px" placeholder="请输入入库数量" :controls="false"
            v-model="Data.inDeliveryForm.Number" /> {{materialInfo.StockUnit}}
          </el-form-item>

          <el-form-item :label="`备注：`" class="remark">
            <el-input placeholder="请输入备注" v-model="Data.inDeliveryForm.Remark"/> (选填)
          </el-form-item>
        </el-form>
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

      const temp = {
        ...Data.inDeliveryForm,
      };
      temp.MaterialID = Data.checkedMaterial?.MaterialID as string;
      props.dialogSaveMaterial(temp);
    }

    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = { ...allSellectMaterial } as MaterialDataItemType;
      Data.itemSelectTempMaterial = { ...itemMaterial } as MaterialSelectsType;
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
      Data.SizeSelects = ID;
      Data.getMaterialData.SKUCode = '';
    }

    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
      } else {
        // 物料筛选
        api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
          if (res.data.Data) {
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
  .add-material-dialog{
    .sku{
      margin-bottom: 0;
      .el-form-item__content{
        flex-direction: column;
        align-items: flex-start;
        font-size: 14px;
        >p{
          display: flex;
          .el-input{
            width: 300px;
            margin-right: 20px;
          }
          .el-button{
            // font-size: 20px;
            font-weight: 400;
          }
        }
        >span{
          margin: 10px 0;
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
</style>
