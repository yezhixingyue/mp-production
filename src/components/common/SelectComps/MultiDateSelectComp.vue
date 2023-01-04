<template>
  <div class="comp-wrap">
    <p>
      <el-radio-group v-model="radio">
        <el-radio v-for="it in ShiftTypeEnumList" :key="it.ID" :label="it.ID">{{it.Name}}</el-radio>
      </el-radio-group>
    </p>
    <div class="date-box">
      <!-- 每周 -->
      <el-checkbox-group v-model="_WeekTypeLimit" v-show="radio === ShiftTypeEnum.weekly">
        <el-checkbox v-for="(it) in weekList" :key='it.ID' :label="it.ID">{{it.Name}}</el-checkbox>
      </el-checkbox-group>
      <!-- 每月 -->
      <el-checkbox-group v-model="_MonthTypeLimit" v-show="radio === ShiftTypeEnum.monthly">
        <el-checkbox v-for="it in 31" :key='it' :label="it">{{it}}号</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { weekList } from '@/views/productionSetting/deliveryTimeManage/Comps/ShiftTimeSetupDialog/ShiftItemClass';
import { ShiftTypeEnum, ShiftTypeEnumList } from '@/views/productionSetting/deliveryTimeManage/enums';
import { computed } from 'vue';

const props = defineProps<{
  type: ShiftTypeEnum
  weekLimit: number[]
  monthLimit: number[]
}>();

const emit = defineEmits(['update:type', 'update:weekLimit', 'update:monthLimit']);

const radio = computed({
  get() {
    return props.type;
  },
  set(val) {
    if (val === props.type) return;

    emit('update:type', val);
  },
});

const _WeekTypeLimit = computed({
  get() {
    return props.weekLimit;
  },
  set(val) {
    emit('update:weekLimit', val);
  },
});

const _MonthTypeLimit = computed({
  get() {
    return props.monthLimit;
  },
  set(val) {
    emit('update:monthLimit', val);
  },
});

</script>

<style scoped lang='scss'>
.comp-wrap {
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
</style>
