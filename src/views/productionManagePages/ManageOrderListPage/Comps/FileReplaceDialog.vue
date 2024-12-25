<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='770'
   title='替换拼版文件：'
   top='12vh'
   @open='onOpen'
   @cancel='localVisible = false'
   @submit='submit'
   :disabled="!ruleForm"
   :loading="ruleForm?.loading || false"
   >
   <div class='dialog-content' v-if='row'>
    <p>{{ [row.OrderCode, row.ProductName, row._Size, row._Count].join('-') }}</p>
    <p :title="row.Content">{{ row.Content }}</p>

    <ul v-if='ruleForm'>
      <li v-for="it in ruleForm.fileList" :key="it.data.ID">
        <label for="">{{ it.data.Name }}</label>

        <div class="content" :class="it.file ? '' : 'empty'" :title="it.file?.name">
          <!-- 选中文件名称显示组合 -->
          <i>{{ it.file ? it.file.name.replace(extname(it.file.name), '').slice(0, -2) : '未选择文件' }}</i>
          <i v-if="it.file" class="extname">{{ it.file.name.replace(extname(it.file.name), '').slice(-2) }}{{ extname(it.file.name) }}</i>

          <!-- 进度条 -->
          <div class="progress">
            <el-progress v-if="it.uploadInfo.status !== ReplaceFileUploadEnum.init"
              striped-flow
              striped
              :percentage="it.uploadInfo.percentage"
              :stroke-width="3"
              :status="it.status4process"
              style="width: 393px;flex: none;"
            />

            <span v-if="it.uploadInfo.errorText && it.uploadInfo.status === ReplaceFileUploadEnum.exception" class="is-pink" :title="it.uploadInfo.errorText"
            >{{ it.uploadInfo.errorText }}</span>
          </div>
        </div>

        <MpFileSelectButton link @change="(file) => it.select(file)" title="选择" :accept="it.accept" :disabled="ruleForm.loading" />

        <span v-if="it.file" class="is-pink-span" @click="() => it.clear()" :disabled="ruleForm.loading">清除</span>
      </li>
    </ul>
   </div>

   <transition name="el-fade-in">
      <div v-if="ruleForm?.loading" class="await">
        <template v-if="ruleForm.isFileLoading">等待文件上传完成...</template>
        <template v-else>正在提交...</template>
      </div>
    </transition>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { extname } from '@/assets/js/utils';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import MpFileSelectButton from '@/components/common/General/MpFileSelectButton.vue';
import { getOrderTableListItem } from '../js/getOrderTableList';
import { FileReplaceClass } from '../js/FileReplaceClass';
import { ReplaceFileUploadEnum } from '../js/FileReplaceItemClass';

const props = defineProps<{
  visible: boolean
  row: null | ReturnType<typeof getOrderTableListItem>
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

const ruleForm = ref<null | FileReplaceClass>(null);

const onOpen = () => {
  ruleForm.value = props.row ? new FileReplaceClass(props.row) : null;
};

const submit = () => {
  if (!ruleForm.value) return;

  ruleForm.value.submit(() => {
    localVisible.value = false;
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -25px;
 min-height: 200px;
 max-height: 440px;
 overflow: auto;
 overflow: overlay;
 font-size: 15px;
 @include scroll;

 > p {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 12px;

  &:first-of-type {
    color: rgb(5, 183, 18);
  }
 }

 > ul {
  padding-top: 15px;
  > li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    label {
      width: 15em;
      text-align: right;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: relative;
      padding-right: 15px;
      color: #888;

      &::after {
        content: '：';
        position: absolute;
        right: 0px;
      }
    }

    .content {
      border-bottom: 1px solid #cbcbcb;
      width: 305px;
      height: 40px;
      line-height: 42px;
      margin-right: 15px;
      padding: 0 10px;
      font-size: 14px;
      display: flex;
      position: relative;

      i {
        flex: 0 1 auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &.extname {
          flex: none;
        }
      }

      .progress {
        position: absolute;
        bottom: 0;
        right: -125px;
        left: 0;
        transform: translateY(50%);
        display: flex;

        .is-pink {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-left: -25px;
          font-size: 12px;
        }
      }

      &.empty {
        color: #aaa;
      }
    }

    :deep(.mp-button) {
      margin-right: 40px;
      font-size: 15px;
      border: none;
      position: relative;
      top: 1px;
    }
  }
 }
}

.await {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
}
</style>
