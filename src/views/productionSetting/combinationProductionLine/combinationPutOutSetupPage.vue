<template>
  <div class="put-out-setup" v-if="LineEquipmentID">
    <ConstraintSetupPageComp
    leftWidth="800px"
    :PropertyList="productionSettingStore.PropertyList"
    :condition="curConditionItem" @submit="submit">
      <template #header>
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
        <div class="header-top">
          优先级：<el-input v-model="Data.Priority"></el-input> <span class="hint">注：数字越小优先级越高</span>
        </div>
      </template>
      <template #default>
        <div class="right-class">
          <p class="title">则申放为：</p>
          <p class="conent">
            <el-input v-model="Data.Value"></el-input>
            <el-select v-model="Data.Type" class="m-2" placeholder="Select">
              <el-option label="张" :value="0"/>
              <el-option label="%" :value="1"/>
            </el-select>
          </p>
        </div>
      </template>
    </ConstraintSetupPageComp>
  </div>
</template>

<script setup lang='ts'>
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import api from '@/api';
import {
  computed, reactive, onMounted, ref, Ref,
} from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getGoBackFun } from '@/router';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { useRoute } from 'vue-router';
import { PutOutConditionItemClass } from '@/components/productionSetting/putOut/ConditionSetupPanel/PutOutConditionItemClass';

const productionSettingStore = useProductionSettingStore();
const route = useRoute();
const BreadcrumbList = computed(() => [
  { to: { path: '/deliveryTimeList' }, name: '发货班次' },
  {
    name: '申放条件',
  },
]);
const LineEquipmentID = ref();
const curConditionItem:Ref<PutOutConditionItemClass|null> = ref(null);
const Data = reactive({
  LineEquipmentID: '',
  Priority: 0,
  Value: 0,
  Type: 0,
});
function setStorage() { // 设置会话存储
  sessionStorage.setItem('putOutPage', 'true');
}
const submit = async (e: PutOutConditionItemClass) => {
  Data.LineEquipmentID = LineEquipmentID.value;
  const temp = { ...e, ...Data };
  const resp = await api.getProductionLinePutOutSave(temp).catch(() => null);
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
  const temp = JSON.parse(route.params.putOutInfo as string) as PutOutConditionItemClass;
  if (temp) {
    curConditionItem.value = { ...temp };
    Data.LineEquipmentID = temp.LineEquipmentID;
    Data.Priority = temp.Priority;
    Data.Value = temp.Value;
    Data.Type = temp.Type;
  }
  LineEquipmentID.value = route.params.LineEquipmentID as string;
});
</script>

<script lang='ts'>
export default {
  name: 'combinationPutOutSetupPage',
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
      .hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 9px;
        }
      }
    }
  }
  .right-class{
    width: 200px;
    margin-left: 100px;
    margin-top: 50px;
    .conent{
      display: flex;
      margin-left: 10px;
      margin-top: 20px;
      >.el-input{
        width: 120px;
      }
      >.el-select{
        margin-left: 10px;
        width: 63px;
      }
    }
  }
  background-color: #fff;
  height: 100%;
}
</style>
