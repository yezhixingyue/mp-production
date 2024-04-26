<template>
  <PrintDialog ref="oPrintDialog" @close="() => emit('update:visible', false)">
    <div class="outside-material-print-area" v-if="curRow">
      <!-- 二维码 -->
      <div class="left">
        <div class="img-box">
          <img :src="imgSrc" alt="" v-show="imgSrc">
        </div>
        <p>编码: {{ curRow.Code }}</p>
      </div>
      <!-- 右侧信息 -->
      <div class="right">
        <h2>{{ curRow.Line }}</h2>
        <h2>数量：{{ curRow._Number }}</h2>
        <h2>物料尺寸：{{ curRow.MaterialSize }}</h2>
      </div>
    </div>
  </PrintDialog>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { formatTableList } from '../js/formatTableList';

const props = defineProps<{
  visible: boolean,
  curRow: ReturnType<typeof formatTableList>[number] | null
}>();

const emit = defineEmits(['update:visible']);

const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();

const imgSrc = ref('');

watch(() => props.visible, async (val) => {
  if (val && props.curRow && oPrintDialog.value) { // 弹窗打开
    imgSrc.value = '';
    const src = await getQRCodeSrc(props.curRow.Code, 100); // 获取img src

    if (src) {
      imgSrc.value = src;
      oPrintDialog.value.open();
    }
  }
});
</script>

<style scoped lang='scss'>
</style>
