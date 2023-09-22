<template>
  <div class="location-select-area" v-show="position" :style="styles">
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { useConfigForMap } from './useConfigForMap';

const props = defineProps<{
  position: ReturnType<typeof useConfigForMap>['selectArea']['value']
}>();

const styles = computed(() => (props.position ? `
  left: ${props.position.left}px;
  top: ${props.position.top}px;
  width: ${props.position.width}px;
  height: ${props.position.height}px;
` : ''));
</script>

<style scoped lang='scss'>
.location-select-area {
  position: absolute;
  z-index: 20;
  left: 100px;
  border: 1px dashed #888;
  background-color: rgba($color: #000000, $alpha: 0.15);
}
</style>
