<template>
  <header>
    <div class="menu">
      <span v-for="it in props.WorkingList" :key="it.ID" :class="{active:it.ID===props.modelValue}" @click="onMenuClick(it)">{{it.Name}}</span>
      <em v-if="!props.loading && props.WorkingList.length === 0" class="is-pink ft-12"><el-icon class="ft-14"><WarningFilled /></el-icon> 暂无制版工序!</em>
    </div>
    <mp-button type="primary" v-show="props.modelValue" @click="onClick">+ 添加制版组</mp-button>
  </header>
</template>

<script setup lang='ts'>
const props = defineProps<{
  WorkingList: { ID: string, Name: string }[],
  modelValue: string
  loading: boolean
}>();

const emit = defineEmits(['update:modelValue', 'add']);

const onMenuClick = (it: { ID: string, Name: string }) => {
  if (it.ID === props.modelValue) return;
  emit('update:modelValue', it.ID);
};

const onClick = () => {
  emit('add');
};
</script>

<style scoped lang='scss'>
.menu {
  flex: none;
  white-space: wrap;
  max-width: 100%;
  margin-bottom: 20px;
  min-height: 28px;
  > span {
    display: inline-block;
    line-height: 28px;
    padding: 0 17px;
    box-shadow: 0 0 0 1px #e8e8e8;
    cursor: pointer;
    background-color: #f5f5f5;
    color: #444;
    transition: 0.15s ease-in-out;
    position: relative;
    user-select: none;
    &:hover {
      background-color: #eee;
    }
    &.active {
      color: #26bcf9;
      background-color: #fff;
      box-shadow: 0 0 0 1px #26bcf9;
      z-index: 2;
    }
  }
  .is-pink {
    line-height: 28px;
    i {
      vertical-align: -2px;
    }
  }
}
</style>
