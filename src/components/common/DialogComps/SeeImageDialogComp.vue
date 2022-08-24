<template>
  <DialogContainerComp
    :visible='visible'
    :closeClick="SeeImgCloseClick"
    :showPrimary="false"
    >
    <template #header>
      <slot name="header">
        <p>
          {{title}}
        </p>
      </slot>
    </template>
    <template #default>
      <el-image :src="imgUrl" fit="contain" />
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
