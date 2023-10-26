<template>
  <header>
    <mp-button type="primary"  v-if="localPermission?.Setup" @click="onClick">+添加设备分类</mp-button>
  </header>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { IUser } from '@/store/modules/user/types';

defineProps<{
  localPermission?: IUser['PermissionList']['PermissionManageEquipmentCatergry']['Obj']
}>();

const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
// deep
</style>
