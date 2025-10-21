<template>
  <mp-button type="primary" @click="visible = true">外协主管设置</mp-button>

  <Dialog v-model:visible="visible" :outsourceManager="outsourceManager" :staffList="staffList" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import Dialog from './Dialog.vue';
import { OutsourceManager } from '../../model/OutsourceManager';

defineProps<{
  outsourceManager: OutsourceManager
  staffList: Pick<IStaff, 'StaffID' | 'StaffName'>[]
}>();

const visible = ref(false);
</script>

<style scoped lang='scss'>
</style>
