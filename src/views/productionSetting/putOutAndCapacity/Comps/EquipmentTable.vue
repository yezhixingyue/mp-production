<template>
  <p class="title">
    <span class="mp-common-title-wrap black">{{props.title || '未知名称'}}：</span>
    <mp-button type="primary" link @click="onClick">+ 添加设备/工厂</mp-button>
    <template v-if="localEquipmentList.length">
      <mp-button type="primary" :class="{'v-hide':isWeightSetuping}" link @click="onWeightSetupClick">设置权重</mp-button>
      <mp-button type="primary" :class="{'v-hide':!isWeightSetuping}" link @click="onWeightSaveClick">保存权重</mp-button>
      <mp-button type="danger" :class="{'v-hide':!isWeightSetuping}" link @click="onWeightCancelClick">取消</mp-button>
    </template>
  </p>
  <el-table fit stripe border :data="localEquipmentList" style="width: 900px">
    <mp-table-column prop="ClassName" label="设备分类" class-name="is-bold left" width="135" />
    <mp-table-column prop="GroupName" label="设备组" class-name="is-bold left" width="135">
    </mp-table-column>
    <mp-table-column prop="Name" label="设备" width="245" class-name="left" />
    <mp-table-column label="权重" width="165" class-name="left">
      <template #default="scope:any">
        <span style="line-height: 30px;">
          权重：{{ isWeightSetuping ? '' : (scope as any).row.Weight || '未设置' }}
        </span>
        <el-input v-if="isWeightSetuping" class="inp-box" v-model.number="(scope as any).row._Weight" placeholder="请输入权重" maxlength="7"></el-input>
      </template>
    </mp-table-column>
    <mp-table-column prop="name" label="操作" width="220">
      <template #default="scope:any">
        <mp-button type="primary" class="ft-12" :class="{'v-hide': isPlateMaking}" link @click="toPutOutPage((scope as any).row)">伸放</mp-button>
        <mp-button type="primary" class="ft-12" link @click="tocCpacityPage((scope as any).row)">设备产能</mp-button>
        <mp-button type="danger" class="ft-12" link @click="onRemoveClick((scope as any).row)">删除</mp-button>
      </template>
    </mp-table-column>
  </el-table>
</template>

<script setup lang='ts'>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { computed, ref } from 'vue';
import { EquipmentListType } from '../js/types';

const props = defineProps<{
  EquipmentList: EquipmentListType[],
  title: string
  /** 是否设置的为制版工序 此时不展示伸放按钮 */
  isPlateMaking?: boolean
  EquipmentIDS?: string[] // 暂仅制版组可用到
}>();

const emit = defineEmits(['toPutOutPage', 'tocCpacityPage', 'onRemoveClick', 'add', 'setWeight']);

const localEquipmentList = computed<(EquipmentListType & { _Weight: '' | number })[]>(() => props.EquipmentList
  .filter(it => !props.EquipmentIDS || props.EquipmentIDS.includes(it.ID))
  .map(it => ({
    ...it,
    _Weight: '',
  })));

const isWeightSetuping = ref(false); // 是否正在设置权重中

const onWeightSetupClick = () => { // 点击设置权重
  // 1. 赋值初始化
  localEquipmentList.value.forEach(it => {
    const _it = it;
    if (typeof it.Weight === 'number' && it.Weight > 0) _it._Weight = it.Weight;
  });

  // 2. 打开设置模式
  isWeightSetuping.value = true;
};

const onWeightSaveClick = async () => { // 保存权重设置
  // 1. 列表值校验
  const index = localEquipmentList.value.findIndex(it => !/^[1-9]\d*$/.test(`${it._Weight}`));
  if (index > -1) {
    const item = localEquipmentList.value[index];
    MpMessage.error('保存失败', `第${index + 1}行设备[ ${item.Name} ]权重设置不正确，权重值必须为正整数`);
    return;
  }

  // 2. 发起及处理请求 - 或发至上级处理
  const list = localEquipmentList.value.map(it => ({ ID: it.LineEquipmentID, Weight: it._Weight }));
  const resp = await api.getProductionLinetEquipmentWeightSave(list).catch(() => null);

  // 3. 修改成功处理
  if (resp?.data?.isSuccess) {
    const cb = () => {
      // 4. 成功后的数据改动 - 是否修改生产线可用性?
      emit('setWeight', list);
      // 5. isWeightSetuping值改动 - 关闭设置模式
      isWeightSetuping.value = false;
    };
    MpMessage.success('保存成功', cb, cb);
  }
};

const onWeightCancelClick = () => { // 取消权限设置
  isWeightSetuping.value = false;
};

const onClick = () => {
  emit('add');
};

const toPutOutPage = (it: EquipmentListType) => { // 伸放
  if (props.isPlateMaking) return;
  emit('toPutOutPage', it);
};

const tocCpacityPage = (it: EquipmentListType) => { // 设备产能
  emit('tocCpacityPage', it);
};

const onRemoveClick = (it: EquipmentListType) => { // 本地保存？
  MpMessage.warn({
    title: '确定删除该设备吗 ?',
    msg: `设备名称：[ ${it.Name} ]`,
    onOk: () => {
      emit('onRemoveClick', it);
    },
  });
};

</script>

<style scoped lang='scss'>
.title {
  line-height: 24px;
  margin-bottom: 10px;
  margin-top: 35px;
  > button {
    vertical-align: 0px;
    &.el-button+.el-button {
      margin-left: 25px;
      font-size: 13px;
    }
  }
}
.ft-12 {
  margin-left: 22px;
}
.v-hide {
  visibility: hidden;
}
:deep(.left .cell) {
  text-align: left !important;
  color: #585858;
}

.inp-box {
  --el-component-size: 28px;
  --el-border-radius-base: 2px;
  width: 80px;
  :deep(.el-input__wrapper) {
    padding: 1px 8px;
  }
}
</style>
