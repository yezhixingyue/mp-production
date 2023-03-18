<template>
  <div class="search-box">
    <div class="search">
      <h4>订单ID：</h4>
      <el-input v-model.trim='inputVal' maxlength="140" @keyup.enter="onclick" />
      <mp-button type="primary" @click="onclick">
        <el-icon><Search /></el-icon>
      </mp-button>
    </div>
    <div class="tips-box"><el-icon><WarningFilled /></el-icon>注：多个ID使用半角逗号（,）隔开，最多可填写10个订单</div>
  </div>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

const inputVal = ref('');

const emit = defineEmits(['search']);

const onclick = () => {
  emit('search', inputVal.value);
};
</script>

<style scoped lang='scss'>
.search-box {
  padding: 0 16px;
  .search {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    > h4 {
      flex: none;
      margin-right: 5px;
    }
    > button {
      flex: none;
      height: 28px;
      width: 70px;
      font-size: 20px;
      font-weight: 700;
      box-sizing: border-box;
      border-radius: 2px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
      z-index: 9;
    }
    > div {
      line-height: 28px;
      height: 28px;
      :deep(.el-input__wrapper) {
        border-radius: 2px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        input {
          line-height: 28px;
          height: 28px;
        }
      }
    }
  }
  .tips-box {
    white-space: nowrap;
  }
}
</style>
