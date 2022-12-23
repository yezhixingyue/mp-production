<template>
  <div class="mp-date-time-picker">
    <!-- 日期选择 -->
    <el-date-picker v-model="date" class="date" type="date" :placeholder="placeholder"
       format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="getDisabledDate" />
    <!-- 时间选择 select方式 -->
    <el-time-select v-model="time" start="00:00" :step="timeSelectStep" end="23:59" v-if="(useTimeSelect && withTime && !onlyDate)"  placeholder="00:00"/>
    <!-- 时间选择 picker方式 -->
    <el-time-picker v-model="time" format="HH:mm" value-format="HH:mm" :default-value="pickTimeDefaultValue"
     v-if="(useTimePicker && withTime && !onlyDate)" placeholder="" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { getDate, getTime } from './utils';

const props = withDefaults(defineProps<{
  placeholder?: string
  withTime?: boolean // 是否设置时间点 onlyDate为true时失效
  isBegin?: boolean // 是否从0点开始，否的话时间点以23:59:59为截止 当withTime为true时失效
  onlyDate?: boolean // 是否仅设置日期，设置格式为2022-12-24 优先级最高  优先级排序：onlyDate -> withTime -> isBegin
  modelValue: string // 2022-12-24T23:59:59 传入格式，也可以用下面格式：2022-12-24T23:59:59 或 2022-12-24
  useTimeSelect?: boolean // 使用时间点为选择模式
  useTimePicker?: boolean // 使用时间点为picker模式  和上面一个必须有一个为true
  timeSelectStep?: string
  disabledBeforeToday?: boolean // 是否禁用当天之前的时间
}>(), {
  placeholder: '年/月/日',
  withTime: false,
  isBegin: false,
  onlyDate: false,
  useTimeSelect: true,
  useTimePicker: false,
  timeSelectStep: '00:30',
  disabledBeforeToday: false,
});

const emit = defineEmits(['update:modelValue']);

const pickTimeDefaultValue = new Date(new Date(new Date(new Date().setHours(0)).setMinutes(0)).setSeconds(0));

const date = computed({
  get() {
    return getDate(props.modelValue);
  },
  set(val) { // 格式为2022-12-24
    const _date = val;
    const _time = getTime(props.modelValue, props);

    const _value = _time ? `${_date}T${_time}` : _date;

    emit('update:modelValue', _value);
  },
});

const time = computed({
  get() {
    const _time = getTime(props.modelValue, props);
    return _time && _time.length === 8 ? _time.slice(0, 5) : '';
  },
  set(val) { // 格式为12:00 -- 此处限定为不使用秒 - 后续根据需要可补充
    const _date = getDate(props.modelValue);
    const _time = val;

    const _value = `${_date}T${_time}:00`;

    emit('update:modelValue', _value);
  },
});

const getDisabledDate = (e) => {
  if (props.disabledBeforeToday) {
    return new Date(e).getTime() < Date.now() - 24 * 60 * 60 * 1000;
  }
  return false;
};

</script>

<style scoped lang='scss'>
.mp-date-time-picker {
  display: inline-block;
  :deep(.el-date-editor) {
    width: 140px;
  }
  :deep(.el-date-editor--time) {
    width: 140px;
    margin-left: 10px;
  }
  :deep(.el-select) {
    width: 140px;
    margin-left: 10px;
  }
}
</style>
