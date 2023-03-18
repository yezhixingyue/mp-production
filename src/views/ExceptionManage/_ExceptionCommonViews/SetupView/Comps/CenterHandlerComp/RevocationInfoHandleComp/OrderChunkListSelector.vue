<template>
  <div class="order-chunk-box">
    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" label="全选" />
    <div>
      <el-checkbox v-model="it.checked" v-for="it in ChunkList" :key="it.Code" :label="it.Name" @change="onchange" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { HandleExceptionRuleForm } from '../../../js/HandleExceptionRuleForm';

const props = defineProps<{
  ChunkList: HandleExceptionRuleForm['_RevocationOrderChunkList'],
  checkAll: boolean,
}>();

const emit = defineEmits(['update:checkAll']);

const checkAll = computed({
  get() {
    return props.checkAll;
  },
  set(val) {
    emit('update:checkAll', val);

    props.ChunkList.forEach(c => {
      const _c = c;
      _c.checked = val;
    });
  },
});

const isIndeterminate = computed(() => {
  const list = props.ChunkList.filter(it => it.checked);

  return list.length > 0 && list.length < props.ChunkList.length;
});

const onchange = (bool: boolean) => {
  if (!bool) {
    emit('update:checkAll', false);
  } else {
    const t = props.ChunkList.find(it => !it.checked);
    if (!t) emit('update:checkAll', true);
  }
};

</script>

<style scoped lang='scss'>
.order-chunk-box {
  margin-top: 5px;
}
</style>
