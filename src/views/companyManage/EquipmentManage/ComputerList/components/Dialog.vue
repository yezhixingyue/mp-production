<template>
  <DialogContainerComp
    class="dialog" :width="860" top="6vh" :title="title"
    v-model:visible="localVisible"
    @open="open" @submit="submit" @cancel="cancel">
    <div class="dialog-content">
      <!-- 左侧硬件参数 -->
      <el-form :model="ruleForm" ref="formRefLeft" label-width="125px" class="demo-ruleForm" size="small" v-if="ruleForm" @submit.prevent>
        <el-form-item required label="主机编号" prop="code"
          :rules="[{ validator: ruleForm.validateField('code') }]"
        >
          <el-input v-model.trim="ruleForm.code" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="显示器数量" prop="displayNumber"
          :rules="[{ validator: ruleForm.validateField('displayNumber') }]"
        >
          <el-input v-model.number="ruleForm.displayNumber" autocomplete="off" maxlength="2"></el-input>
        </el-form-item>

        <el-form-item required label="显示器编号" prop="displayCode"
          :rules="[{ validator: ruleForm.validateField('displayCode') }]"
        >
          <el-input v-model.trim="ruleForm.displayCode" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="显示器型号" prop="displayModel"
          :rules="[{ validator: ruleForm.validateField('displayModel') }]"
        >
          <el-input v-model="ruleForm.displayModel" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="cpu型号" prop="cpu"
          :rules="[{ validator: ruleForm.validateField('cpu') }]"
        >
          <el-input v-model="ruleForm.cpu" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="内存插槽数量" prop="memorySlotsNumber"
          :rules="[{ validator: ruleForm.validateField('memorySlotsNumber') }]"
        >
          <el-input v-model.number="ruleForm.memorySlotsNumber" autocomplete="off" maxlength="2"></el-input>
        </el-form-item>

        <el-form-item required label="内存型号" prop="memory"
          :rules="[{ validator: ruleForm.validateField('memory') }]"
        >
          <el-input v-model="ruleForm.memory" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="硬盘数量" prop="diskNumber"
          :rules="[{ validator: ruleForm.validateField('diskNumber') }]"
        >
          <el-input v-model.number="ruleForm.diskNumber" autocomplete="off" maxlength="2"></el-input>
        </el-form-item>

        <el-form-item required label="硬盘型号" prop="disk"
          :rules="[{ validator: ruleForm.validateField('disk') }]"
        >
          <el-input v-model="ruleForm.disk" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="显卡型号" prop="graphicsCard"
          :rules="[{ validator: ruleForm.validateField('graphicsCard') }]"
        >
          <el-input v-model="ruleForm.graphicsCard" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="网卡型号" prop="networkCard"
          :rules="[{ validator: ruleForm.validateField('networkCard') }]"
        >
          <el-input v-model="ruleForm.networkCard" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>
      </el-form>

      <!-- 右侧系统与使用相关信息 -->
      <el-form :model="ruleForm" ref="formRefRight" label-width="128px" class="demo-ruleForm" size="small" v-if="ruleForm" @submit.prevent>
        <el-form-item required label="操作系统" prop="os"
          :rules="[{ validator: ruleForm.validateField('os') }]"
        >
          <el-input v-model="ruleForm.os" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="系统盘类型" prop="systermDiskType"
          :rules="[{ validator: ruleForm.validateField('systermDiskType') }]"
        >
          <el-input v-model.trim="ruleForm.systermDiskType" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item required label="mac地址" prop="mac"
          :rules="[{ validator: ruleForm.validateField('mac') }]"
        >
          <el-input v-model.trim="ruleForm.mac" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="ip地址" prop="ip"
          :rules="[{ validator: ruleForm.validateField('ip') }]"
        >
          <el-input v-model.trim="ruleForm.ip" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <!-- 购买来源 -->
        <el-form-item label="采购来源" prop="source"
          :rules="[{ validator: ruleForm.validateField('source') }]"
        >
          <el-input v-model="ruleForm.source" autocomplete="off" maxlength="50"></el-input>
        </el-form-item>

        <!-- 购买时间 -->
        <el-form-item label="采购时间" prop="purchaseAt"
          :rules="[{ validator: ruleForm.validateField('purchaseAt') }]"
        >
          <el-date-picker v-model="ruleForm.purchaseAt" type="date" value-format="yyyy-MM-dd"
           placeholder="" :picker-options="{disabledDate: handleDisabledDate}" />
        </el-form-item>

        <!-- 保修过期时间 -->
        <el-form-item label="保修过期时间" prop="warrantyExpiredAt"
          :rules="[{ validator: ruleForm.validateField('warrantyExpiredAt') }, { validator: validateWarrantyExpiredAt }]"
        >
          <el-date-picker v-model="ruleForm.warrantyExpiredAt" type="date" value-format="yyyy-MM-dd" placeholder="" />
        </el-form-item>

        <!-- 使用状态: 是否已启用 -->
        <el-form-item label="使用状态" prop="state">
           <el-checkbox v-model="ruleForm.state" :true-label="ComputerUseStateEnum.inUse" :false-label="ComputerUseStateEnum.leisure">使用中</el-checkbox>
        </el-form-item>

        <!-- 使用人信息 -->
        <el-form-item required label="使用人" prop="user"
          :rules="[{ validator: ruleForm.validateField('user') }]"
          v-if="ruleForm.state===ComputerUseStateEnum.inUse"
        >
          <el-select v-model="ruleForm.user" filterable style="width: 100%;">
            <el-option v-for="item in staffList" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useStaffList } from '../hooks/useStaffList';
import { ComputerForm } from '../model/Computer';
import { ComputerUseStateEnum } from '../types/enum';
import { IComputer } from '../types/type';

const props = defineProps<{
  visible: boolean
  item: null | IComputer
  isCopy: boolean
}>();

const emit = defineEmits(['update:visible', 'submit']);

const { staffList } = useStaffList();

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const formRefLeft = ref();
const formRefRight = ref();
const ruleForm = ref<null | ComputerForm>(null);

/** 补充校验: */
const validateWarrantyExpiredAt = (rule: unknown, value: unknown, callback: (error?: string | Error) => void) => {
  if (ruleForm.value && ruleForm.value.warrantyExpiredAt && ruleForm.value.purchaseAt
   && new Date(ruleForm.value.warrantyExpiredAt) < new Date(ruleForm.value.purchaseAt)) {
    callback(new Error('保修到期时间不能早于采购时间'));
    return;
  }

  callback();
};

/** 采购日期不能晚于今天 */
const handleDisabledDate = (e) => new Date(e) > new Date();

const title = computed(() => {
  if (props.item) {
    if (props.isCopy) {
      return '复制新增电脑';
    }

    return '编辑电脑';
  }

  return '添加电脑';
});

const open = async () => {
  if (formRefLeft.value) formRefLeft.value.resetFields();
  if (formRefRight.value) formRefRight.value.resetFields();

  ruleForm.value = new ComputerForm(props.item, props.isCopy);
};

const cancel = () => {
  localVisible.value = false;
};

const submit = async () => {
  if (!ruleForm.value || !formRefLeft.value || !formRefRight.value) return;

  const [bool1, bool2] = await Promise.all([
    formRefLeft.value.validate().catch(() => false),
    formRefRight.value.validate().catch(() => false),
  ]);

  if (bool1 && bool2) {
    const params = ruleForm.value.getParams();
    if (!params) return;

    emit('submit', params);
  }
};
</script>
<style lang='scss' scoped>
.dialog-content {
  display: flex;
  margin: 0 auto;

  > form {
    width: 348px;

    --el-component-size-small: 30px;

    :deep(label.el-form-item__label) {
      font-size: 13px;
    }
  }
}
</style>
