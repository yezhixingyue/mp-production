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
    <el-button
     class="order-header-reset-btn"
     v-if="showResetBtn" link
     @click="onResetBtn">{{resetWords}}</el-button>
  </section>
</template>

<script>
import { ref, watch, computed } from 'vue';

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
    changePropsFunc: {
      type: Function,
      default: () => undefined,
    },
    requestFunc: {
      type: Function,
      default: () => undefined,
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
    resetWords: {
      default: '清空所有筛选项条件',
      type: String,
    },

  },
  setup(props, context) {
    const inpVal = computed({
      get() {
        return props.word;
      },
      set(keywords) {
        props.changePropsFunc(keywords);
      },
    });

    watch(inpVal, (newVal, oldVal) => {
      console.log(newVal, oldVal);
    });
    function onKeyWordSubmit(e) {
      props.requestFunc();
      e.target.blur();
    }
    function onResetBtn() {
      context.emit('reset');
      props.requestFunc();
      inpVal.value = '';
    }

    return {
      inpVal,
      onKeyWordSubmit,
      onResetBtn,
    };
  },
  // watch: {
  //   searchWatchKey() {
  //     this.inpVal = this.word;
  //   },
  // },
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
  > span:first-of-type {
    // font-weight: 600;
    display: inline-block;
    // margin-right: 15px;
    user-select: none;
    // color:#566167;
    line-height: 28px;
    min-width: 5em;
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
        }
      }
    }
  }
  > .order-header-reset-btn {
    user-select: none;
    // margin-left: 20px;
    font-size: 12px;
    width: auto;
    font-weight: 400;
    // background-color: #fff;
    line-height: 28px;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: 1px;
    white-space: nowrap;
    &:active {
      background-color: rgba(168, 168, 168, 0.1);
    }
    color: $--color-primary;
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
