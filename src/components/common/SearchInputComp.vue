<template>
  <section class="mp-search-input-comp">
    <span class="text" v-if="title">{{title}}：</span>
    <el-input
      v-model.trim='inpVal'
      spellcheck="false"
      :placeholder="placeholder"
      size="mini"
      type="text"
    />
    <button class="mp-search-box-btn">
      <i></i>
    </button>
    <i v-if="spaceBetween" class="space-between"></i>
    <button
     class="order-header-reset-btn" >{{resetWords}}</button>
  </section>
</template>

<script>
export default {
  props: {
    word: {
      default: '',
      type: String,
    },
    title: {
      default: '活动标题',
      type: String,
    },
    placeholder: {
      type: String,
      default: '请输入活动标题',
    },
    typeList: {
      type: Array,
      required: true,
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
    resetWords: {
      default: '清空所有筛选项条件',
      type: String,
    },
    searchWatchKey: {
      default: 0,
    },
    spaceBetween: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inpVal: '',
    };
  },
  methods: {
    onKeyWordSubmit(e) {
      const _keywords = this.inpVal;
      this.changePropsFunc([this.typeList[0], _keywords]);
      this.requestFunc();
      e.target.blur();
    },
    onResetBtn() {
      this.$emit('reset');
      this.requestFunc();
      this.inpVal = '';
    },
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.word;
    },
  },
};
</script>

<style lang="scss">
  .mp-search-input-comp{

  }
</style>
