<template>
  <DialogContainerComp :title="`发货班次`" :visible='localVisible' :width="660" top="10vh" @submit="submit" @open="onOpen" @cancel="localVisible = false">
    <div class="top">
      <label class="l">设定时间为：</label>
      <div>
        <p>
          <el-radio-group v-model="ruleForm.ShiftType">
            <el-radio v-for="it in ShiftTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
          </el-radio-group>
        </p>
        <div class="date-box">
          <!-- 每周 -->
          <el-checkbox-group v-model="ruleForm.WeekTypeLimit" v-show="ruleForm.ShiftType === ShiftTypeEnum.weekly">
            <el-checkbox v-for="(it, i) in weekList" :key='i' :label="i + 1">{{it}}</el-checkbox>
          </el-checkbox-group>
          <!-- 每月 -->
          <el-checkbox-group v-model="ruleForm.MonthTypeLimit" v-show="ruleForm.ShiftType === ShiftTypeEnum.monthly">
            <el-checkbox v-for="it in 31" :key='it' :label="it + 1">{{it}}号</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <hr class="line" />
    <div class="bottom">
      <p>
        <mp-button class="ft-13" type="primary" link>+ 添加发车时间点</mp-button>
      </p>
      <ul class='list'>
        <li v-for="(it, i) in ruleForm.Shift" :key="it.key">
          <el-time-picker
            v-model="it.date"
            @change="e => onShiftTimeItemInput(e, i)"
            :clearable='false'
            value-format="HH:mm"
            format="HH:mm"
            :picker-options="{ format: 'HH:mm' }"
            :default-value='defaultBeginTime'
            placeholder="20:00"
            size="small"
          >
          </el-time-picker>
          <mp-button v-show="i > 0" @click="onShiftRemoveClick(i)" link>删除</mp-button>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { computed, reactive } from 'vue';
import { ShiftTypeEnumList, ShiftTypeEnum } from '../../enums';
import { IShiftType } from './types';

const props = defineProps<{
  visible: boolean,
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const weekList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']; // 从1开始

const defaultBeginTime = computed(() => new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0)));

const ruleForm = reactive<{
  WeekTypeLimit: number[]
  MonthTypeLimit: number[]
  ShiftType: '' | ShiftTypeEnum
  Shift: IShiftType[]
}>({
  WeekTypeLimit: [],
  MonthTypeLimit: [],
  ShiftType: '',
  Shift: [],
});

const onShiftTimeItemInput = (data: string, index: number) => {
  if (!data) return;
  const [F, S] = data.split(':');
  ruleForm.Shift[index].S.F = F;
  ruleForm.Shift[index].S.S = S;
};

const onShiftRemoveClick = (index: number) => {
  ruleForm.Shift.splice(index, 1);
};

const onOpen = () => {
  console.log('onOpen');
};

const submit = () => {
  console.log('submit');
};

</script>

<style scoped lang='scss'>
.top {
  display: flex;
  color: #444;
  margin-top: -20px;
  padding-left: 25px;
  height: 224px;
  .l {
    flex: none;
    line-height: 30px;
    font-size: 12px;
    margin-right: 10px;
  }
  :deep(.el-radio) {
    margin-right: 85px;
  }
  .date-box {
    width: 475px;
    :deep(.el-checkbox) {
      height: 26px;
    }
    :deep(.el-checkbox__label) {
      display: inline-block;
      width: 34px;
    }
  }
}
.line {
  border: none;
  border-bottom: 1px solid #eee;
  margin: 0 -10px;
}
.bottom {
  padding-top: 15px;
  padding-left: 25px;
}
</style>
