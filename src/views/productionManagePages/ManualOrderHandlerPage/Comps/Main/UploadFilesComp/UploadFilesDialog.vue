<template>
  <DialogContainerComp
    :title="`文件上传与订单提交`"
    :visible='localVisible'
    :width="1000"
    top="10vh"
    @open="onOpen"
    @cancel="localVisible = false"
    primary-text="确定"
    class="mp-manual-order-upload-files-dialog-wrap"
    >
    <div class="file-upload-content">
      <div v-for="it in FileList" :key="it.key" class="item">
        <h2>
          <span>{{ it.target?._NoteInfo?.Name || it.target?._PlateTemplate?.Name || it.target?._SpecialColorInfo?.Name }}</span>
          <span v-if="it.error && it.status === 'exception'" class="error">( {{ it.error }} )</span>
        </h2>
        <el-progress :percentage="it.percentage" :status="it.status" />
      </div>
      <el-icon class="close" v-show="isError" @click="localVisible = false"><CircleClose /></el-icon>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { ManualOrderHandlerPageData } from '../../../js';
import { IConvertOrderFile } from '../../../js/types';
import { UploadHelper } from './UploadHelper';

const props = defineProps<{
  visible: boolean
}>();

const emit = defineEmits(['update:visible', 'uploaded']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const FileList = ref<UploadHelper[]>([]);

/** 在打开时获取初始文件列表 */
const setInitFileList = () => {
  FileList.value = [];
  if (!ManualOrderHandlerPageData.value) return;
  const list: IConvertOrderFile[] = [];
  const { CreateOrderInfo } = ManualOrderHandlerPageData.value;
  if (CreateOrderInfo._curLineType === LineTypeEnum.normal) { // 单一生产线
    list.push(...CreateOrderInfo._SingleInstanceList[0].FileList);
  } else {
    if (CreateOrderInfo.FileList.length > 0) {
      list.push(...CreateOrderInfo.FileList);
    }
    CreateOrderInfo._CombineInstanceList.forEach(it => {
      if (it.FileList.length > 0) {
        list.push(...it.FileList);
      }
    });
  }
  FileList.value = list.map(it => new UploadHelper(it));
};

const isError = ref(false);

const upload = async () => {
  const result = await Promise.all(FileList.value.map(it => it.updload()));

  if (result.includes(false)) { // 存在失败项
    isError.value = true;
  } else {
    // 反馈至外部，执行下一步的提交动作
    emit('uploaded');
  }
};

const onOpen = () => {
  isError.value = false;
  setInitFileList();
  upload();
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';
.mp-manual-order-upload-files-dialog-wrap {
  --el-dialog-bg-color: rgba(0,0,0,0.5);
  box-shadow: none;
  .el-dialog__header,
  .el-dialog__footer {
    display: none;
  }
  .file-upload-content {
    min-height: 400px;
    padding: 20px 10px;
    .item {
      margin-bottom: 30px;
      h2 {
        color: #26bcf9;
        font-size: 18px;
        margin-bottom: 2px;
        font-weight: 400;

        .error {
          font-weight: 400;
          margin-left: 15px;
          font-size: 14px;
          color: #ff3769;
        }
      }

      .el-progress {
        .el-progress__text {
          .el-icon {
            font-size: 25px;
          }
          > span {
            color: #26bcf9;
          }
        }
      }
    }

    position: relative;
    > .close {
      position: absolute;
      right: 0px;
      top: -20px;
      font-size: 28px;
      color: #ff3769;
      cursor: pointer;
    }
  }
}
</style>
