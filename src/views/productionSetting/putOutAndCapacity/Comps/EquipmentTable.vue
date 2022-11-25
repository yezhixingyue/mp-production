<template>
  <p class="title">
    <span class="mp-common-title-wrap black">{{props.title || '未知名称'}}：</span>
    <mp-button type="primary" link @click="onClick">+ 添加设备/工厂</mp-button>
  </p>
  <el-table fit stripe border :data="EquipmentList" style="width: 755px">
    <mp-table-column prop="ClassName" label="设备分类" class-name="is-bold left" width="135" />
    <mp-table-column prop="GroupName" label="设备组" class-name="is-bold left" width="135">
    </mp-table-column>
    <mp-table-column prop="Name" label="设备" width="245" class-name="left" />
    <mp-table-column prop="name" label="操作" width="240">
      <template #default="scope">
        <mp-button type="primary" class="ft-12" link @click="ToPutOutPage(scope.row)">申放</mp-button>
        <mp-button type="primary" class="ft-12" link @click="TocCpacityPage(scope.row)">设备产能</mp-button>
        <mp-button type="danger" class="ft-12" link @click="onRemoveClick(scope.row)">删除</mp-button>
      </template>
    </mp-table-column>
  </el-table>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { EquipmentListType } from '../js/types';

const props = defineProps<{
  EquipmentList: EquipmentListType[],
  title: string
}>();

const emit = defineEmits(['ToPutOutPage', 'TocCpacityPage', 'onRemoveClick', 'add']);

const onClick = () => {
  emit('add');
};

const ToPutOutPage = (it: EquipmentListType) => { // 申放
  emit('ToPutOutPage', it);
};

const TocCpacityPage = (it: EquipmentListType) => { // 设备产能
  emit('TocCpacityPage', it);
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
  }
}
.ft-12 {
  margin-left: 20px;
}
:deep(.left .cell) {
  text-align: left !important;
  color: #585858;
}
</style>
