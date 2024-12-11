<template>
  <div class="panel">
    <p class="icon">
      <i class="el-icon-bottom"></i>
    </p>

    <ul>
      <li v-for="it in list" :key="it.label">
        <span class="label">{{ it.label }}</span><span class="content">{{ it.content }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { getAdaptiveAttrList } from './adapter';

defineProps<{
  list: ReturnType<typeof getAdaptiveAttrList>;
}>();
</script>

<style scoped lang="scss">
.panel {
  padding: 10px 15px 55px;
  box-shadow: 0 0 1px rgba($color: #000000, $alpha: 0.4);

  > .icon {
    padding-left: 70px;
    text-align: left;
    padding-bottom: 4px;
  }

  > ul {
    display: grid;
    grid-template-columns: repeat(11, 1fr);

    > li {
      color: #585858;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      transition: 0.15s ease-in-out;
      box-sizing: border-box;
      font-size: 12px;

      &:not(:last-of-type) {
        border-right: none;
      }

      span {
        height: 40px;
        transition: 0.15s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .label {
        height: 30px;
        // font-weight: 700;
        color: #585858;
        // font-size: 13px;
        background-color: #fcfcfc;
        border-bottom: 1px solid #eee;
      }

      &:hover  {
        border-color: #cbcbcb;

        span {
          color: #444;
          border-color: #cbcbcb;
        }

        & + li {
          border-left-color: #cbcbcb;
        }
      }
    }
  }
}
</style>
