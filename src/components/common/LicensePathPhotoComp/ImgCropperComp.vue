<template>
  <DialogContainerComp
    :width="650"
    top="10vh"
    title="图片裁切"
    v-model:visible="localVisible"
    @submit="submitForm"
    @cancel="localVisible = false"
    @open="onOpen"
    @closed="onClosed"
    class="mp-erp-common-comps-img-cropper-comp-dialog-comp-wrap"
    >
      <div v-if="localVisible"  class="content">
        <img :src="imgFileUrl" alt="" ref="oImg">
      </div>
  </DialogContainerComp>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgFileUrl: {
      default: null,
    },
    imgInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    DialogContainerComp,
  },
  data() {
    return {
      cropper: null,
    };
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    async onOpen() {
      if (this.imgFileUrl) {
        await this.$nextTick();
        const aspectRatio = this.imgInfo.width / this.imgInfo.height;
        this.cropper = new Cropper(this.$refs.oImg, {
          aspectRatio,
          dragMode: 'move', // 使裁剪时图片可拖动
          // cropBoxMovable: false,
          cropBoxResizable: true,
          zoomable: true,
          scalable: true,
          toggleDragModeOnDblclick: false,
          minCropBoxWidth: this.imgInfo?.width ? this.imgInfo.width / 2 : 300,
          autoCropArea: 0.98,
        });
      }
    },
    onClosed() {
      this.cropper = null;
    },
    submitForm() {
      this.cropper.getCroppedCanvas({
        width: this.imgInfo.width,
        height: this.imgInfo.height,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        this.$emit('submitFile', blob);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-img-cropper-comp-dialog-comp-wrap {
  .el-dialog__body {
    > div.content {
      min-height: 460px;
      height: 560px;
      max-height: calc(100vh - 350px);
    }
  }
}
</style>
