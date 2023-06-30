<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="580"
    title="任务文件下载"
    @cancel="localVisible = false"
    :showPrimary="false"
    closeBtnText="关闭"
    >
    <div class="dialog-content">
      <template v-for="it in files" :key="it.ID">
        <a v-if="it.FilePath" :href="it.FilePath" :download="it.Name + it.FilePath.slice(it.FilePath.lastIndexOf('.'))"
          class="is-blue-span" target="_blank">
          {{ it.Name }}{{ it.FilePath.slice(it.FilePath.lastIndexOf('.')) }}
        </a>
      </template>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';

const props = defineProps<{
  visible: boolean
  files: IConvertAssistInfo[]
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

</script>

<style lang='scss' scoped>
.dialog-content {
  margin-top: -10px;
  padding: 0 18px;
  max-height: 400px;
  min-height: 180px;
  overflow: auto;

  a {
    display: block;
    margin-bottom: 8px;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
