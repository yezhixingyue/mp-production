<template>
  <div class="mp-line-date-selector-wrap" :class="isFull?'mp-line-date-selector-wrap-is-full':''">
    <span class="title">{{label}}：</span>
    <!-- <radio-button-group-comp :radioList="dateList" v-model="date" :isFull="isFull" /> -->
    <el-radio-group v-model="date">
      <el-radio-button v-for="item in dateList" :key="item" :label="item.ID" >
        {{item.name}}
      </el-radio-button>
    </el-radio-group>
    <span link @click="onDefineBtnClick" class="define-btn" @keyup="() => null">
      <span v-if="!showText" class="manual-select-date-box">
        自定义时间
      </span>
      <span v-else :class="{'active':UserDefinedTimeIsActive, 'manual-select-date-box': 1}">
        {{ formatDateContent(Data.beginTime, dateType)  }}
        <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
        {{ formatDateContent(Data.endTime, dateType) }}
      </span>

    </span>
    <el-date-picker
      v-model="localValue"
      :type="dateType"
      align="center"
      :show-arrow='false'
      unlink-panels
      value-format="YYYY-MM-DDTHH:mm:ss"
      :format="format"
      :clearable='false'
      @focus='onPickerFocus'
      @change="onPickerBlur"
      ref="oPicker"
      :default-time="defaultTime"
      popper-class="date-selector-popper-box"
    >
      <!-- @blur="onPickerBlur" -->
    </el-date-picker>
  </div>
</template>

<script lang="ts">
import {
  computed, reactive, onMounted, onBeforeUnmount,
  onActivated, onDeactivated, Ref, ref,
} from 'vue';

export default {
  props: {
    dateList: {
      type: Array,
      default: () => [
        { name: '不限', ID: 'all' },
        { name: '今天', ID: 'today' },
        { name: '昨天', ID: 'yesterday' },
        { name: '前天', ID: 'beforeyesterday' },
        { name: '本月', ID: 'curMonth' },
        { name: '上月', ID: 'lastMonth' },
      ],
    },
    dateValue: {
      type: String,
      default: 'today',
    },
    typeList: {
      type: Array,
      required: true,
    },
    changePropsFunc: {
      type: Function,
      default: () => null,
    },
    UserDefinedTimeIsActive: {
      type: Boolean,
      default: false,
    },
    requestFunc: {
      type: Function,
      default: () => null,
      required: true,
    },
    isFull: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: '可用时间',
    },
    dateType: {
      type: String,
      default: 'daterange',
    },
  },
  setup(props) {
    const oPicker:Ref = ref(null);
    const Data = reactive({
      beginTime: '',
      endTime: '',
      key: false,
      start: '',
      end: '',
      isNotFoulCloseType: false, // 是否使用犯规方式关闭
      clickTarget: null,

      localValue1: '',
    });
    function formatDateContent(str, dateType) {
      if (str) {
        const d = str.split('T')[0];
        if (dateType === 'daterange') return d;
        const h = str.split('T')[1].slice(0, 5);
        return `${d} ${h}`;
      }
      return '';
    }
    const date = computed({
      get() {
        return props.dateValue;
      },
      set(newVal) {
        props.changePropsFunc([props.typeList[0], newVal]);
        if (newVal) props.requestFunc();
      },
    });
    const showText = computed(() => !!(Data.key && Data.beginTime && Data.endTime));
    const defaultTime = computed(() => [new Date(2000, 1, 1, 0, 0, 0),
      new Date(2000, 2, 1, 23, 59, 59)]);
    const localValue = computed({
      get() {
        if (Data.beginTime && Data.endTime) {
          return [Data.beginTime, Data.endTime];
        }
        return [];
      },
      set(val) {
        if (Array.isArray(val)) {
          [Data.beginTime, Data.endTime] = val;
        } else {
          Data.beginTime = '';
          Data.endTime = '';
        }
      },
    });

    function onDefineBtnClick() {
      if (oPicker.value) {
        oPicker.value.focus();
      }
    }
    function onPickerFocus() {
      setTimeout(() => {
        Data.clickTarget = null;
      }, 0);
    }
    function onPickerBlur() {
      setTimeout(() => {
        props.changePropsFunc([props.typeList[0], '']);
        props.changePropsFunc([props.typeList[1], Data.beginTime]);
        props.changePropsFunc([props.typeList[2], Data.endTime]);
        props.requestFunc();
        Data.key = true;
      }, 0);
    }
    function onDocumentClick(e) {
      Data.clickTarget = e;
    }

    const format = computed(() => {
      if (props.dateType === 'daterange') return 'YYYY-MM-DD';
      return 'YYYY-MM-DD HH:mm';
    });

    onMounted(() => {
      document.body.addEventListener('click', onDocumentClick, { passive: true });
    });

    onActivated(() => {
      document.body.addEventListener('click', onDocumentClick, { passive: true });
    });
    // 销毁事件
    onBeforeUnmount(() => {
      document.body.removeEventListener('click', onDocumentClick);
    });
    // 销毁事件
    onDeactivated(() => {
      document.body.removeEventListener('click', onDocumentClick);
    });

    return {
      oPicker,
      Data,
      date,
      showText,
      localValue,
      onDefineBtnClick,
      onPickerFocus,
      onPickerBlur,
      format,
      defaultTime,
      formatDateContent,
    };
  },
  // computed: {
  //   Format2DateEnd() {
  //     return this.$utils.getDateFormat2Date(this.endTime);
  //   },
  //   Format2DateBegin() {
  //     return this.$utils.getDateFormat2Date(this.beginTime);
  //   },
  //   localValue: ,
  //   defaultTime() { // 后续的特殊处理？
  //     return ['00:00:00', '23:59:59'];
  //   },
  //   format() {
  //     if (this.dateType === 'daterange') return 'yyyy-MM-dd';
  //     return 'yyyy-MM-dd HH:mm';
  //   },
  // },
  // data() {
  //   return {
  //     beginTime: '',
  //     endTime: '',
  //     key: false,
  //     start: '',
  //     end: '',
  //     isNotFoulCloseType: false, // 是否使用犯规方式关闭
  //   };
  // },
  // mounted() {
  //   document.body.addEventListener('click', this.onDocumentClick);
  // },
  // beforeUnmount() {
  //   document.body.removeEventListener('click', this.onDocumentClick);
  // },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
// @import '@/assets/css/mixins/header/time-search-selector.scss';
.mp-line-date-selector-wrap {
  min-width: 760px;
  display: flex;
  align-items: center;
  .el-radio-button:last-child .el-radio-button__inner{
    border-radius: 0;
  }
  .el-radio-button:first-child .el-radio-button__inner{
    border-radius: 0;
  }
  &.mp-line-date-selector-wrap-is-full {
    .manual-select-date-box {
      top: 0;
      margin: 0;
      border-left: none;
      border-top-left-radius: 0%;
      border-bottom-left-radius: 0%;
      &.active {
        box-shadow: -1px 0 0 0 #26bcf9;
      }
      &:hover {
        // background-color: $--color-text-table-hover;
        color: $--color-primary;
      }
    }
    .mp-common-comps-radio-group-wrap {
      > .el-radio-group {
        > label {
          &:last-of-type {
            > .el-radio-button__inner {
              border-radius: 0%;
            }
          }
        }
      }
    }
  }
  .el-radio-group{
    .el-radio-button{
      .el-radio-button__inner{
        height: 32px;

        min-width: 80px;
      }
    }
  }
  > .title {
    font-size: 14px;
    position: relative;
    top: -2px;
    width: 5em;
    margin-right: 15px;
    line-height: 23px;
    // font-weight: 600;
    color: $--color-text-primary;
    text-align: right;
  }
  > .normal-btn {
    margin: 0;
    &.un-select {
    color: $--color-text-primary;
    border: 1px solid $--border-color-base;
    }
    margin-left: 20px;
    position: relative;
    top: -5px;
  }
  > .define-btn {
    cursor: pointer;
    margin-left: -1px;
  }
  .manual-select-date-box {
    font-size: 13px;
    min-width: 110px;
    height: 32px;
    border: 1px solid $--border-color-base;
    display: inline-block;
    text-align: center;
    line-height: 30px;
    position: relative;
    top: -5px;
    margin-left: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 0 15px;
    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    > i > img {
      vertical-align: -5%;
      margin-left: 10px;
    }
    &.active {
      color: #fff;
      border-color: #26bcf9;
      background-color: $--color-primary;
    }
    &.active:hover {
      color: #fff;
    }
  }
  > span {
    flex: none;
  }
  .el-date-editor {
    width: 1px;
    height: 1px;
    opacity: 0;
    vertical-align: top;
    padding: 0;
    border: none;
    position: relative;
    top: 18px;
    right: 95px;
    .el-popper[x-placement^="bottom"] .popper__arrow::after {
      display: none;
    }
  }
}
.date-selector-popper-box {
  .el-picker-panel__link-btn.el-button--text {
    display: none;
  }
  .today.start-date, .today.end-date {
    > div > span {
      color: #fff !important;
    }
  }
}
</style>
