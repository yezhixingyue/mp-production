<template>
  <div class="box">
    <label @click="setFocus"> <i class="icon-saomiao iconfont"></i> </label>
    <el-input v-model.trim="keywords" class="inp" ref="oElInput" placeholder="扫描或输入标签号" @keyup.enter="onclick" size="large" maxlength="30" />
    <mp-button class="btn" @click="onclick" type="primary" size="large">手动搜索</mp-button>
  </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { InputInstance } from 'element-plus';

const props = defineProps<{ modelValue: string }>();

const emit = defineEmits(['update:modelValue', 'search']);

const keywords = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const oElInput = ref<InputInstance>();

const setFocus = () => oElInput.value?.focus();

const onclick = () => {
  if (!oElInput.value) return;
  emit('search', oElInput.value);
};

</script>

<style scoped lang='scss'>
.box {
  display: flex;
  align-items: center;
  --el-border-radius-base: 0;

  > * {
    flex: none;
    font-size: 16px;
  }

  > label {
    width: 40px;
    height: 40px;
    text-align: center;
    color: #26BCF9;
    border: 2px solid #26BCF9;
    box-sizing: border-box;
    line-height: 36px;
    text-align: center;
    z-index: 2;
  }

  > .inp {
    flex: 1;
    margin-left: -2px;
    margin-right: -2px;
    :deep(.is-focus) {
      box-shadow: 0 0 0 2px #26BCF9 inset;
    }
  }

  > .btn {
    z-index: 2;
  }
}
</style>
