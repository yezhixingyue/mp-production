<template>
 <div v-show="!onlyPrint">
  <DialogContainerComp
    :visible='visible'
    :width='500'
    title='标题'
    top='12vh'
    @open='onOpen'
    @cancel='close'
    @submit='submit'
    :show-header="false"
    primary-text="打印"
    >
    <div class='dialog-content print-area' ref="oArea">
      <slot></slot>
    </div>
  </DialogContainerComp>
 </div>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

const props = defineProps<{
  title?: string
  /** 是否直接打印 （不需要在弹窗中预览，非浏览器打印预览） */
  onlyPrint?: boolean
  /** 为true时 在submit事件中将不会自动进行打印 */
  noAutoPrint?: boolean
}>();

const emit = defineEmits(['submit', 'close']);

const visible = ref(false);

const oArea = ref<InstanceType<typeof HTMLElement>>();

const open = () => {
  visible.value = true;
};
const close = () => {
  visible.value = false;
  emit('close');
};

const print = async (title?: string) => { // 直接调用打印时 应传递onlyPrint为true
  if (props.onlyPrint) {
    open();
    await nextTick();
  }
  if (!oArea.value) return;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position: absolute; width: 0; height: 0;');
  document.body.appendChild(iframe);

  // 写入内容
  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.write('<style media="print">body {display:flex;justify-content:center;align-items: center;}</style>');
  doc.write('<link href="./css/print.css" media="print" rel="stylesheet" />');
  doc.write(`<div>${oArea.value.innerHTML}</div>`);

  const link = doc.getElementsByTagName('link')[0];
  link.onload = () => {
    // 样式文件加载完毕后打印
    const _title = title || props.title;
    const _originTitle = _title ? document.title : '';
    if (_title) document.title = _title;
    // 5. 执行打印
    iframe.contentWindow?.print();
    // 6. 重置工作
    document.body.removeChild(iframe);
    if (_title) document.title = _originTitle;
    // if (props.onlyPrint) close();
    close();
  };
};

defineExpose({ open, print });

const onOpen = () => {
  // console.log('onOpen');
};

const submit = () => {
  if (!props.noAutoPrint) print();
  emit('submit');
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -10px;
  min-height: 160px;
  max-height: 360px;
  overflow: auto;
  overflow: overlay;
  padding-left: 30px;

  @include scroll;

}
.print-hidden {
  display: none;
}
</style>
