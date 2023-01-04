<template>
  <DialogContainerComp :title="`发货班次`" appendToBody primary-text="确定"
   :visible='localVisible' :width="660" top="10vh" @submit="submit" @open="onOpen" @cancel="cancel" @closed="closed">
    <template v-if="ruleForm">
      <div class="top">
        <label class="l">设定时间为：</label>
        <MultiDateSelectComp v-model:type="ruleForm.ShiftType" v-model:month-limit="ruleForm._MonthTypeLimit" v-model:week-limit="ruleForm._WeekTypeLimit" />
      </div>
      <hr class="line" />
      <div class="bottom">
        <p>
          <mp-button class="ft-13" type="primary" link @click="onAddClick">+ 添加发车时间点</mp-button>
        </p>
        <ul class='list' ref="oUl">
          <li v-for="(it, i) in ruleForm.ShiftTime" :key="it._key">
            <el-time-picker
              v-model="it._date"
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              :default-value='defaultBeginTime'
              placeholder="20:00"
              :teleported="false"
            >
            </el-time-picker>
            <mp-button v-show="ruleForm.ShiftTime.length > 1" @click="onShiftRemoveClick(i)" link>
              <i class="icon-delete iconfont"></i>
              <span>删除</span>
            </mp-button>
          </li>
        </ul>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import MultiDateSelectComp from '@/components/common/SelectComps/MultiDateSelectComp.vue';
import { computed, nextTick, ref } from 'vue';
import { IShiftRowItem } from '../../types';
import { ShiftItemClass } from './ShiftItemClass';

const props = defineProps<{
  visible: boolean,
  curEditShiftTime: IShiftRowItem | null,
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const defaultBeginTime = computed(() => new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0)));

const ruleForm = ref<null | ShiftItemClass>(null);

const onShiftRemoveClick = (index: number) => {
  ruleForm.value?.ShiftTime.splice(index, 1);
};

const oUl = ref<InstanceType<typeof HTMLElement>>();

const onAddClick = async () => {
  ruleForm.value?.addOneNewShiftTime();
  if (oUl.value) {
    await nextTick();
    oUl.value.scrollTop = 10000;
  }
};

const onOpen = () => {
  ruleForm.value = new ShiftItemClass(props.curEditShiftTime);
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  ruleForm.value = null;
};

const submit = () => {
  const result = ruleForm.value?.submit();
  if (result) {
    emit('submit', result);
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
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

ul.list {
  padding-top: 15px;
  height: 145px;
  overflow: scroll;
  overflow: overlay;
  @include scroll;
  scroll-behavior: smooth !important;
  > li {
    margin-bottom: 8px;
    :deep(.el-input) {
      height: 30px;
      width: 140px;
      margin-right: 30px;
    }
    > button {
      font-size: 12px;
      i {
        font-size: 14px;
        margin-right: 8px;
        color: #ff3769;
        transform: scaleX(0.95) scaleY(1.05);
      }
      span {
        color: #989898;
      }
      &:hover {
        span {
          color: #585858;
        }
      }
      &:active {
        span {
          color: #444;
        }
      }
    }
  }
}
</style>
