<template>
  <header>
    <div class="box" v-if="props.showPriority">
      优先级：
      <el-input v-model.number="localPriority" maxlength="3"></el-input>
      <span class="hint">注：数字越小优先级越高</span>
    </div>
    <span class="is-blue-span" @click="onClick">+添加条件</span>
  </header>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  Priority: '' | number,
  showPriority?: boolean,
}>(), {
  showPriority: false,
});

const emit = defineEmits(['click', 'update:Priority']);

const localPriority = computed({
  get() {
    return props.Priority;
  },
  set(val) {
    emit('update:Priority', val);
  },
});

const onClick = () => {
  emit('click');
};

</script>

<style scoped lang='scss'>
.box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-left: -10px;
  color: #888e99;
  .el-input{
    width: 110px;
    margin-right: 20px;
  }
  .hint{
    font-size: 12px;
    line-height: 30px;
    color: #F4A307;
    position: relative;
    padding-left: 33px;
    &::before{
      content: '';
      background-image: url('@/assets/images/warn.png');
      display: inline-block;
      background-size: 13px 13px;
      width: 13px;
      height: 13px;
      margin: 0 10px;
      position: absolute;
      left: 0;
      top: 9px;
    }
  }
}
</style>
