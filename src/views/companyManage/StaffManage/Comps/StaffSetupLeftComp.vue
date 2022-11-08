<template>
  <section class="mp-erp-staff-manage-setup-page-left-comp-wrap">
    <header>
      <p class="mp-common-title-wrap">员工信息</p>
    </header>
    <main>
      <el-form :model="ruleForm" ref="oForm" label-width="120px" hide-required-asterisk >
        <el-form-item
          label="员工真实姓名："
          prop="StaffName"
          :rules="[
            { required: true, message: '姓名不能为空'},
            { min: 2, message: '姓名长度应在2 - 5字符'},
          ]"
        >
          <el-input class="mp-line-input" v-model.trim="ruleForm.StaffName" maxlength="5" placeholder='请输入员工姓名' />
        </el-form-item>
        <el-form-item
          label="手机号："
          prop="Mobile"
          :rules="[
            { required: true, message: '手机号不能为空'},
            { pattern: /1[3456789]\d{9}/, message: '手机号码格式不正确' },
          ]"
        >
          <el-input class="mp-line-input" v-model.trim="ruleForm.Mobile" maxlength="11" placeholder='请输入手机号' />
        </el-form-item>
        <el-form-item
          label="密码："
          prop="Password"
          :rules="[
            { required: !isEdit, message: '密码不能为空'},
            { min: 6, message: '密码至少为6位' },
          ]"
        >
          <el-input class="mp-line-input" v-model.trim="ruleForm.Password" maxlength="16" :placeholder="isEdit ? '不修改密码请留空':'请输入密码'"/>
        </el-form-item>
        <el-form-item
          label="身份证号码："
          prop="IDCard"
          :rules="[
            { required: true, message: '身份证号码不能为空'},
            { validator: idCardvalidator, message: '身份证号码不正确' },
          ]"
        >
          <el-input class="mp-line-input" v-model.trim="ruleForm.IDCard" maxlength="18" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="学历：" class="f">
          <el-select v-model="ruleForm.Education" class="mp-select">
            <el-option v-for="item in EducationEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="地址："
          class="f"
          prop="DetailAddress"
          :rules="[
            { required: true, message: '详细地址不能为空'},
          ]"
        >
          <EpCascaderByLevel2
            title="城市"
            showLine
            class="mb-18"
            :First="ruleForm.Area.RegionalID"
            :Second="ruleForm.Area.CityID"
            :type-list="[['Area', 'RegionalID'], ['Area', 'CityID']]"
            :list="DistrictTreeList"
            :showTitle="false"
            @setCondition="setArea"
          />
          <el-input class="mp-line-input" v-model.trim="ruleForm.DetailAddress" maxlength="40" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="入职日期："
          prop="TimeRecord.JoinDate"
          :rules="[
            { required: true, message: '入职日期不能为空'},
          ]"
        >
          <el-date-picker class="mp-line-input" v-model="localDate" value-format="YYYY-MM-DD" placeholder="入职日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="网络限制：" prop="UseIntranet">
          <el-checkbox v-model="ruleForm.UseIntranet">仅限内部网络</el-checkbox>
        </el-form-item>
      </el-form>
    </main>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ElForm } from 'element-plus';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import { Staff } from '../js/StaffClass';
import { EducationEnumList } from '../js/enums';
import { validateIdCard } from '../js/IdCardvalidator';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const props = defineProps<{
  staffForm: Staff
}>();

const isEdit = computed(() => !!props.staffForm.StaffID);

const ruleForm = ref(new Staff(props.staffForm));

const idCardvalidator = (rule, value, callback) => { // 身份证校验函数
  if (validateIdCard(value)) {
    callback();
    return;
  }
  callback(new Error());
};

const localDate = computed({
  get() {
    return ruleForm.value.TimeRecord?.JoinDate ? ruleForm.value.TimeRecord.JoinDate.split('T')[0].substring(0, 10) : '';
  },
  set(val) {
    console.log(val);
    let timer = '';
    if (val) timer = `${val}T00:00:00.000Z`;
    ruleForm.value.TimeRecord.JoinDate = timer;
  },
});

const setArea = ([[key1, key2], val]) => {
  ruleForm.value[key1][key2] = val;
};

const oForm = ref<InstanceType<typeof ElForm>>();

const submit = async () => {
  if (oForm.value) {
    const bool = await oForm.value.validate().catch(() => null);
    if (bool) {
      return ruleForm.value;
    }
  }
  return null;
};

defineExpose({
  submit,
});

</script>
<style lang='scss'>
.mp-erp-staff-manage-setup-page-left-comp-wrap {
  width: 450px;
  padding-right: 90px;
  box-sizing: border-box;
  > main {
    padding-top: 25px;
    .el-form-item {
      &.f {
        .el-form-item__content {
          padding-top: 3px;
          .mp-common-comps-order-channel-selector-wrap {
            input {
              border-color: #cbcbcb;
            }
            &:first-of-type {
              margin-left: 0;
            }
            &:nth-of-type(2) {
              margin-left: 19px;
            }
          }
          .mp-erp-common-comps-cascade-selector-comp-wrap {
            height: 26px;
          }
        }
      }
      .el-date-editor.el-input {
        width: 110px;
         input {
          padding-right: 0;
          // padding-left: 25px;
        }
        .el-input__suffix {
          display: none;
        }
        .el-input__prefix {
          left: 0;
        }
        .el-input__wrapper {
          padding-right: 0;
        }
      }
      .el-input input {
        font-size: 13px;
        padding-left: 5px;
        &::placeholder {
          color: #aaa;
        }
      }
    }
  }
}
</style>
