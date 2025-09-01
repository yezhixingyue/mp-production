<template>
  <div class="formula-row-content-displayer-com-text-wrap" ref="oWrap" :style="`font-size: ${fontSize}px;`">
    <el-tooltip v-if="showTips" :content="Content" placement="bottom-start" effect="light"
      popper-class='formula-row-content-displayer-com-tip-popper-wrap' :show-arrow='false'>
      <span class="text">{{ Content }}</span>
    </el-tooltip>
    <span class="text" v-else>{{ Content }}</span>
  </div>
</template>

<script setup lang='ts'>
import { useElResizeObserver } from '@/assets/js/hooks/useElResizeObserver';
import { getWordsWidth } from '@/assets/js/utils/getLimitWords';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  Content: string
  fontSize?: number
}>(), {
  fontSize: 12,
});

const oWrap = ref<HTMLDivElement>();
const wordsWidth = computed(() => getWordsWidth(props.Content, props.fontSize)); // 文字显示全需要有的宽度

const showTips = ref(true); // 是否超出显示 - 当文字需要宽度大于容器宽度时需要显示（为true）
useElResizeObserver(oWrap, ({ width }) => {
  showTips.value = wordsWidth.value > width;
}, { immediate: true });

</script>

<style scoped lang='scss'>
.formula-row-content-displayer-com-text-wrap {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<style lang='scss'>
.formula-row-content-displayer-com-tip-popper-wrap {
  max-width: 520px;
  color: #585858;
  line-height: 24px;
  letter-spacing: 0.5px;
  padding: 6px 10px;
}
</style>
