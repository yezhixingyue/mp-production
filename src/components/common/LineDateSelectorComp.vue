<template>
  <div class="mp-line-date-selector-wrap" :class="isFull ? 'mp-line-date-selector-wrap-is-full' : ''">
    <span class="title">{{ label }}：</span>
    <el-radio-group v-if="menu" v-model="dateTypeRadio" style="margin-right: 15px;">
      <el-radio-button v-for="item in menu.list" :key="item.value" :label="item.value">
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    <el-radio-group v-model="dateRadio">
      <el-radio-button v-for="item in localDateList" :key="item" :label="item.ID">
        {{ item.name }}
      </el-radio-button>
    </el-radio-group>
    <span link @click="onDefineBtnClick" class="define-btn" @keyup="() => null">
      <span v-if="!showText" class="manual-select-date-box">
        自定义时间
      </span>
      <span v-else :class="{ 'active': UserDefinedTimeIsActive, 'manual-select-date-box': 1 }">
        {{ formatDateContent(Data.beginTime, dateType) }}
        <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
        {{ formatDateContent(Data.endTime, dateType) }}
      </span>

    </span>
    <el-date-picker v-model="localValue" :type="dateType" align="center" :show-arrow='false' unlink-panels
      value-format="YYYY-MM-DDTHH:mm:ss" :format="format" :clearable='false' @focus='onPickerFocus'
      ref="oPicker" :default-time="defaultTime" popper-class="date-selector-popper-box">
    </el-date-picker>
  </div>
</template>

<script lang="ts" setup>
import {
  computed, reactive, onMounted, onBeforeUnmount,
  onActivated, onDeactivated, Ref, ref,
} from 'vue';

interface IProps {
  dateList?: { ID: string, name: string }[],
  dateValue?: string,
  typeList?: [string, string][],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changePropsFunc: ([string, any]) => any,
  UserDefinedTimeIsActive: boolean,
  requestFunc: () => void,
  isFull?: boolean,
  label?: string,
  dateType?: string,
  menu?: {
    radio: string
    // 约定: dateList、dateTypeEnum、typeList 应同时存在或同时不存在
    list: { label: string; value: string; dateList?: { ID: string, name: string }[]; dateMenuEnum?: string, typeList?: [string, string][] }[]
  }
}

const props = withDefaults(defineProps<IProps>(), {
  dateList: () => [
    { name: '不限', ID: 'all' },
    { name: '今天', ID: 'today' },
    { name: '昨天', ID: 'yesterday' },
    { name: '前天', ID: 'beforeyesterday' },
    { name: '本月', ID: 'curMonth' },
    { name: '上月', ID: 'lastMonth' },
  ],
  isFull: true,
  label: '可用时间',
  dateType: 'daterange',
});

const oPicker: Ref = ref(null);
const Data = reactive({
  beginTime: '',
  endTime: '',
  key: false,
  start: '',
  end: '',
  isNotFoulCloseType: false, // 是否使用犯规方式关闭
  clickTarget: null,
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

const currentMenuItem = computed(() => {
  if (props.menu) {
    // eslint-disable-next-line no-use-before-define
    return props.menu.list.find(_it => _it.value === dateTypeRadio.value);
  }
  return null;
});

const currentTypeList = computed(() => {
  if (currentMenuItem.value && currentMenuItem.value.typeList) {
    return currentMenuItem.value.typeList;
  }

  return props.typeList;
});

const dateRadio = computed({
  get() {
    if (currentMenuItem.value && currentMenuItem.value.dateList) {
      return currentMenuItem.value.dateMenuEnum;
    }
    return props.dateValue;
  },
  set(newVal) {
    if (currentTypeList.value) {
      props.changePropsFunc([currentTypeList.value[0], newVal]);
    }

    if (newVal) props.requestFunc();
  },
});

const _defaultMenuListRadio = props.menu?.list.map(it => ({ key: it.value, defaultRadio: it.dateMenuEnum })) || [];
const dateTypeRadio = computed({
  get() {
    return props.menu?.radio;
  },
  set(newVal) {
    props.changePropsFunc([['DateTypeRadio', ''], newVal]);

    if (newVal) {
      const t = _defaultMenuListRadio.find(it => it.key === newVal);
      if (t && t.defaultRadio) {
        setTimeout(() => {
          dateRadio.value = t.defaultRadio;
        }, 0);
        return;
      }
      props.requestFunc();
    }
  },
});

const localDateList = computed(() => {
  if (currentMenuItem.value && currentMenuItem.value.dateList) {
    return currentMenuItem.value.dateList;
  }

  return props.dateList;
});

function onPickerBlur() {
  setTimeout(() => {
    if (!currentTypeList.value) return;
    props.changePropsFunc([currentTypeList.value[0], '']);
    let start = Data.beginTime;
    let end = Data.endTime;

    const reg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
    if (reg.test(start)) start += '.000Z'; // 时间补充完整后缀
    if (reg.test(end)) end += '.997Z'; // 时间补充完整后缀

    props.changePropsFunc([currentTypeList.value[1], start]);
    props.changePropsFunc([currentTypeList.value[2], end]);
    props.requestFunc();
    Data.key = true;
  }, 0);
}
const showText = computed(() => !!(Data.key && Data.beginTime && Data.endTime));
const defaultTime = computed(() => [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]);
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
      onPickerBlur();
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
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";

// @import '@/assets/css/mixins/header/time-search-selector.scss';
.mp-line-date-selector-wrap {
  min-width: 760px;
  display: flex;
  align-items: center;
  line-height: 28px !important;

  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 0;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
  }

  &.mp-line-date-selector-wrap-is-full {
    .manual-select-date-box {
      top: 0;
      margin: 0;
      // border-left: none;
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
      >.el-radio-group {
        >label {
          &:last-of-type {
            >.el-radio-button__inner {
              border-radius: 0%;
            }
          }
        }
      }
    }
  }

  .el-radio-group {
    .el-radio-button {
      border: none;
      position: relative;
      min-width: 80px;
      // width: 120px;
      height: 28px;
      z-index: 9;
      // overflow: hidden;
      margin-right: -1px;

      // margin-bottom: -1px;
      .el-radio-button__original-radio:checked+.el-radio-button__inner {
        box-shadow: none
      }

      .el-radio-button__inner {
        background-color: #F5F5F5;
        border: 1px solid #E6E6E6;
        height: 28px;
      }

      box-sizing: border-box;

      &.is-active {
        z-index: 99;
        border: none;
        box-shadow: none;

        .el-radio-button__inner {
          background-color: #fff;
          color: $--color-primary;
          border-color: $--color-primary;
          height: 100%;
        }
      }

      .el-radio-button__inner {
        .el-tooltip__trigger {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 15px;
        }

        padding: 6px 15px 4px;
        width: 100%;
        // width: 120px;
        // overflow: hidden;
        // border-left: 1px solid rgb(220, 223, 230);
      }
    }
  }

  >.title {
    font-size: 14px;
    width: 5em;
    margin-right: 10px;
    line-height: 28px;
    font-weight: 600;
    color: $--color-text-primary;
    text-align: right;
  }

  >.normal-btn {
    margin: 0;

    &.un-select {
      color: $--color-text-primary;
      border: 1px solid $--border-color-base;
    }

    margin-left: 20px;
    position: relative;
    top: -5px;
  }

  >.define-btn {
    cursor: pointer;
    height: 28px;
    // margin-left: -1px;
  }

  .manual-select-date-box {
    font-size: 13px;
    min-width: 110px;
    height: 28px;
    border: 1px solid $--border-color-base;
    display: inline-block;
    text-align: center;
    line-height: 28px;
    position: relative;
    top: -5px;
    margin-left: 20px;
    border-radius: 2px;
    box-sizing: border-box;
    background-color: #F5F5F5;
    padding: 0 15px;

    // box-shadow: inset 0px 1px 0px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.15);
    >i>img {
      vertical-align: -5%;
      margin-left: 10px;
    }

    &.active {
      color: #26bcf9;
      border-color: #26bcf9;
      z-index: 99;
      box-shadow: none !important;
      background-color: #fff;
    }

    &.active:hover {
      color: #26bcf9;
    }
  }

  >span {
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

  .today.start-date,
  .today.end-date {
    >div>span {
      color: #fff !important;
    }
  }
}
</style>
