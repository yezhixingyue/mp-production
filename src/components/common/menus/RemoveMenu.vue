<template>
  <Menu title="删除" icon="icon-delete iconfont" isPink :disabled="props.disabled" @click="onClick" />
</template>

<script setup lang='ts'>
/**
 * 编辑按钮
 */

import Menu from './Menu.vue';

const props = defineProps<{
  disabled?: boolean
}>();

const emit = defineEmits(['click']);

const onClick = () => {
  emit('click');
};
</script>

<style scoped lang='scss'>
</style>
