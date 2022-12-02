<template>
  <footer v-show="(curStepIndex < stepList.length - 1)">
    <mp-button class="blue" v-show="(curStepIndex > 0)" @click="onPrevClick">上一步</mp-button>
    <mp-button type="primary" @click="onNextClick">下一步</mp-button>
  </footer>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { PlaceStepEnum } from '../js/enums';

const props = defineProps<{
  step: PlaceStepEnum
  stepList: { ID: PlaceStepEnum, Name: string }[]
}>();

const emit = defineEmits(['prev', 'next']);

const curStepIndex = computed(() => props.stepList.findIndex(it => it.ID === props.step));

const onPrevClick = () => {
  emit('prev');
};

const onNextClick = () => {
  emit('next');
};

</script>

<style scoped lang='scss'>
</style>
