<template>
  <div class="staff-select-wrap">
    <span class="label" v-if="title">{{ title }}：</span>
    <el-select
      v-model="value"
      filterable
      reserve-keyword
      placeholder="请选择"
      remote-show-suffix
      class="local"
      :class="`${boxStyle ? '' : 'mp-select'}`"
    >
      <el-option
        v-for="item in myStaffList"
        :key="item.StaffID"
        :label="item.StaffName"
        :value="item.StaffID"
        :disabled="disabledIDs && disabledIDs.includes(item.StaffID)"
      />
    </el-select>
  </div>
</template>

<!-- 员工选择组件 -->
<script setup lang='ts'>
import api from '@/api';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  modelValue: string
  title?: string
  staffList?: Pick<IStaff, 'StaffID' | 'StaffName'>[]
  boxStyle?: boolean
  /** 隐藏掉不限选项 */
  hideUnlimitedOption?: boolean
  disabledIDs?: string[]
  placeholder?: string
}>();

const emit = defineEmits(['update:modelValue', 'getList', 'change']);

const localStaffList = ref<Pick<IStaff, 'StaffID' | 'StaffName'>[]>([]);

const myStaffList = computed(() => {
  const _initialOptions = props.hideUnlimitedOption ? [] : [{ StaffID: '', StaffName: '不限' }];
  return [..._initialOptions, ...(props.staffList || []), ...localStaffList.value];
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    if (val === props.modelValue) return;
    emit('update:modelValue', val);
    emit('getList');
    const t = myStaffList.value.find(it => it.StaffID === val);
    if (t) emit('change', t);
  },
});

const loading = ref(false);

const remoteMethod = async () => {
  loading.value = true;

  const resp = await api.getStaffSelect().catch(() => null);

  loading.value = false;

  if (resp?.data?.isSuccess) {
    localStaffList.value = resp.data.Data;
  }
};

onMounted(() => {
  if (props.staffList) {
    return;
  }
  remoteMethod();
});
</script>

<style scoped lang='scss'>
.staff-select-wrap {
  display: inline-block;
  .label {
    display: inline-block;
    min-width: 5em;
    text-align: right;
    font-weight: 700;
    margin-right: 10px;
  }
  .local {
    :deep(.el-input) {
      width: 140px;
    }
  }
}

</style>
