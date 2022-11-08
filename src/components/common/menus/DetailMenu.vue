<template>
  <Menu title="详情" type="detail" class="box" :disabled="props.disabled" @click="onClick" />
</template>

<script setup lang='ts'>
/**
 * 详情按钮
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
.box {
  :deep(img) {
    width: 15px;
    height: 15px;
  }
}
</style>
