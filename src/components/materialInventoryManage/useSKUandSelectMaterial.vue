<template>
  <el-form-item :label="`SKU编码：`" class="sku">
    <p>
      <el-input v-model.trim="Data.getMaterialData.SKUCode"
      placeholder="请输入完整SKU编码，包括尺寸编码"
       @keyup.enter="getMaterial(false)" size="large"/>
      <el-button link type="primary" @click="getMaterial(false)">查询</el-button>
    </p>
    <span>或者</span>
  </el-form-item>
  <el-form-item :label="`选择物料：`" class="select-material">
    <ThreeCascaderComp
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
      :width="300"
      :placeholder="'请选择物料尺寸'"
      ></OneLevelSelect>
    <OneLevelSelect
      v-else
      :options='[]'
      :width="300"
      :placeholder="'请选择物料尺寸'"
      ></OneLevelSelect>
  </el-form-item>
</template>
<script lang="ts">
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ThreeCascaderComp from '@/components/materialInventoryManage/ThreeCascaderComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { ref, Ref, reactive } from 'vue';
import { MaterialInfoType } from '@/assets/Types/common';
import { MaterialDataItemType, MaterialSelectsType } from '@/assets/Types/materialWarehouse/useSKUandSelectMaterialType';

interface getMaterialDataType {
  MaterialID:string,
  SizeID:string,
  SKUCode:string,
}
interface DataType {
  SizeSelects:null|number
  checkedMaterial:MaterialInfoType | null,
  getMaterialData:getMaterialDataType,
  allSelectTempMaterial:MaterialDataItemType | null,
  itemSelectTempMaterial:MaterialSelectsType | null,
}
export default {
  components: {
    OneLevelSelect,
    ThreeCascaderComp,
  },
  setup() {
    const ThreeCascaderComp:Ref = ref(null);
    const Data:DataType = reactive({
      SizeSelects: null,
      getMaterialData: {
        MaterialID: '',
        SizeID: '',
        SKUCode: '',
      },
      // 选择的物料
      checkedMaterial: null,
      // 下拉选择的临时物料
      allSelectTempMaterial: null,
      itemSelectTempMaterial: null,

    });
    // 选择物料
    function ThreeCascaderCompChange(itemMaterial, allSellectMaterial) {
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
      Data.checkedMaterial = temp as MaterialInfoType;
      Data.getMaterialData.SKUCode = '';
    }
    // 根据选项或sku编码查物料
    function getMaterial() {
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
    return {
      Data,
      ThreeCascaderComp,
      getMaterial,
      ThreeCascaderCompChange,
      SizeSelectChange,
    };
  },
};
</script>
