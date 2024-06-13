<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='600'
   title='订单取消'
   top='12vh'
   :loading="loading"
   primary-text="确定"
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   >
   <div class='dialog-content' v-loading="loading">
      <p class="tips-box">该订单分布在以下大版中，请选择在每个大版上的处理方式：</p>
      <ul v-if="ruleForm">
        <li v-for="it in ruleForm.PlateList" :key="it.ID">
          <label for="" class="ft-12 bold ml-50 mr-20">大版 {{ it.Code }}：</label>
          <el-radio-group v-model="it.IsWholePlate">
            <el-radio :label="true">取消整个大版</el-radio>
            <el-radio :label="false">仅取消该订单</el-radio>
          </el-radio-group>
        </li>
      </ul>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IManageOrderListItem, IOrderCancelRelation } from '../js/type';

const props = defineProps<{
  visible: boolean
  row: null | IManageOrderListItem
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const loading = ref(false);

const ruleForm = ref<null | IOrderCancelRelation>(null);

const getTimeLine = async () => { // 获取时间线数据
  ruleForm.value = null;

  if (props.row) {
    loading.value = true;
    const resp = await api.productionManageApis.getOrderCancleRelation(props.row.ID).catch(() => null);
    loading.value = false;

    if (resp?.data?.isSuccess && resp.data.Data) {
      ruleForm.value = {
        ID: resp.data.Data.ID,
        PlateList: resp.data.Data.PlateList.map(it => ({ ...it, IsWholePlate: '' })),
      };
    }
  }
};

const onOpen = () => {
  getTimeLine();
};

const submit = () => {
  if (!ruleForm.value) return;
  // 1. 验证
  const t = ruleForm.value.PlateList.find(it => it.IsWholePlate === '');
  if (t) {
    MpMessage.error('操作失败', '有大版未选择处理方式，请检查');
    return;
  }

  // 2. 提交
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -20px;
 min-height: 160px;
 max-height: 360px;
 overflow: auto;
 overflow: overlay;
  > p {
    width: 360px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
 > ul {
  margin-top: 8px;
  > li {
    display: flex;
    align-items: center;

    > label {
      width: 125px;
      text-align: right;
    }
  }
 }

 @include scroll;
}
</style>
