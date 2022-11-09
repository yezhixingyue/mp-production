<template>
  <Menu :title="props.title" type="add" class="box" :disabled="props.disabled" @click="onClick" />
</template>

<script setup lang='ts'>
/**
 * 添加按钮
 */
import Menu from './Menu.vue';

const props = withDefaults(defineProps<{
  disabled?: boolean,
  title?: string
}>(), {
  title: '添加',
});

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
