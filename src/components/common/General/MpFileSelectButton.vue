<template>
  <input type="file" ref="oInput" class="select-file-input-dom" :disabled="disabled" :accept="accept" :multiple="multiple" @change="onChange">
  <mp-button
    class="select-file-button-dom"
    type="primary"
    :link="link"
    :disabled="disabled"
    :class="{'is-dragover': dragover}"
    @click="onClick"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
    >{{ dragover ? '释放文件' : title }}</mp-button>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  disabled?: boolean
  multiple?: boolean
  accept?: string
  title?: string
  link?: boolean
}>(), {
  disabled: false,
  multiple: false,
  accept: '', // image/*  '.png,.jpeg,.gif,.jpg,.bmp'  'image/png,image/jpeg,image/gif,image/jpg,image/bmp'
  title: '上传文件',
  link: false,
});

const emit = defineEmits(['change']);

const oInput = ref<HTMLInputElement>();

const onClick = () => {
  if (oInput.value && !props.disabled) oInput.value.click();
};

const handleFileEmit = (files: File[] | FileList, e: Event) => {
  if (props.multiple) { // 多文件上传
    emit('change', files, e);
  } else { // 单文件上传
    emit('change', files[0], e);
  }
  if (oInput.value) oInput.value.value = '';
};

const onChange = (e: InputEvent | DragEvent) => {
  if (!e || !e.target) return;
  const files = e.dataTransfer ? e.dataTransfer.files : oInput.value?.files || [];
  handleFileEmit(files, e);
};

const dragover = ref(false);

const onDragover = () => {
  if (!props.disabled) {
    dragover.value = true;
  }
};

const onDrop = (e: DragEvent) => {
  if (props.disabled || !e.dataTransfer) return;
  const { accept } = props;
  dragover.value = false;
  if (!accept) {
    handleFileEmit(e.dataTransfer.files, e);
    return;
  }
  const files = [...e.dataTransfer.files].filter(file => {
    const { type, name } = file;
    const extension = name.indexOf('.') > -1
      ? `.${name.split('.').pop()}`
      : '';
    const baseType = type.replace(/\/.*$/, '');
    return accept.split(',')
      .map(it => it.trim())
      .filter(it => it)
      .some(acceptedType => {
        if (/\..+$/.test(acceptedType)) {
          return extension === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '');
        }
        // eslint-disable-next-line no-useless-escape
        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }
        return false;
      });
  });
  // const diffLength = e.dataTransfer.files.length - files.length;
  // if (diffLength > 0) {
  //   if (files.length > 0) this.$message.error(`已筛掉不符合格式的文件${diffLength}个`);
  //   else this.$message.error('文件格式不符合，请重新选择');
  // }
  handleFileEmit(files, e);
};

</script>

<style scoped lang='scss'>
.select-file-input-dom {
  display: none;
}
.select-file-button-dom {
  padding: 0 15px;
  &.is-link {
    padding: 0;
  }
  &.is-disabled {
    background-color: var(--el-button-disabled-bg-color);
    border-color: var(--el-button-disabled-border-color);
  }
  &.is-dragover {
    background-color: #35dff9;
    border-color: #35dff9;
    cursor: context-menu;
  }
}
</style>
