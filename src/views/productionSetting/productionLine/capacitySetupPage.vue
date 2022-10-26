<template>
  <div class="put-out-setup">
    <ConstraintSetupPageComp
    v-if="LineEquipmentID"
    leftWidth="800px"
    :PropertyList="productionSettingStore.PropertyList"
    :condition="curConditionItem" @submit="submit">
      <template #header>
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
        <div class="header-top">
          优先级：<el-input v-model="Data.Priority"></el-input> <span>注：数字越小优先级越高</span>
        </div>
      </template>
      <template #default>
        <div class="right-class">
          <p class="title">
            <span v-if="Data.Type === 0">
              则准备时间为：
            </span>
            <span v-if="Data.Type === 1">
              则产能设为：
            </span>
            <span v-if="Data.Type === 2">
              则干燥时间为：
            </span>
          </p>
          <p class="conent">
            <span v-if="Data.Type !== 1">
              每次作业需要
            </span>
            <el-input :class="{marginleft: Data.Type !== 1}" v-model="Data.Value"></el-input>
            <span v-if="Data.Type !== 1">
              分钟准备
            </span>
            <span v-if="Data.Type === 1">
              /每小时
            </span>
          </p>
          <p class="conent" v-if="Data.Type === 1">
            计算数量：
            <span class="calculate">{{calculateNum.Name}}</span>
            <el-button link type="primary" @click="() => visible = true">选择计算数量</el-button>
          </p>
          <p class="conent" v-if="Data.Type !== 1">
            说明：作业次数是通过转换器转换而来
          </p>
        </div>
      </template>
    </ConstraintSetupPageComp>
    <Dialog v-model:visible="visible" :propertyList="productionSettingStore.PropertyList" @select="onPropSelect" />
  </div>
</template>

<script setup lang='ts'>
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import Dialog from '@/components/common/ConstraintsComps/ConditionPropSelectDialog/ConditionPropSelectDialog.vue';

import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import api from '@/api';
import {
  computed, reactive, onMounted, ref, Ref,
} from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { useRoute } from 'vue-router';
import { ConditionItemClass } from '@/components/productionSetting/putOut/ConditionSetupPanel/ConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const route = useRoute();
const visible = ref(false);
// 计算出量弹框选择值
const calculateNum = reactive({
  ID: '',
  Name: '',
});
const BreadcrumbList = computed(() => [
  { to: { path: '/deliveryTimeList' }, name: '发货班次' },
  {
    name: '产能条件',
  },
]);
const LineEquipmentID = ref();
const curConditionItem:Ref<ConditionItemClass|null> = ref(null);
const Data = reactive({
  LineEquipmentID: '',
  Priority: 0,
  Value: 0,
  Type: 0,
  MumberPropertyID: '',
});
function setStorage() { // 设置会话存储
  sessionStorage.setItem('capacityPage', 'true');
}
function onPropSelect(item) { //
  calculateNum.ID = item.Property.ID;
  calculateNum.Name = item.Property.Name;
  Data.MumberPropertyID = calculateNum.ID;
}
const submit = async (e: ConditionItemClass) => {
  Data.LineEquipmentID = LineEquipmentID.value;
  const temp = { ...e, ...Data };
  const resp = await api.getProductionLineCapacitySave(temp).catch(() => null);
  if (resp?.data.isSuccess) {
    const isEdit = !!temp.ID;
    const cb = () => {
      setStorage();
      // 处理数据变动
      getGoBackFun();
    };

    MpMessage.success({
      title: isEdit ? '编辑成功' : '添加成功',
      onOk: cb,
      onCancel: cb,
    });
  }
};
onMounted(() => {
// sessionStorage.removeItem('foldWayTemplateSteupPage');
  const temp = JSON.parse(route.params.capacityInfo as string) as ConditionItemClass;
  const TempType = Number(route.params.Type) as number;
  Data.Type = TempType;
  if (temp) {
    curConditionItem.value = { ...temp };
    Data.LineEquipmentID = temp.LineEquipmentID;
    Data.Priority = temp.Priority;
    Data.Value = temp.Value;
    Data.Type = temp.Type;
    Data.MumberPropertyID = temp.MumberPropertyID || '';
    productionSettingStore.PropertyList.forEach(item => {
      if (item.Property.ID === Data.MumberPropertyID) {
        onPropSelect(item);
      }
    });
  }
  LineEquipmentID.value = route.params.LineEquipmentID as string;
});
</script>

<script lang='ts'>
export default {
  name: 'capacitySetupPage',
};
</script>

<style scoped lang='scss'>
.put-out-setup {
  header{
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      // line-height: 32px;
      display: flex;
      align-items: center;
      .el-input{
        width: 110px;
        margin-right: 20px;
      }
    }
  }
  .right-class{
    width: 300px;
    margin-left: 100px;
    margin-top: 50px;
    .conent{
      display: flex;
      margin-left: 10px;
      margin-top: 20px;
      align-items: center;
      font-weight: 300;
      >.calculate{
        font-weight: 700;
        padding: 0 10px;
        min-width: 60px;

      }
      >.el-input{
        width: 120px;
        margin-right: 10px;
      }
      .marginleft{
        margin-left: 10px;
      }
    }
  }
  background-color: #fff;
  height: 100%;
}
</style>
