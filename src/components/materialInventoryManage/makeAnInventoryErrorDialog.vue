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
               <template v-for="(item) in materialInfo.MaterialAttributes"
               :key="item.AttributeID">
                 <template v-if="item.NumericValue">
                   <span>{{item.NumericValue}}</span>
                   {{item.AttributeUnit}}
                 </template>
                 <template v-else>
                   <span>{{item.InputSelectValue || item.SelectValue}}</span>
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
               <template v-for="(item) in materialInfo.MaterialAttributes"
               :key="item.AttributeID">
                 <template v-if="item.NumericValue">
                   <span>{{item.NumericValue}}</span>
                   {{item.AttributeUnit}}
                 </template>
                 <template v-else>
                   <span>{{item.InputSelectValue || item.SelectValue}}</span>
                 </template>
               </template>
               {{materialInfo.SizeDescribe}}
             </span>
              <el-button>删除</el-button>
            </p>
          </el-form-item>

          <el-form-item :label="`正确数量：`" class="in-number">
            <el-input-number :controls="false" v-model="Data.editDeliveryForm.Number" />
          </el-form-item>

          <el-form-item :label="`备注：`" class="remark">
            <el-input v-model="Data.editDeliveryForm.Remark"/> (选填)
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
                    <template v-for="(item) in materialInfo.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}</span>
                        {{item.AttributeUnit}}
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
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
                    <template v-for="(item) in Data.tempMaterialInfo?.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}</span>
                        {{item.AttributeUnit}}
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
                      </template>
                    </template>
                    {{Data.tempMaterialInfo?.SizeDescribe}}
                  </span>
                </el-form-item>

                <el-form-item :label="`SKU编码：`" class="sku">
                  <p>
                    <el-input @keyup.enter="getMaterial(false)"
                    v-model="Data.getMaterialData.SKUCode"/>
                    <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
                  </p>
                  <span>或者</span>
                </el-form-item>

                <el-form-item :label="`选择物料：`" class="remark">
                  <el-input />
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
}

interface DataType {
  editMaterialShow: boolean,
  getMaterialData: getMaterialDataType,
  editDeliveryForm: editDeliveryFormType,
  tempMaterialInfo: MaterialInfoType|null,
  newMaterialInfo: MaterialInfoType|null,
}
export default {
  components: {
    DialogContainerComp,
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
      },
      tempMaterialInfo: null,
      newMaterialInfo: null,
    });
    const Dialog = computed({
      get() {
        return props.visible;
      },
      set(newVal) {
        props.changeVisible(newVal);
      },
    });
    function twoSelectChange(levelData) {
      const { level1Val, level2Val } = levelData;
      Data.getMaterialData.MaterialID = level1Val;
      Data.getMaterialData.SizeID = level2Val;
    }
    function errorSaveCloseClick() {
      props.changeVisible(false);
    }
    function errorSaveClosed() {
      Data.editDeliveryForm.Number = null;
      Data.editDeliveryForm.Remark = '';
      // 清空表单
    }
    // 此货位还有物料时添加物料的弹框
    function errorSavePrimaryClick() {
      const temp = { ...Data.editDeliveryForm };
      temp.MaterialID = props.materialInfo?.MaterialID;
      props.dialogSaveInventoryError(temp);
    }

    function editMaterialCloseClick() {
      Data.editMaterialShow = false;
    }
    function editMaterialClosed() {
      // 清空表单
      Data.tempMaterialInfo = null;
      Data.getMaterialData.SKUCode = '';
    }
    // 修改物料
    function editMaterialPrimaryClick() {
      console.log('newMaterialInfo');
      if (!Data.tempMaterialInfo) {
        // 请选择物料
        messageBox.failSingle('请选择物料', () => null, () => null);
      } else {
        Data.newMaterialInfo = Data.tempMaterialInfo;
        editMaterialCloseClick();
        Data.tempMaterialInfo = null;
      }
    }
    // 根据选项或sku编码查物料
    function getMaterial(bol) {
      // 物料筛选
      if (bol) {
        // 没选尺寸的时候不进行下一步
        if (!Data.getMaterialData.SizeID) return;
        Data.getMaterialData.SKUCode = '';
        // temp = MaterialManageList.value.filter((
        //   res:any,
        // ) => res.ID === Data.getMaterialData.MaterialID);
      } else { // sku编码查询
        twoSelectChange({ level1Val: '', level2Val: '' });
        api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
          console.log(res);
          Data.tempMaterialInfo = res.data.Data as MaterialInfoType;
        });
      }
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
    .red{
      color: #FF3769;
      .el-form-item__label{
        color: #FF3769;

      }
    }
  }
</style>
