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
              <el-input  @keyup.enter="getMaterial(false)" v-model="Data.getMaterialData.SKUCode"/>
              <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
            </p>
            <span>或者</span>
          </el-form-item>
          <el-form-item :label="`选择物料：`" class="select-material">
            aaaa
          </el-form-item>
          <el-form-item :label="`物料：`" class="red">
            <template v-if="Data.checkedMaterial">
              <template v-for="(item, index) in Data.checkedMaterial.MaterialAttributes"
              :key="item.AttributeID">
                {{index === 0 ? '' : ' - ' }}
                <template v-if="item.NumericValue">
                  <span>{{item.NumericValue}}</span>
                  {{item.AttributeUnit}}
                </template>
                <template v-else>
                  <span>{{item.InputSelectValue || item.SelectValue}}</span>
                </template>
              </template>
            </template>
          </el-form-item>
          <el-form-item :label="`物料编码：`" class="red">
           {{Data.checkedMaterial?.Code}}
          </el-form-item>

          <el-form-item :label="`入库数量：`" class="in-number">
            <el-input-number :controls="false" v-model="Data.inDeliveryForm.Number" />
          </el-form-item>

          <el-form-item :label="`备注：`" class="remark">
            <el-input v-model="Data.inDeliveryForm.Remark"/> (选填)
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  reactive, computed,
} from 'vue';
import api from '@/api/request/MaterialStorage';
import { MaterialInfoType } from '@/assets/Types/common';

interface getMaterialDataType {
  MaterialID: string|number,
  SizeID: string|number,
  SKUCode: string|number,
}
interface inDeliveryFormType {
    MaterialID: string|number,
    Number: number|null,
    Remark: string|number,
}
interface DataType {
  addMaterialShow: boolean,
  getMaterialData: getMaterialDataType,
  inDeliveryForm: inDeliveryFormType,
  checkedMaterial:MaterialInfoType | null,
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
    const Data:DataType = reactive({
      addMaterialShow: false,
      // 此货位还有物料时添加物料的物料查询表单
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 此货位还有物料时添加物料的表单
      inDeliveryForm: {
        MaterialID: 0,
        Number: null,
        Remark: '',
      },
      // 查询到的物料
      checkedMaterial: null,
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
    }
    // 此货位还有物料时添加物料的弹框
    function addMaterialPrimaryClick() {
      console.log('addMaterialPrimaryClick');
      props.dialogSaveMaterial(Data.inDeliveryForm);
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
        api.getStockSingle(Data.getMaterialData.SKUCode).then(res => {
          console.log(res);
          Data.checkedMaterial = res.data.Data as MaterialInfoType;
        });
      }
    }
    return {
      Data,
      Dialog,
      getMaterial,
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
