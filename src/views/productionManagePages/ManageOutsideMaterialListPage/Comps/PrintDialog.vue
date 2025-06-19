<template>
  <PrintDialog ref="oPrintDialog" onlyPrint :title="`外来物料打印单-${curRow?.Code}`">
    <OutsideMaterialPrintArea v-if="curRow" :materialData="curRow" :QRCodeSrc="QRCodeSrc" />
  </PrintDialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { formatTableList } from '../js/formatTableList';
import OutsideMaterialPrintArea from './OutsideMaterialPrintArea/OutsideMaterialPrintArea.vue';

const props = defineProps<{
  curRow: ReturnType<typeof formatTableList>[number] | null
}>();

const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();

const QRCodeSrc = ref('');

const print = async () => {
  if (props.curRow && oPrintDialog.value) { // 弹窗打开
    QRCodeSrc.value = '';
    const src = await getQRCodeSrc(props.curRow.Code, 125); // 获取img src

    if (src) {
      QRCodeSrc.value = src;

      oPrintDialog.value.print(`外来物料打印单-${props.curRow.Code}`);
    }
  }
};

defineExpose({ print });
</script>

<style scoped lang='scss'>
</style>
