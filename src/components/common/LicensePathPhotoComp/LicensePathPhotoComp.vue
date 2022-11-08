<template>
  <div class="mp-liscense-path-photo-img-upload-com">
    <!-- <p class="blue-v-line is-bold is-black">营业执照照片</p> -->
    <div class="img-box">
      <div class="pic is-font-size-18" :class="modelValue?'':'show-bg'" :style="imgStyle">
        <input type="file" class="upload" @change="onChange" accept='.png,.jpeg,.jpg,.bmp'>
        <div class="empty" v-if="!modelValue">
          <div class="remark">
            <p class="remoark-text1">照片支持 .png, .jpg,.bmp 格式；</p>
            <p>请上传完整清晰的{{finalOptions.title}}照片</p>
          </div>
        </div>
        <el-image v-else :fit='finalOptions.fit' :src="modelValue" class="liscense-upload-img"
         :preview-src-list="srcList" :mpCloseViewer='()=>{}' @error='onError'>
        </el-image>
        <div class="liscense-img-mask" @click="onImgClick"></div>
      </div>
      <div class="text gray">
        <p class="is-bold">操作说明：</p>
        <p class="is-font-size-12">
          <span>单击查看照片；双击更换照片。</span>
          <span v-if="!AllowEdit">( 暂不可编辑 )</span>
        </p>
      </div>
    </div>
    <ImgCropperComp v-model:visible="cropperVisible" :imgFileUrl='imgFileUrl' :imgInfo='imgInfo' @submitFile="onCropSubmit" />
  </div>
</template>

<script>
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import ImgCropperComp from './ImgCropperComp.vue';

export default {
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    AllowEdit: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
    canSingleClick: {
      type: Boolean,
      default: true,
    },
    cutting: { // 是否对图片进行裁切 -- 需要在options中传递limitWidth 和 limitHeight
      type: Boolean,
      default: false,
    },
  },
  components: {
    ImgCropperComp,
  },
  data() {
    return {
      firstClickTime: '',
      secondClickTime: '',
      timer: null,
      defaultOptions: {
        width: 360,
        height: 360,
        limitWidth: 600,
        limitHeight: 600,
        fit: 'contain',
        title: '营业执照',
      },
      imgFileUrl: null,
      cropperVisible: false,
      imgInfo: {},
    };
  },
  computed: {
    srcList() {
      return this.modelValue ? [this.modelValue] : [];
    },
    finalOptions() {
      return { ...this.defaultOptions, ...this.options };
    },
    imgStyle() {
      return `width:${this.finalOptions.width}px;height:${this.finalOptions.height}px`;
    },
  },
  methods: {
    onChange(e) {
      const file = e.target.files[0];
      e.target.value = '';
      if (!file) {
        return;
      }
      if (
        file.type !== 'image/jpeg'
        && file.type !== 'image/png'
        && file.type !== 'image/bmp'
      ) {
        messageBox.failSingleError('图片格式错误', '请上传 jpg/png/bmp 格式图片');
        e.target.value = '';
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        messageBox.failSingleError('图片过大', '请上传不超过4M大小的图片');
        e.target.value = '';
        return;
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file); // 根据图片路径读取图片
      fileReader.onload = (ie) => {
        const base64 = ie.currentTarget.result;
        const img = new Image();
        img.src = base64;
        img.onload = async () => {
          const imgInfo = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          if ((imgInfo.width < this.finalOptions.limitWidth || imgInfo.height < this.finalOptions.limitHeight)
           && (imgInfo.width < this.finalOptions.limitHeight || imgInfo.height < this.finalOptions.limitWidth)) {
            messageBox.failSingleError('图片尺寸太小', `请上传大于等于${this.finalOptions.limitWidth}×${this.finalOptions.limitHeight}像素的图片`);
            e.target.value = '';
            return;
          }
          if (!this.cutting) {
            const res = await api.getImageUpload(file).catch(() => null);
            if (res && res.data.Status === 1000) {
              this.$emit('update:modelValue', res.data.Data.Url);
              this.$emit('change', res.data.Data.Url);
            }
          } else {
            this.imgInfo = {
              width: this.finalOptions.limitWidth,
              height: this.finalOptions.limitHeight,
            };
            this.imgFileUrl = base64;
            this.cropperVisible = true;
          }
        };
      };
    },
    async onCropSubmit(blob) {
      this.cropperVisible = false;
      const res = await api.getImageUpload(blob).catch(() => null);
      if (res && res.data.Status === 1000) {
        this.$emit('update:modelValue', res.data.Data.Url);
        this.$emit('change', res.data.Data.Url);
      }
    },
    onImgClick() {
      if (!this.AllowEdit) {
        this.handleSingleClick();
        return;
      }
      this.firstClickTime = this.secondClickTime;
      this.secondClickTime = Date.now();
      if (!this.firstClickTime) {
        this.handleSingleClick();
        return;
      }
      if (this.secondClickTime - this.firstClickTime >= 300) {
        this.handleSingleClick();
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        const oMask = document.querySelector('div.liscense-img-mask');
        const oInp = document.querySelector('input.upload');
        oMask.style.cursor = 'default';
        oInp.click();
      }
    },
    handleSingleClick() {
      if (!this.canSingleClick) return;
      const oImg = document.querySelector('div.liscense-upload-img.el-image > img');
      if (!oImg) return;
      const oMask = document.querySelector('div.liscense-img-mask');
      oMask.style.cursor = 'progress';
      this.timer = setTimeout(() => {
        oImg.click();
        this.timer = null;
        oMask.style.cursor = 'default';
      }, 300);
    },
    onError(e) {
      this.$emit('error', e);
    },
  },
};
</script>
<style lang='scss'>
.mp-liscense-path-photo-img-upload-com {
  // margin-top: 40px;
  font-size: 14px;
  > .img-box {
    // margin-top: 32px;
    > div {
      // display: inline-block;
      &.pic {
        cursor: pointer;
        width: 360px;
        height: 360px;
        overflow: hidden;
        text-align: center;
        // padding-top: 175px;
        user-select: none;
        position: relative;
        &.show-bg {
          background: url('../../../assets/images/license-empty.jpg') no-repeat center/cover;
        }
        color: #aaa;
        > .el-image {
          width: 100%;
          height: 100%;
        }
        > span {
          position: absolute;
          top: 175px;
          left: 96px;
        }
        > input.upload {
          opacity: 0;
          width: 1px;
          height: 1px;
          position: absolute;
        }
        > .liscense-img-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9;
        }
        > .liscense-upload-img {
          background-color: rgba($color: #000000, $alpha: 0.4);
        }
        > div.empty {
          width: 100%;
          height: 100%;
          > .remark {
            width: 100%;
            height: 60px;
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 14px;
            background-color: rgba($color: #428dfa, $alpha: 0.5);
            color: #fff;
            line-height: 14px;
            > p.remoark-text1 {
              margin: 12px 0;
              margin-left: 12px;
              height: 14px;
            }
          }
        }
      }
      &.text {
        line-height: 20px;
        padding-left: 4px;
        padding-top: 10px;
        vertical-align: bottom;
        &.cancel {
          color: #aaa !important;
        }
        > p {
          // display: inline-block;
          letter-spacing: 1px;
          width: 360px;
        }
      }
    }
  }
}
.mp-el-del-btn {
  display: none;
}
.gray {
  color: #888;
}
.is-font-size-12 {
  font-size: 12px;
}
</style>
