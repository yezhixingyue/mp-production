<template>
  <DialogContainerComp
    :visible='visible'
    :closeClick="SeeImgCloseClick"
    :showPrimary="false"
    :closeBtnText="'关闭'"
    top="5vh"

    >
    <template #header>
      <slot name="header">
        <p>
          {{title}}
        </p>
      </slot>
    </template>
    <template #default>
      <div style="height:calc(100vh - 300px); text-align: center;">
        <el-image v-if="imgUrl" :src="imgUrl" style="height:100%"/>
        <p v-else style="text-align: center; line-height: calc(100vh - 400px);">
          {{noImgText}}
        </p>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

export default {
  components: {
    DialogContainerComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '查看图片',
    },
    closeClick: {
      type: Function,
      default: () => null,
    },
    noImgText: {
      type: String,
      default: '暂无图片',
    },
  },
  setup(props) {
    function SeeImgCloseClick() {
      props.closeClick();
    }
    return {
      SeeImgCloseClick,
    };
  },
};
</script>

<style lang="scss">
</style>
