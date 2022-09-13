<template>
  <div>
    <DialogContainerComp
    title="库存错误"
    :visible='Dialog'
    :width="660"
    :primaryClick="errorSavePrimaryClick"
    :closeClick="errorSaveCloseClick"
    :closed="errorSaveClosed"
    :appendToBody="true"
    >
    <template #default>
      <div class="make-an-inventory-error-dialog">
        <el-form label-width="120px">
          <el-form-item :label="`当前货位：`" class="in-number">
            {{materialInfo.CurrentPositionName}}
          </el-form-item>
          <el-form-item :label="`物料：`" class="in-number">
            <div class="between">
              <span class="value">
               <template v-for="(item, index) in materialInfo.MaterialAttributes"
               :key="item.AttributeID">
                 <template v-if="item.NumericValue">
                   <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                 </template>
                 <template v-else>
                   <span>{{item.InputSelectValue || item.SelectValue}}</span>
                 </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === materialInfo.MaterialAttributes.length-1 ? '' : ' ' }}
                </template>
               </template>
               {{materialInfo.SizeDescribe}}
              </span>
              <el-button
              type="primary" @click="Data.editMaterialShow = true" link>修改物料</el-button>
            </div>
          </el-form-item>
          <el-form-item :label="`SKU编码：`" class="in-number">
            {{materialInfo.Code}}
          </el-form-item>
          <el-form-item :label="`数量：`" class="in-number">
            {{`${materialInfo.Stock}${materialInfo.StockUnit}`}}
          </el-form-item>

          <el-form-item :label="`新物料：`" class="red">
            <!-- <div class="between"> -->
            <p v-if="Data.newMaterialInfo" class="between">
             <span class="value">
               <template v-for="(item,index) in Data.newMaterialInfo.MaterialAttributes"
               :key="item.AttributeID">
                 <template v-if="item.NumericValue">
                   <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                 </template>
                 <template v-else>
                   <span>{{item.InputSelectValue || item.SelectValue}}</span>
                 </template>
                <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                  {{index === Data.newMaterialInfo.MaterialAttributes.length-1 ? '' : ' ' }}
                </template>
               </template>
               {{Data.newMaterialInfo.SizeDescribe}}
             </span>
              <el-button @click="Data.newMaterialInfo = null">删除</el-button>
            </p>
          </el-form-item>

          <el-form-item :label="`正确数量：`" class="in-number">
            <el-input-number style="margin-right:5px" placeholder="请输入正确数量"
            :controls="false" v-model="Data.editDeliveryForm.Number" />
            {{materialInfo.StockUnit}}
          </el-form-item>

          <el-form-item :label="`备注：`" class="remark">
            <el-input v-model="Data.editDeliveryForm.Remark" placeholder="请输入备注"/> (选填)
          </el-form-item>
        </el-form>

          <DialogContainerComp
          title="修改物料"
          :visible='Data.editMaterialShow'
          :width="660"
          :primaryClick="editMaterialPrimaryClick"
          :closeClick="editMaterialCloseClick"
          :closed="editMaterialClosed"
          primaryText="确定"
          :appendToBody="true"
          >
          <template #default>
            <div class="select-material-dialog">
              <el-form label-width="120px">
                <el-form-item :label="`当前货位：`" class="">
                  {{materialInfo.CurrentPositionName}}
                </el-form-item>
                <el-form-item :label="`当前物料：`" class="">
                  <span class="value">
                    <template v-for="(item,index) in materialInfo.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
                      </template>
                      <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                        {{index === materialInfo.MaterialAttributes.length-1 ? '' : ' ' }}
                      </template>
                    </template>
                    {{materialInfo.SizeDescribe}}
                  </span>
                </el-form-item>
                <el-form-item :label="`SKU编码：`" class="">
                  {{materialInfo.Code}}
                </el-form-item>
                <el-form-item :label="`数量：`" class="in-number">
                  {{`${materialInfo.Stock}${materialInfo.StockUnit}`}}
                </el-form-item>

                <el-form-item :label="`新物料：`" class="red">
                  <span class="value" >
                    <template v-for="(item,index) in Data.tempMaterialInfo?.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}</span>{{item.AttributeUnit}}
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
                      </template>
                      <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                        {{index === Data.tempMaterialInfo.MaterialAttributes.length-1 ? '' : ' ' }}
                      </template>
                    </template>
                    {{Data.tempMaterialInfo?.SizeDescribe}}
                  </span>
                </el-form-item>

                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input @keyup.enter="getMaterial(false)"
                    placeholder="请输入完整SKU编码，包括尺寸编码"
                    v-model="Data.getMaterialData.SKUCode"/>
                    <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
                  </p>
                  <span>或者</span>
                </el-form-item>

                <el-form-item :label="`选择物料：`" class="select-material">
                  <ThreeCascaderComp
                  v-if="Data.editMaterialShow"
                  ref="ThreeCascaderComp"
                  :change="ThreeCascaderCompChange"
                  ></ThreeCascaderComp>
                  <OneLevelSelect
                  v-if="Data.itemSelectTempMaterial"
                    :options='Data.itemSelectTempMaterial.SizeSelects'
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
              </el-form>
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
import api from '@/api/request/MaterialStorage';

import { MaterialDataItemType, MaterialSelectsType } from '@/assets/Types/materialWarehouse/useSKUandSelectMaterialType';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';

import {
  reactive, computed,
} from 'vue';

interface getMaterialDataType {
  MaterialID: string|number,
  SizeID: string|number,
  SKUCode: string|number,
}
interface editDeliveryFormType {
    MaterialID: string|number,
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
    const Data:DataType = reactive({
      // 选择的尺寸
      SizeSelects: null,
      editMaterialShow: false,
      // 此货位还有物料时添加物料的物料查询表单
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 修改物料/数量
      editDeliveryForm: {
        MaterialID: 0,
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

    function errorSaveCloseClick() {
      props.changeVisible(false);
    }
    function errorSaveClosed() {
      Data.editDeliveryForm.Number = null;
      Data.editDeliveryForm.Remark = '';
      // 清空表单
    }
    function getMsg(MaterialInfo) {
      const msg:string[] = [];
      MaterialInfo?.MaterialAttributes.forEach((item) => {
        if (item.NumericValue) {
          msg.push(`${item.NumericValue}${item.AttributeUnit}`);
        } else {
          msg.push(`${item.InputSelectValue || item.SelectValue || ''}`);
        }
      });
      msg.push(MaterialInfo.SizeDescribe);
      msg.push(`（${MaterialInfo.Code}）`);
      return msg;
    }
    // 此货位还有物料时添加物料的弹框
    function errorSavePrimaryClick() {
      // const MaterialInfo:MaterialInfoType = Data.newMaterialInfo
      // || props.materialInfo as MaterialInfoType;
      // 组装 MaterialInfo 数据
      const msg:string[] = [];
      // 原物料
      msg.push(...getMsg(props.materialInfo));
      // 新物料
      if (Data.newMaterialInfo) {
        msg.push('改为');
        msg.push(...getMsg(Data.newMaterialInfo));
      }
      const temp = { ...Data.editDeliveryForm };
      temp.MaterialInfo = msg.join(' ');
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
      console.log('newMaterialInfo');
      if (!Data.tempMaterialInfo) {
        // 请选择物料
        messageBox.failSingle('请选择物料', () => null, () => null);
      } else {
        console.log(Data.tempMaterialInfo);

        Data.newMaterialInfo = { ...Data.tempMaterialInfo };
        editMaterialCloseClick();
        Data.tempMaterialInfo = null;
        console.log(Data.newMaterialInfo);
      }
    }

    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial) {
      Data.SizeSelects = null;
      Data.allSelectTempMaterial = allSellectMaterial as MaterialDataItemType;
      Data.itemSelectTempMaterial = itemMaterial as MaterialSelectsType;
    }
    // 格式化数据
    function SizeSelectChange(ID) {
      Data.SizeSelects = ID;
      const SizeObj = Data.itemSelectTempMaterial?.SizeSelects.find(res => res.SizeID === ID);
      const temp = {
        MaterialID: SizeObj?.MaterialID,
        Code: SizeObj?.Code,
        SizeDescribe: SizeObj?.SizeDescribe,
        MaterialAttributes: Data.itemSelectTempMaterial?.MaterialAttributes,
        StockUnit: Data.allSelectTempMaterial?.StockUnit,
        UnitSelects: Data.allSelectTempMaterial?.UnitSelects,
      };
      Data.tempMaterialInfo = temp as MaterialInfoType;
    }

    // 根据选项或sku编码查物料
    function getMaterial() {
      if (!Data.getMaterialData.SKUCode) {
        messageBox.failSingleError('查询失败', '请输入SKU编码', () => null, () => null);
        return;
      }
      // 物料筛选
      api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
        console.log(res);
        if (res.data.Data) {
          Data.tempMaterialInfo = res.data.Data as MaterialInfoType;
          Data.tempMaterialInfo.UnitSelects = Data.tempMaterialInfo.UnitSelects
            .filter(it => it.UnitPurpose === 1);
        } else {
          messageBox.failSingleError('查询失败', '该SKU编码未查到物料', () => null, () => null);
        }
      });
    }
    return {
      Data,
      Dialog,
      getMaterial,
      errorSaveCloseClick,
      errorSaveClosed,
      errorSavePrimaryClick,
      editMaterialCloseClick,
      editMaterialClosed,
      editMaterialPrimaryClick,
      ThreeCascaderCompChange,
      SizeSelectChange,
    };
  },
};
</script>
<style lang="scss">
  .make-an-inventory-error-dialog{
    .el-form-item{
      &.remark{
        .el-input{
          width: 300px;
          margin-right: 10px;
        }
      }
      .between{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .el-button{
          margin-right: 50px;
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
  }
</style>
