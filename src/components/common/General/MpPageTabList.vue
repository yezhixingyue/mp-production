<template>
  <menu class="mp-page-tab-list">
    <li v-for="it in list" :key="it.Name" :class="{active:it.ID===modelValue}" @click="onclick(it.ID)">{{ it.Name }}</li>
  </menu>
</template>

<script setup lang='ts'>
type IDType = number | string | boolean;

const props = defineProps<{
  list: { ID: IDType; Name: string }[] // 选项列表
  modelValue: IDType;
}>();

const emit = defineEmits(['update:modelValue', 'change']);

const onclick = (id: IDType) => {
  if (id === props.modelValue) return;
  emit('update:modelValue', id);
  emit('change', id);
};

</script>

<style scoped lang='scss'>
.mp-page-tab-list {
  width: 100%;
  background-color: #f5f5f5;
  padding-top: 13px;
  padding-left: 30px;
  display: flex;
  border-bottom: 1px solid #e4e7ed;

  > li {
    height: 36px;
    line-height: 38px;
    padding: 0 20px;
    border: 1px solid #e4e7ed;
    position: relative;
    top: 1px;
    cursor: pointer;
    min-width: 5em;
    text-align: center;
    user-select: none;

    &:first-of-type {
      border-top-left-radius: 3px;
    }
    &:last-of-type {
      border-top-right-radius: 3px;
      &:not(:first-of-type) {
        border-left: none;
      }
    }

    &.active {
      background-color: #fff;
      color: #26bcf9;
      border-bottom-color: #fff;
      &::before {
        content: '';
        height: 2px;
        left: 0;
        right: 0;
        top: 0;
        position: absolute;
        background-color: #26bcf9;
      }
    }
  }
}
</style>
