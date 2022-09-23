<template>
  <section class="mp-common-comps-search-box">
    <span class="text" v-if="title">{{title}}：</span>
    <el-input
      @keyup.enter="onKeyWordSubmit"
      v-model.trim='inpVal'
      spellcheck="false"
      :placeholder="placeholder"
      size="small"
      type="text"
    >
    <template #append>
      <button class="mp-search-box-btn" @click="onKeyWordSubmit">
        <i class="iconfont icon-sousuo"></i>
      </button>
    </template>
    </el-input>
    <mp-button link class="order-header-reset-btn" v-if="showResetBtn" @click="onResetBtn">{{resetWords}}</mp-button>
  </section>
</template>

<script lang="ts">
import { ref, watch } from 'vue';

export default {
  props: {
    word: {
      default: '',
      type: String,
    },
    title: {
      default: '关键词',
      type: String,
    },
    placeholder: {
      type: String,
      default: '请输入搜索关键词',
    },
    changePropsFunc: {
      type: Function,
      default: () => null,
    },
    requestFunc: {
      type: Function,
      default: () => null,
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
    typeList: {},
  },
  setup(props, context) {
    const inpVal = ref('');

    function onKeyWordSubmit(e) {
      const _keywords = inpVal.value;
      if (Array.isArray(props.typeList) && props.typeList.length > 0) {
        props.changePropsFunc([props.typeList[0], _keywords]);
      } else {
        props.changePropsFunc(_keywords);
      }
      props.requestFunc();
      e.target.blur();
    }
    function onResetBtn() {
      context.emit('reset');
      props.requestFunc();
      inpVal.value = '';
    }
    watch(() => props.searchWatchKey, () => {
      inpVal.value = props.word;
    });
    return {
      inpVal,
      onKeyWordSubmit,
      onResetBtn,
    };
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-search-box {
  padding-top: 2px;
  text-align: right;
  font-size: 14px;
  display: flex;
  align-items: center;
  line-height: 30px;
  min-width: 430px;
  margin-left: 20px;
  > span.text {
    display: inline-block;
    user-select: none;
    line-height: 28px;
    min-width: 5em;
    font-weight: 600;
    margin-right: 10px;
    color: #444;
  }
  > .el-input {
    width: 208px;
    height: 30px;
    > input {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      padding: 0 4px;
      height: 30px;
      &::placeholder {
        font-size: 12px;
        color: #566167;
      }
    }
    .el-input-group__append{
      padding: 0 ;
      .mp-search-box-btn{
        height: 30px;
        line-height: 30px;
        width: 52px;
        border: none;
        background-color: $--color-primary;
        border-radius: 0px 3px 3px 0px;
        i{
          color: #fff;
          font-size: 20px;
        }
      }
    }
  }
  > .order-header-reset-btn {
    user-select: none;
    font-size: 12px;
    width: auto;
    font-weight: 400;
    line-height: 28px;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 1px;
    white-space: nowrap;
    color: $--color-primary;
    &:hover, &:focus {
      color: lighten($color: $--color-primary, $amount: 13);
    }
    &:active {
      color: darken($color: $--color-primary, $amount: 15) !important;
    }
    height: 28px;
    cursor: pointer;
  }
  > .el-button.order-header-reset-btn {
    line-height: 26px !important;
  }
  > .space-between {
    flex: 1;
  }
}
</style>
