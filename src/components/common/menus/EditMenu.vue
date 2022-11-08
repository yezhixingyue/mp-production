<template>
  <Menu title="编辑" icon="icon-bianji iconfont" :disabled="props.disabled" @click="onClick" />
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
