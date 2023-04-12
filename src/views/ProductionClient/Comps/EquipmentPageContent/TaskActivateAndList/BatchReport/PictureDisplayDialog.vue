<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="986"
    top="5vh"
    :title="title"
    @cancel="localVisible = false"
    @closed="onClosed"
    class="mp-client-manage-batch-report-item-pic-diaplay-dialog-comp-wrap"
    >
    <div class="img-content">
      <div class="img-box">
        <el-image
          style="width: 100%; height: 100%"
          :src="curImgSrc"
          :preview-src-list="picSrcList"
          :initial-index="index"
          fit="contain"
        />
      </div>
      <div class="title" v-if="curRowData">
        <span>编号：{{ curRowData._TargetID }}</span>
        <span class="n">
          <i>{{ curRowData._images[index].Name }}</i>
          <i>（第{{ index + 1 }}张/共{{ curRowData._images.length }}张）</i>
        </span>
        <span>{{ curRowData._Material }}  {{ curRowData._DetailText }}</span>
      </div>
    </div>
    <template #footer>
      <div class="btn-box">
        <mp-button type="primary" v-show="picSrcList.length > 1"
          @click="index === 0 ? index = picSrcList.length - 1: index -= 1" link><el-icon class="mr-8"><DArrowLeft /></el-icon> 上一张</mp-button>
        <mp-button class="blue" @click="localVisible = false">关闭</mp-button>
        <mp-button type="primary" v-show="picSrcList.length > 1"
          @click="index === picSrcList.length - 1 ? index = 0 : index += 1" link>下一张 <el-icon class="ml-8"><DArrowRight /></el-icon></mp-button>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { getLocalTaskList } from './getLocalTaskList';

const props = defineProps<{
  visible: boolean
  curRowData?: ReturnType<typeof getLocalTaskList>[number]
  picSrcList: string[]
  title: string
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

/* 图片操作相关
------------------------------------ */
const index = ref(0);

const curImgSrc = computed(() => props.picSrcList[index.value]);

const onClosed = () => {
  index.value = 0;
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';

.mp-client-manage-batch-report-item-pic-diaplay-dialog-comp-wrap {

  .img-content {
    margin-top: -20px;
    margin-bottom: -10px;
    > .img-box {
      width: 908px;
      height: 600px;
      margin: 0 auto;
      background-color: #f5f5f5;
      img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: cover;
      }
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    > .title {
      text-align: center;
      line-height: 18px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      margin-top: 5px;
      letter-spacing: 0.5px;
      span + span {
        margin-left: 10px;
      }
      .n {
        display: inline-block;
        min-width: 220px;
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 26px;
    .btn-box {
      button {
        font-size: 18px;
        &:nth-of-type(2) {
          width: 162px;
          height: 47px;
          margin: 0 105px !important;
        }
        margin-left: 0 !important;
      }
    }
  }
}

</style>
