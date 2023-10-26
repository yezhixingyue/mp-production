<template>
  <header>
    <mp-button v-if="localPermission?.Setup" type="primary" @click="onClick">+添加物料资源包</mp-button>
  </header>
</template>

<script setup lang='ts'>
import MpButton from '@/components/common/MpButton.vue';
import { IUser } from '@/store/modules/user/types';

defineProps<{
  localPermission?: IUser['PermissionList']['PermissionManageResourceGroup']['Obj']
}>();

const emit = defineEmits(['add']);

const onClick = () => {
  emit('add', null);
};

</script>

<style scoped lang='scss'>
// deep
</style>
