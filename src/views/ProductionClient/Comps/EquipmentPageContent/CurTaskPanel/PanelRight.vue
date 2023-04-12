<template>
  <div class="right-box">
    <!-- 当前展示图片 -->
    <div class="pic">
      <el-image v-if="curImgInfo" style="width: 100%; height: 100%" fit="contain"
        :src="curImgInfo.FilePath"
        :preview-src-list="images.map(it => it.FilePath)"
        :initial-index="images.findIndex(it => it === curImgInfo) || 0"
        :title="curImgInfo.Name"
      />
      <img v-else src="@/assets/images/pic-blank.png" alt="">
    </div>

    <!-- 图标标题 -->
    <p class="name" :class="{'is-gray': !curImgInfo?.Name}">{{ curImgInfo?.Name || '暂无图片' }}</p>

    <!-- 图片列表 -->
    <div class="list-wrap" v-if="images.length > 0">
      <div class="list">
        <div class="item" @click="onImgClick(it)" v-for="it in images" :key="it.ID" :title="it.Name" :class="{active:it===curImgInfo}">
          <img :src="it.FilePath" :alt="it.Name" />
        </div>
      </div>
    </div>

    <!-- 下载其它文件按钮 -->
    <p class="files">
      <span class="is-blue-span" :class="{'disabled': files.length === 0}" :title="filesTitle" @click="onDownloadClick">
        <i class="icon-xiazai iconfont ft-20 is-bold"></i>
        {{ filesTitle }}</span>
    </p>

    <!-- 文件下载弹窗 -->
    <FileDownloadDialog v-model:visible="visible" :files="files" />
  </div>
</template>

<script setup lang='ts'>
import { ITaskDetail } from '@/views/ProductionClient/assets/js/types';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { computed, onMounted, ref } from 'vue';
import FileDownloadDialog from './FileDownloadDialog.vue';

const props = defineProps<{
  TaskData: ITaskDetail
}>();

/* 图片处理相关
-------------------------- */

const images = computed(() => {
  const arr = props.TaskData.Working.AssistList || [];

  const list = arr.filter(it => it.Type === AssistInfoTypeEnum.file && it.FilePath && it.IsImage);

  return list;
});

const curImgInfo = ref<null | IConvertAssistInfo>(null);

const onImgClick = (imgInfo: IConvertAssistInfo) => {
  curImgInfo.value = imgInfo;
};

/* 文件下载相关
-------------------------- */

const files = computed(() => {
  const arr = props.TaskData.Working.AssistList || [];

  const list = arr.filter(it => it.Type === AssistInfoTypeEnum.file && it.FilePath && !it.IsImage);

  return list;
});

const filesTitle = computed(() => {
  if (files.value.length === 0) {
    return images.value.length > 0 ? '暂无文件可下载' : '暂无图片和文件';
  }
  const list = files.value.map(it => it.Name).filter(it => it);
  return `下载${list.join('、')}`;
});

const visible = ref(false);

const onDownloadClick = () => {
  if (files.value.length === 0) return;
  visible.value = true;
};

/* 初始化
-------------------------- */
onMounted(() => {
  if (images.value.length > 0) {
    onImgClick(images.value[0]);
  }
});

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.right-box {
  width: 495px;

  img {
    font-size: 12px;
  }

  .pic {
    height: 355px;
    width: 495px;
    border-radius: 4px;
    overflow: hidden;
    background-color: #000;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .name {
    margin-top: 10px;
    margin-bottom: 15px;
    line-height: 21px;
    font-size: 16px;
    text-align: center;
  }

  .list {
    height: 58px;
    white-space: nowrap;
    display: inline-block;
    .item {
      height: 100%;
      width: 82px;
      background: #000000;
      display: inline-block;
      margin-right: 20px;
      position: relative;
      vertical-align: top;
      overflow: hidden;
      &:last-of-type {
        margin-right: 0;
      }
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.1s ease-in-out;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 4px;
        user-select: none;
        min-width: 58px;
      }
      box-sizing: border-box;
      border-radius: 4px;
      // border: 1px solid rgba($color: #000000, $alpha: 0);
      // &.active {
      //   // &::after {
      //   //   background-color: rgba($color: #000000, $alpha: 0.2);
      //   // }
      //   // border: 1px solid #ff0000;
      //   border-color: burlywood;
      //   border-width: 2px;
      //   border-radius: 7px;
      // }
      &:hover {
        &::after {
          background-color: rgba($color: #000000, $alpha: 0.1);
        }
      }
      &:active {
        &::after {
          background-color: rgba($color: #000000, $alpha: 0.2);
        }
      }
    }
  }

  .list-wrap {
    width: 100%;
    // overflow-x: scroll;
    overflow-x: hidden;
    overflow-x: auto;
    overflow-x: overlay;
    @include scroll;
    &:hover {
      overflow-x: auto;
      overflow-x: overlay;
    }
  }

  .files {
    text-align: left;
    font-size: 18px;
    margin-top: 20px;
    height: 38px;
    span {
      max-width: 100%;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 25px;
      position: relative;
      line-height: 30px;
      box-sizing: border-box;
      i {
        position: absolute;
        left: 0;
      }
    }
  }
}
</style>
